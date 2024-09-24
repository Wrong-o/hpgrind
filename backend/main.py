from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Tillåt alla ursprung (React kan köra från en annan port)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React körs oftast på port 3000
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/get-question")
def get_question():
    question = "Vad är 2 + 2?"
    answers = ["3", "4", "5", "6", "7"]
    correct_answer = "4"
    return {"question": question, "answers": answers, "correct_answer": correct_answer}
