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


load_dotenv()
app = FastAPI()

db_config = {
    'host': os.getenv('DB_HOST'),
    'port': os.getenv('DB_PORT', '5432'),
    'dbname': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD')
}

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow your React app's origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
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
    correct_count = Column(Integer, default=0)
    incorrect_count = Column(Integer, default=0)

@app.post("/submit-answer")
def submit_answer(submission: AnswerSubmission):
    db = SessionLocal()
    try:
        # Check if the combination exists
        stat = db.execute(select(AnswerStatistics).where(
            AnswerStatistics.x == submission.x, 
            AnswerStatistics.y == submission.y
        )).scalars().first()

        if not stat:
            # If it doesn't exist, create a new entry
            stat = AnswerStatistics(x=submission.x, y=submission.y)
            db.add(stat)

        # Update counts based on correctness
        if submission.is_correct:
            stat.correct_count += 1
        else:
            stat.incorrect_count += 1

        db.commit()
        return {"message": "Answer statistics updated successfully"}
    except Exception as e:
        db.rollback()  # Rollback in case of error
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

# Plotting the heatmap
statistics = get_answer_statistics()
x_values = [stat.x for stat in statistics]
y_values = [stat.y for stat in statistics]
correct_counts = [stat.correct_count for stat in statistics]
incorrect_counts = [stat.incorrect_count for stat in statistics]

# Creating a 2D grid for the heatmap
heatmap_data = np.array(correct_counts).reshape((max(x_values) + 1, max(y_values) + 1))

plt.imshow(heatmap_data, cmap='hot', interpolation='nearest')
plt.colorbar()
plt.title('Heatmap of Correct Answers')
plt.xlabel('Y Values')
plt.ylabel('X Values')
plt.show()
