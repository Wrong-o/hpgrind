from dotenv import load_dotenv
import os
import psycopg2
import traceback

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
    select_query = "SELECT x, incorrect_count, correct_count FROM user_gangertabell_history;"
    cursor.execute(select_query)

    # Fetch all rows
    rows = cursor.fetchall()
    print(rows)




except Exception as error:
    print(f"Error: {error}")
    traceback.print_exc()  # This will print the full error stack trace


finally:
    if connection:
        cursor.close()
        connection.close()
        print("PostgreSQL connection closed")