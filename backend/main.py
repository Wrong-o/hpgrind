from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class User(BaseModel):
    email: str
    password: str

@app.post("/api/login")
async def login(user: User):
    # Implement login logic here
    return {"message": "Login successful", "user": user.email}

@app.post("/api/signup")
async def signup(user: User):
    # Implement signup logic here
    return {"message": "Signup successful", "user": user.email}