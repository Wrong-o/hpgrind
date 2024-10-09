# user_data_collector.py
from dotenv import load_dotenv
import os
import psycopg2

# Load environment variables from .env file
load_dotenv()

class UserHistoryFetcher:
    def __init__(self):
        # Retrieve database credentials from environment variables
        self.db_config = {
            'host': os.getenv('DB_HOST'),
            'port': os.getenv('DB_PORT', '5432'),
            'dbname': os.getenv('DB_NAME'),
            'user': os.getenv('DB_USER'),
            'password': os.getenv('DB_PASSWORD')
        }
        self.connection = None
    
    def connect(self):
        """Establish a connection to the PostgreSQL database."""
        try:
            self.connection = psycopg2.connect(**self.db_config)
        except Exception as error:
            print(f"Error connecting to the database: {error}")
            self.connection = None
    
    def disconnect(self):
        """Close the database connection."""
        if self.connection:
            self.connection.close()
            print("PostgreSQL connection closed")
    
    def fetch_answer_statistics(self):
        """Fetch all rows from the 'answer_statistics' table."""
        if not self.connection:
            print("No connection established")
            return None
        
        try:
            cursor = self.connection.cursor()
            select_query = "SELECT x, y, incorrect_count, correct_count FROM answer_statistics;"
            cursor.execute(select_query)
            rows = cursor.fetchall()
            cursor.close()
            return rows
        except Exception as error:
            print(f"Error fetching data: {error}")
            return None
