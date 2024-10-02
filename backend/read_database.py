from dotenv import load_dotenv
import os
import psycopg2

# Load environment variables from .env file
load_dotenv()

# Retrieve database credentials from environment variables
db_config = {
    'host': os.getenv('DB_HOST'),
    'port': os.getenv('DB_PORT', '5432'),
    'dbname': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD')
}

# Initialize connection as None
connection = None

try:
    connection = psycopg2.connect(**db_config)
    cursor = connection.cursor()

    # SQL query to select all rows from the 'users' table
    select_query = "SELECT x, y, incorrect_count, correct_count FROM answer_statistics;"
    cursor.execute(select_query)

    # Fetch all rows
    rows = cursor.fetchall()

    # Print each row
    for row in rows:
        print(f"X: {row[0]}, Y: {row[1]}, incorrect_count: {row[2]}, correct_count: {row[3]}")

except Exception as error:
    print(f"Error: {error}")

finally:
    if connection:
        cursor.close()
        connection.close()
        print("PostgreSQL connection closed")