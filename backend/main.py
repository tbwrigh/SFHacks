from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Body, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from pydantic import BaseModel
from pymemcache.client import base
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session

import os
import random

from models.subdomains import Subdomain
from models.user import User

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.db = create_engine(os.getenv("DATABASE_URL"))
    app.state.cache = base.Client((os.getenv("MEMCACHE_HOST"), int(os.getenv("MEMCACHE_PORT"))))
    app.state.session_count = 0
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

class SubdomainBody(BaseModel):
    name: str

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