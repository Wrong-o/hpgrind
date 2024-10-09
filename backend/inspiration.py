from fastapi import APIRouter
import random

router = APIRouter()

# Lista med inspirerande citat
quotes = [
    "Set some goals. Be quiet about them. Then, destroy your goals. – Jim Lion",
    "Success is not the key to happiness. Happiness is the key to success. – Albert Schweitzer",
    "Believe you can and you're halfway there. – Theodore Roosevelt",
    "Your time is limited, don't waste it living someone else's life. – Steve Jobs",
    "You miss 100% of the shots you don't take. – Wayne Gretzky",
    "This is twenty percent skill, eighty percent beer. Be a hundred percent clear 'cause Ryu is ill - Fort Minor",
    "That's an awfully hot coffepot. - Eminem",
    "Life is a crazy mystical thing and sometimes you just go out like a buster. - Mang0"
]

@router.get("/get-inspiration")
def get_inspiration():
    return {"quote": random.choice(quotes)}
