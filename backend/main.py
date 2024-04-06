from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Body, HTTPException, Depends, status, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from google.cloud import storage
from pydantic import BaseModel
from pymemcache.client import base
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session

import os
import random

from models.course import Course
from models.user import User
from models.module import Module
from models.material import Material

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.db = create_engine(os.getenv("DATABASE_URL"))
    app.state.cache = base.Client((os.getenv("MEMCACHE_HOST"), int(os.getenv("MEMCACHE_PORT"))))
    app.state.session_count = 0
    app.state.gcs_client = storage.Client.from_service_account_json("gcs.json")
    yield
    app.state.db.dispose()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBasic()

class CourseBody(BaseModel):
    name: str
    description: str
    subdomain: str

@app.get("/")
def read_root():
    return {"Version": "1.0"}

@app.post("/register")
def register(username: str = Body(...), password: str = Body(...)):
    with Session(app.state.db) as session:
        user = User(username=username, password=password)
        session.add(user)
        session.commit()
    return {"Success": True}

def authenticate_user(credentials: HTTPBasicCredentials = Depends(security)):
    with Session(app.state.db) as session:
        user_query = select(User).where(User.username == credentials.username)
        user = session.execute(user_query).scalar()
        if user is None or user.password != credentials.password:
            raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid credentials",
                    headers={"WWW-Authenticate": "Basic"},
                )
        return user
    
def create_session(user_id: int):
    session_id = random.randint(100000000 * app.state.session_count, 100000000 * (app.state.session_count + 1)-1)
    app.state.session_count += 1
    app.state.cache.set(f"session-{session_id}", user_id)
    return session_id

@app.post("/login")
def login(user: User = Depends(authenticate_user)):
    session_id = create_session(user.id)
    return {"message": "Logged in successfully", "session_id": session_id}

def get_authenticated_user_from_session_id(request: Request):
    session_id = request.cookies.get("session_id")
    if session_id is None or app.state.cache.get(f"session-{session_id}") is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid session ID",
        )
    # Get the user from the session
    user = get_user_from_session(int(session_id))
    return user

# Use the valid session id to get the corresponding user from the users dictionary
def get_user_from_session(session_id: int):
    user_id = app.state.cache.get(f"session-{session_id}")
    if user_id is None:
        return None
    user_id = int(user_id)
    with Session(app.state.db) as session:
        user_query = select(User).where(User.id == user_id)
        user = session.execute(user_query).scalar()
        return user

@app.post("/logout")
def logout(request: Request):
    session_id = request.cookies.get("session_id")
    if session_id is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authenticated")
    app.state.cache.delete(f"session-{session_id}")
    return {"message": "Logged out successfully"}

@app.get("/course")
def get_courses():
    with Session(app.state.db) as session:
        courses = session.execute(select(Course)).scalars().all()
        return courses
    
@app.post("/course")
def create_course(courseBody: CourseBody, user: User = Depends(get_authenticated_user_from_session_id)):
    with Session(app.state.db) as session:
        course = Course(name=courseBody.name, description=courseBody.description, subdomain=courseBody.subdomain, owner_id=user.id)
        session.add(course)
        session.commit()
        app.state.gcs_client.create_bucket(courseBody.subdomain)
        return course

@app.get("/course/{subdomain}")
def get_course(subdomain: str):
    with Session(app.state.db) as session:
        course_query = select(Course).where(Course.subdomain == subdomain)
        course = session.execute(course_query).scalar()
        if course is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
        return course

@app.delete("/course/{subdomain}")
def delete_course(subdomain: str, user: User = Depends(get_authenticated_user_from_session_id)):
    with Session(app.state.db) as session:
        course_query = select(Course).where(Course.subdomain == subdomain)
        course = session.execute(course_query).scalar()
        if course is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
        if course.owner_id != user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
        bucket = app.state.gcs_client.get_bucket(subdomain)
        for blob in bucket.list_blobs():
            blob.delete()
        bucket.delete(force=True)
        session.delete(course)
        session.commit()
        return {"message": "Course deleted successfully"}

@app.get("/course/{subdomain}/module")
def get_modules(subdomain: str):
    with Session(app.state.db) as session:
        course_query = select(Course).where(Course.subdomain == subdomain)
        course = session.execute(course_query).scalar()
        if course is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
        module_query = select(Module).where(Module.course_id == course.id)
        modules = session.execute(module_query).scalars().all()
        return modules

