import numpy as np
import matplotlib.pyplot as plt
import random

class QuestionGenerator:
    def __init__(self):
        pass
    
    def gangertabell(self, history: list[dict[any, float]]):
        choices =  []
        weights = []
        for x, correct_count, incorrect_count in history:
            ratio = (max(correct_count, 1) / max(incorrect_count, 1))
            choices.append(x)
            weights.append(ratio)

        x1, x2, = random.choices(choices, weights=weights, k=2)
        correct_answer = x1 * x2
        wrong_answers = set()
    
    # Create a range of potential wrong answers
        while len(wrong_answers) < 3:
        # Generate potential wrong answers
            potential_wrong_answers = [
                correct_answer - x1,
                correct_answer + x1,
                correct_answer - x1 // 2,
                correct_answer + x1 // 2,
                correct_answer - x2,
                correct_answer + x2,
                correct_answer - x2 // 2,
                correct_answer + x2 // 2
            ]
            
            # Add plausible wrong answers to the set
            for answer in potential_wrong_answers:
                # Ensure the answer is an integer and not the correct answer
                if answer != correct_answer and answer not in wrong_answers:
                    wrong_answers.add(answer)
                # Stop if we have 3 unique wrong answers
                if len(wrong_answers) == 3:
                    break


        return x1, x2, correct_answer, list(wrong_answers)

        
        