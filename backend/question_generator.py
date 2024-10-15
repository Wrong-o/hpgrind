import numpy as np
import matplotlib.pyplot as plt
import random
import math

class QuestionGenerator:
    def __init__(self):
        pass
        #LÄGG TILL DATABASE CONNECTION HÄR
    """
    Keys:
    input: 
    level av spelares nivå, mellan 1 och 4
    output: 
    "variables" är det som behövs för att frontend ska kunna formulera en fråga 
    "answers" är svarsanlternativen som kommer visas direkt på knapparna, innefattar rätt svar
    "correct_answers" är det rätta svaret

    """
    
    def gangertabell(self, history: list[dict[any, float]]):
        choices =  []
        weights = []
        for x, correct_count, incorrect_count in history:
            ratio = (max(correct_count, 1) / max(incorrect_count, 1))
            choices.append(x)
            weights.append(ratio)

        x1, x2, = random.choices(choices, weights=weights, k=2)
        correct_answer = x1 * x2
        answers = set()
    
        while len(answers) < 3:
            potential_answers = [
                correct_answer - x1,
                correct_answer + x1,
                correct_answer - x1 // 2,
                correct_answer + x1 // 2,
                correct_answer - x2,
                correct_answer + x2,
                correct_answer - x2 // 2,
                correct_answer + x2 // 2
            ]
            
            for answer in potential_answers:
                # Ensure the answer is an integer and not the correct answer
                if answer != correct_answer and answer not in answers:
                    answers.add(answer)
                if len(answers) == 3:
                    answers = list(answers)
                    break

        answers.append(correct_answer)
        answers = list(answers)
        random.shuffle(answers)

        return {"variables": [x1, x2], "answers": answers, "correct_answer": correct_answer}
    
    def medelvarde(self, level: int):
        numbers = []
        #The level_setup key: Range start, Range end, lowest k, highest k
        level_setup = {
            1: [1, 20, 2, 2],
            2: [1, 20, 3, 5],
            3: [-20, -1, 3, 5],
            4: [-20, 20, 3, 5]
        }
        bottom = level_setup[level][0]
        top = level_setup[level][1]
        k_bottom = level_setup[level][2]
        k_top = level_setup[level][3]
        k = random.randint(k_bottom, k_top)

        for x in range(k):
            numbers.append(random.randint(bottom, top))
        while sum(numbers) % k != 0:
            numbers[0] += 1
        correct_answer = sum(numbers) // k
        potential_wrong_answers = [
            correct_answer + 1,
            correct_answer + 2,
            correct_answer + 3,
            correct_answer + 4,
            correct_answer - 1,
            correct_answer - 2,
            correct_answer - 3,
            correct_answer - 4
        ]
        answers = set()
        answers.add(correct_answer)
        while len(answers) < 4:
            answers.add(random.choice(potential_wrong_answers))
        answers = list(answers)
        random.shuffle(answers)
        return {"variables": numbers, "answers": answers, "correct_answer": correct_answer}
    
    def potens_multi_div(self, level: int):
        level_setup = {
            1: [1, 10, 2, 2, False],
            2: [1, 10, 2, 2, True],
            3: [-1, -10, 2, 2, True],
            4: [-10, 10, 3, 4, True]
        }

        base = random.randint(1, 10)
        # Set bottom and top limits based on level
        bottom = level_setup[level][0]
        top = level_setup[level][1]

        # Set k based on level
        k = random.randint(level_setup[level][2], level_setup[level][3]) 


        operations = ["*"]
        if level_setup[level][4]:
            operations.append("/")


                
        equation = []
        equation.append(random.randint(bottom, top))
        correct_answer = equation[0]
        for i in range(k):
            equation.append(random.choice(operations))
            equation.append(random.randint(bottom,top))
            if equation[-2] == "/":
                correct_answer -= equation[-1]
            else:
                correct_answer +=equation[-1]



        potential_wrong_answers = [
            correct_answer + 1,
            correct_answer + 2,
            correct_answer + 3,
            correct_answer + 4,
            correct_answer - 1,
            correct_answer - 2,
            correct_answer - 3,
            correct_answer - 4
        ]
        exponents = set()
        exponents.add(correct_answer)
        while len(exponents) < 4:
            print("Adding new")
            exponents.add(random.choice(potential_wrong_answers))
        
        answers = []
        for exponent in exponents:
            answers.append(str(base) + "^" + str(exponent))
        correct_answer = str(base) + "^" + str(correct_answer)
        random.shuffle(answers)
        return {"variables": [base, equation], "answers": answers, "correct_answer": correct_answer}
    
    def prim_tal_spann(self, level: int):
        #Level setup: k
        level_setup = {
            1: 4,
            2: 6,
            3: 8,
            4: 10
        }

        start = random.randint(1, 90)
        end = start + level_setup[level]

        def is_prime(n):
            if n < 2:
                return False
            for i in range(2, int(math.sqrt(n))+ 1):
                if n % i == 0:
                    return False
            return True
        def count_primes_in_range(start, end):
            count = 0
            for num in range(start, end + 1):
                if is_prime(num):
                    count += 1
            return count
        
        correct_answer = count_primes_in_range(start, end)
        potential_wrong_answers = [
            correct_answer + 1,
            correct_answer + 2,
            correct_answer - 1,
            correct_answer - 2
        ]
            
        answers = set()
        answers.add(correct_answer)
        if correct_answer == 0:
            answers.add(1)
            answers.add(2)
            answers.add(3)
        if correct_answer == 1:
            answers.add(0)
            answers.add(2)
            answers.add(3)
        while len(answers) < 4:
            print("testing answser")
            adding_answer = random.choice(potential_wrong_answers)
            if adding_answer > 0:
                answers.add(adding_answer)
        answers = list(answers)
        random.shuffle(answers)
        return {"variables": [start, end], "answers": answers, "correct_answer": correct_answer} 


    def procent(self, level: int):
        #Level setup: smallest percent possible
        level_setup = {
            1: 25,
            2: 10,
            3: 5,
            4: 1
        }

        percent = random.randrange(level_setup[level], 100, step= level_setup[level])
        number = random.randrange(20, 90)
        while (number * percent / 100) % 1 != 0:
            number += 1
        correct_answer = int(number * percent / 100)

        potential_wrong_answers = [
            correct_answer + 1,
            correct_answer + 2,
            correct_answer - 1,
            correct_answer - 2
        ]

        answers = set()
        answers.add(correct_answer)
        while len(answers) < 4:
            answers.add(random.choice(potential_wrong_answers))
        answers = list(answers)
        random.shuffle(answers)

        return {"variables": [percent, number], "answers": answers, "correct_answer": correct_answer} 