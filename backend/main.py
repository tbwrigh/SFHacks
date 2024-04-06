from contextlib import asynccontextmanager
from fastapi import FastAPI
from pydantic import BaseModel
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

import os

from models.subdomains import Subdomain

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.db = create_engine(os.getenv("DATABASE_URL"))
    yield
    app.state.db.dispose()

app = FastAPI(lifespan=lifespan)

class SubdomainBody(BaseModel):
    name: str

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/subdomains")
def read_subdomains():
    with Session(app.state.db) as session:
        return session.query(Subdomain).all()

@app.post("/subdomains")
def create_subdomain(subdomain: SubdomainBody):
    subdomain = Subdomain(subdomain=subdomain.name)
    with Session(app.state.db) as session:
        session.add(subdomain)
        session.commit()
        return subdomain

@app.get("/subdomains/{subdomain_id}")
def read_subdomain(subdomain_id: int):
    with Session(app.state.db) as session:
        return session.query(Subdomain).get(subdomain_id)

@app.put("/subdomains/{subdomain_id}")
def update_subdomain(subdomain_id: int, subdomain: SubdomainBody):
    subdomain = Subdomain(subdomain=subdomain.name)
    with Session(app.state.db) as session:
        session.query(Subdomain).filter(Subdomain.id == subdomain_id).update(subdomain)
        session.commit()
        return subdomain

@app.delete("/subdomains/{subdomain_id}")
def delete_subdomain(subdomain_id: int):
    with Session(app.state.db) as session:
        subdomain = session.query(Subdomain).get(subdomain_id)
        session.delete(subdomain)
        session.commit()
        return subdomain