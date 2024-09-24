from fastapi import FastAPI
import random

app = FastAPI()

@app.get("/get-question")
def get_question():
    n1 = random.int(1, 10)
    question = "Vad är test + 2?"
    answers = ["3", "4", "5", "6", "7"]
    correct_answer = "4"
    return {"question": question, "answers": answers, "correct_answer": correct_answer}
