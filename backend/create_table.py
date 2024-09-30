import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

# Database connection parameters
db_config = {
    'host': os.getenv('DB_HOST'),
    'port': os.getenv('DB_PORT'),
    'dbname': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD')
}


# Initialize connection as None
connection = None

try:
    connection = psycopg2.connect(**db_config)
    cursor = connection.cursor()

    # Create the users table if it doesn't exist
    create_table_query = """
    CREATE TABLE IF NOT EXISTS answer_statistics (
        id SERIAL PRIMARY KEY,
        x INTEGER NOT NULL,
        y INTEGER NOT NULL,
        correct_count INTEGER DEFAULT 0,
        incorrect_count INTEGER DEFAULT 0,
        UNIQUE (x, y)  -- Ensures each combination of x and y is unique
    );
    """
    
    cursor.execute(create_table_query)
    connection.commit()
    print("Table created successfully")

    # # Insert data after table creation
    # insert_query = """
    # INSERT INTO users (username, password)
    # VALUES (%s, %s);
    # """
    # data_to_insert = [
    #     ('user1', 'password1'),
    #     ('user2', 'password2')
    # ]
    # cursor.executemany(insert_query, data_to_insert)
    # connection.commit()
    # print("Data inserted successfully")

except Exception as error:
    print(f"Error: {error}")

finally:
    if connection:
        cursor.close()
        connection.close()
        print("PostgreSQL connection closed")