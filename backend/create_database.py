import psycopg2

# Database connection parameters
db_config = {
    'host': 'hpgrind-1.cx6mg8m6ifyp.eu-north-1.rds.amazonaws.com',
    'port': '5432',               # Default PostgreSQL port
    'dbname': 'postgres',
    'user': 'postgresql',
    'password': '7QVaPw2k}qU*UG'
}

# Initialize connection as None
connection = None

try:
    connection = psycopg2.connect(**db_config)
    cursor = connection.cursor()

    # Create the users table if it doesn't exist
    create_table_query = """
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        password VARCHAR(50) NOT NULL
    );
    """
    
    cursor.execute(create_table_query)
    connection.commit()
    print("Table created successfully")

    # Insert data after table creation
    insert_query = """
    INSERT INTO users (username, password)
    VALUES (%s, %s);
    """
    data_to_insert = [
        ('user1', 'password1'),
        ('user2', 'password2')
    ]
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