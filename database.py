import pymysql
import bcrypt
from datetime import datetime
from flask_login import UserMixin
from config import Config

class Database:
    def __init__(self):
        self.connection = None
        self.connect()
    
    def connect(self):
        try:
            self.connection = pymysql.connect(
                host=Config.MYSQL_HOST,
                user=Config.MYSQL_USER,
                password=Config.MYSQL_PASSWORD,
                db=Config.MYSQL_DB,
                cursorclass=pymysql.cursors.DictCursor,
                autocommit=True
            )
        except Exception as e:
            print(f"Database connection error: {e}")
    
    def get_connection(self):
        if not self.connection or not self.connection.open:
            self.connect()
        return self.connection
    
    def execute_query(self, query, params=None):
        conn = self.get_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute(query, params)
                if query.strip().upper().startswith('SELECT'):
                    return cursor.fetchall()
                return cursor.rowcount
        except Exception as e:
            print(f"Query error: {e}")
            return None
    
    def get_user_by_email(self, email):
        query = "SELECT * FROM users WHERE email = %s"
        result = self.execute_query(query, (email,))
        return result[0] if result else None
    
    def get_user_by_id(self, user_id):
        query = "SELECT * FROM users WHERE id = %s"
        result = self.execute_query(query, (user_id,))
        return result[0] if result else None
    
    def create_user(self, name, email, password_hash):
    query = """
    INSERT INTO users (name, email, password_hash) 
    VALUES (%s, %s, %s)
    """
    
    self.execute_query(query, (name, email, password_hash))
    
    return 1
    
    def record_download(self, user_id, version='v1.0.0'):
        query = """
        INSERT INTO downloads (user_id, version) 
        VALUES (%s, %s)
        """
        return self.execute_query(query, (user_id, version))
    
    def get_total_users(self):
        query = "SELECT COUNT(*) as count FROM users"
        result = self.execute_query(query)
        return result[0]['count'] if result else 0
    
    def get_total_downloads(self):
        query = "SELECT COUNT(*) as count FROM downloads"
        result = self.execute_query(query)
        return result[0]['count'] if result else 0
    
    def get_user_downloads(self, user_id):
        query = "SELECT COUNT(*) as count FROM downloads WHERE user_id = %s"
        result = self.execute_query(query, (user_id,))
        return result[0]['count'] if result else 0

# Global database instance
db = Database()

class User(UserMixin):
    def __init__(self, user_data):
        self.id = user_data['id']
        self.name = user_data['name']
        self.email = user_data['email']
        self.password_hash = user_data['password_hash']
    
    @staticmethod
    def get(user_id):
        user_data = db.get_user_by_id(user_id)
        return User(user_data) if user_data else None
    
    @staticmethod
    def get_by_email(email):
        user_data = db.get_user_by_email(email)
        return User(user_data) if user_data else None
    
    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
    
    def get_id(self):
        return str(self.id)
