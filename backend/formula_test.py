import random
import string

def generate_variable():
    return random.choice(string.ascii_lowercase)

def generate_fraction():
    numerator = random.randint(1, 10)
    denominator = random.randint(2, 10)
    return f"\\frac{{{numerator}}}{{{denominator}}}"

def generate_power():
    base = generate_variable()
    exponent = random.randint(2, 5)
    return f"{base}^{{{exponent}}}"

def generate_equation():
    components = [
        generate_fraction(),
        generate_power(),
        generate_variable(),
        str(random.randint(1, 10))
    ]
    random.shuffle(components)
    
    operators = ['+', '-', '\\times', '\\div']
    equation = ' '.join([f"{comp} {random.choice(operators)}" for comp in components[:-1]] + [components[-1]])
    
    return f"{equation} = {random.randint(1, 100)}"

if __name__ == "__main__":
    for _ in range(5):
        print(generate_equation())