# Databricks notebook source
# (Expo/React Native setup commands are for reference; do not run in Python)
# npx create-expo-app manifestme
# cd manifestme
# npm install @react-navigation/native react-native-paper @react-native-async-storage/async-storage

# (Python backend setup commands for reference)
# pip install fastapi uvicorn pydantic

# COMMAND ----------

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

# Models
class User(BaseModel):
    id: int
    name: str
    email: str

class Goal(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str]

class MicroGoal(BaseModel):
    id: int
    goal_id: int
    title: str
    completed: bool = False

class JournalEntry(BaseModel):
    id: int
    user_id: int
    mood: str
    content: str

# Placeholder endpoints
@app.post("/register")
def register_user(user: User):
    return {"status": "ok", "user": user}

@app.post("/goal")
def create_goal(goal: Goal):
    return {"status": "goal_created", "goal": goal}

@app.post("/microgoal")
def create_microgoal(microgoal: MicroGoal):
    return {"status": "microgoal_created", "microgoal": microgoal}

@app.post("/journal")
def create_journal(entry: JournalEntry):
    return {"status": "journal_logged", "entry": entry}

@app.get("/progress/{user_id}")
def get_progress(user_id: int):
    return {"user_id": user_id, "progress": "mock-progress"}