@app.post("/course/{subdomain}/module")
def create_module(subdomain: str, name: str = Body(...), description: str = Body(...), position: int = Body(...), user: User = Depends(get_authenticated_user_from_session_id)):
    with Session(app.state.db) as session:
        course_query = select(Course).where(Course.subdomain == subdomain)
        course = session.execute(course_query).scalar()
        if course is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
        if course.owner_id != user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
        module = Module(course_id=course.id, name=name, description=description, position=position)
        session.add(module)
        session.commit()
        return module

@app.delete("/course/{subdomain}/module/{module_id}")
def delete_module(subdomain: str, module_id: int, user: User = Depends(get_authenticated_user_from_session_id)):
    with Session(app.state.db) as session:
        course_query = select(Course).where(Course.subdomain == subdomain)
        course = session.execute(course_query).scalar()
        if course is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
        if course.owner_id != user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
        module_query = select(Module).where(Module.id == module_id)
        module = session.execute(module_query).scalar()
        if module is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Module not found")
        material_query = select(Material).where(Material.module_id == module_id)
        materials = session.execute(material_query).scalars().all()
        for material in materials:
            bucket = app.state.gcs_client.get_bucket(subdomain)
            blob = bucket.blob(material.filename)
            blob.delete()
        session.delete(module)
        session.commit()
        return {"message": "Module deleted successfully"}
    
@app.post("/course/{subdomain}/module/{module_id}/material")
def create_material(subdomain: str, module_id: int, name: str = Form(...), position: int = Form(...), file: UploadFile = File(...), user: User = Depends(get_authenticated_user_from_session_id)):
    with Session(app.state.db) as session:
        course_query = select(Course).where(Course.subdomain == subdomain)
        course = session.execute(course_query).scalar()
        if course is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
        if course.owner_id != user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
        module_query = select(Module).where(Module.id == module_id)
        module = session.execute(module_query).scalar()
        if module is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Module not found")
        bucket = app.state.gcs_client.get_bucket(subdomain)
        filenames = [blob.name for blob in bucket.list_blobs()]
        i = 0
        while file.filename in filenames:
            i += 1
            file.filename = f"{i}_{file.filename}"
        blob = bucket.blob(file.filename)
        blob.upload_from_file(file.file, rewind=True)
        material = Material(course_id=course.id, name=name, filename=file.filename, module_id=module_id, position=position)
        session.add(material)
        session.commit()
        return material

@app.get("/course/{subdomain}/material")
def get_materials(subdomain: str):
    with Session(app.state.db) as session:
        course_query = select(Course).where(Course.subdomain == subdomain)
        course = session.execute(course_query).scalar()
        if course is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
        material_query = select(Material).where(Material.course_id == course.id)
        materials = session.execute(material_query).scalars().all()
        return materials

@app.get("/course/{subdomain}/material/{material_id}")
def get_material(subdomain: str, material_id: int):
    with Session(app.state.db) as session:
        course_query = select(Course).where(Course.subdomain == subdomain)
        course = session.execute(course_query).scalar()
        if course is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
        
        material_query = select(Material).where(Material.course_id == course.id, Material.id == material_id)
        material = session.execute(material_query).scalar()
        if material is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Material not found")
        
        bucket = app.state.gcs_client.get_bucket(subdomain)
        blob = bucket.blob(material.filename)
        return blob.download_as_string()

@app.delete("/course/{subdomain}/material/{material_id}")
def delete_material(subdomain: str, material_id: int, user: User = Depends(get_authenticated_user_from_session_id)):
    with Session(app.state.db) as session:
        course_query = select(Course).where(Course.subdomain == subdomain)
        course = session.execute(course_query).scalar()
        if course is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
        if course.owner_id != user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
        material_query = select(Material).where(Material.id == material_id)
        material = session.execute(material_query).scalar()
        if material is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Material not found")
        bucket = app.state.gcs_client.get_bucket(subdomain)
        blob = bucket.blob(material.filename)
        blob.delete()
        session.delete(material)
        session.commit()
        return {"message": "Material deleted successfully"}
