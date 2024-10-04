from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import random
from sqlalchemy import create_engine, Column, Integer, String, select, update
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import matplotlib.pyplot as plt
import numpy as np
from sqlalchemy import select
import os
from dotenv import load_dotenv
from heatmap_plotter import plot_heatmap
import traceback


load_dotenv()
app = FastAPI()

db_config = {
    'host': os.getenv('DB_HOST'),
    'port': os.getenv('DB_PORT', '5432'),
    'dbname': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD')
}
# Använd den här igen för att göra det säkrare! Den andra tillåter allt.
# # CORS setup
# allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://hpgrind.se.s3-website.eu-north-1.amazonaws.com").split(",")
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=allowed_origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://hpgrind.se.s3-website.eu-north-1.amazonaws.com"],  # Your S3 bucket URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
   )


# Database configuration (adjust as necessary)
SQLALCHEMY_DATABASE_URL = f"postgresql://{db_config['user']}:{db_config['password']}@{db_config['host']}:{db_config['port']}/{db_config['dbname']}"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Answer submission model
class AnswerSubmission(BaseModel):
    x: int
    y: int
    is_correct: bool

# Define the answer statistics table

class AnswerStatistics(Base):
    __tablename__ = "answer_statistics"

    id = Column(Integer, primary_key=True, index=True)
    x = Column(Integer, nullable=False)
    y = Column(Integer, nullable=False)
    correct_count = Column(Integer, default=0, nullable=False)
    incorrect_count = Column(Integer, default=0, nullable=False)


@app.post("/submit-answer")
def submit_answer(submission: AnswerSubmission):
    db = SessionLocal()
    print(f"Received submission: {submission}")
    try:
        # Check if the combination exists
        stat = db.execute(select(AnswerStatistics).where(
            AnswerStatistics.x == submission.x,
            AnswerStatistics.y == submission.y
        )).scalars().first()
        if not stat:
            # If it doesn't exist, create a new entry
            stat = AnswerStatistics(x=submission.x, y=submission.y, correct_count=0, incorrect_count=0)
            db.add(stat)
        else:
            # Ensure correct_count and incorrect_count are initialized
            if stat.correct_count is None:
                stat.correct_count = 0
            if stat.incorrect_count is None:
                stat.incorrect_count = 0
        
        # Update counts based on correctness
        if submission.is_correct:
            stat.correct_count += 1
        else:
            stat.incorrect_count += 1
        
        db.commit()
        print("Updated successfully")
        return {"message": "Answer statistics updated successfully"}
    except Exception as e:
        db.rollback()  # Rollback in case of error
        error_msg = f"Error submitting answer: {str(e)}\n{traceback.format_exc()}"
        print(error_msg)  # This will print to your console/logs
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@app.get("/get-question")
def get_question():
    x, y = random.randint(1, 10), random.randint(1, 10)
    question = f"{x} * {y}?"
    correct_answer = x * y
    answers = [correct_answer, x * (y + 1), x * (y - 1), x * (y + 2), x * (y + 3)]
    random.shuffle(answers)
    return {"variables": [x, y], "question": question, "answers": answers, "correct_answer": correct_answer}


# Assuming you have a function to get your database session
def get_answer_statistics():
    db = SessionLocal()
    try:
        results = db.execute(select(AnswerStatistics)).scalars().all()
        return results
    finally:
        db.close()

# statistics = get_answer_statistics()
# plot_heatmap(statistics)

