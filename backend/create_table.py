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

    # Create the table if it doesn't exist
    create_table_query = """
    CREATE TABLE IF NOT EXISTS user_gangertabell_history (
        x INTEGER PRIMARY KEY CHECK (x BETWEEN 1 AND 10),
        correct_count INTEGER DEFAULT 0,
        incorrect_count INTEGER DEFAULT 0
    );
    """
    
    cursor.execute(create_table_query)
    connection.commit()
    print("Table created successfully")

    # Insert data after table creation (for x between 1 and 10)
    insert_query = """
    INSERT INTO user_gangertabell_history (x) 
    VALUES (%s)
    ON CONFLICT (x) DO NOTHING;
    """
    data_to_insert = [(i,) for i in range(1, 11)]  # Insert x values from 1 to 10
    cursor.executemany(insert_query, data_to_insert)
    connection.commit()
    print("Data inserted successfully")

except Exception as error:
    print(f"Error: {error}")

finally:
    if connection:
        cursor.close()
        connection.close()
        print("PostgreSQL connection closed")
