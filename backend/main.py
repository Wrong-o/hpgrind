from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI()

# Allow CORS for requests from the React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust if your React app is served from a different origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the Result model
class Result(BaseModel):
    variables: list
    selectedAnswer: str
    isCorrect: bool

@app.get("/get-question")
def get_question():
    x, y = random.randint(1, 10), random.randint(1, 10)
    question = f"{x} * {y}?"
    correct_answer = x * y
    # Generate answers including the correct one and some incorrect options
    answers = [correct_answer, x * (y + 1), x * (y - 1), x * (y + 2), x * (y + 3)]
    random.shuffle(answers)  # Shuffle the answers to randomize their order

    print("Generated question:", question)  # Debugging print statement
    return {"variables": [x, y], "question": question, "answers": answers, "correct_answer": correct_answer}

@app.post("/submit-result")
async def submit_result(result: Result):
    # Here you can process the result, like saving it to a database
    print(f"Received result: {result}")
    return {"message": "Result received successfully"}


# To run the FastAPI application, use:
# uvicorn main:app --reload
