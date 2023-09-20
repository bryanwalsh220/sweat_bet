from flask_app.config.mysqlconnection import connectToMySQL
from flask import flash
import re

EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')


class User: 
    def __init__(self, data):
        self.id = data['id']
        self.first_name = data['first_name']
        self.last_name = data['last_name']
        self.password = data['password']
        self.email = data['email']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']

    @classmethod
    def save_user(cls, data):

        query = """
            INSERT INTO users (first_name, last_name, password, email)
            VALUES
            (%(first_name)s, %(last_name)s, %(password)s, %(email)s)
            """
        
        return connectToMySQL('sweat_bet_db').query_db(query, data)
    
    @classmethod
    def get_by_email(cls, data):
        
        query = """
            SELECT * FROM users
            WHERE email = %(email)s
            """
        
        results = connectToMySQL('sweat_bet_db').query_db(query, data)

        if len(results) < 1:
            return False
        return cls(results[0])
    
    @staticmethod
    def validate(form):
        is_valid = True
        if len(form["first_name"]) < 2:
            flash("Name is too short", 'name_err')
            is_valid = False
        
        if len(form["last_name"]) < 2:
            flash("Name is too short", "last_name_err")
            is_valid = False

        if not EMAIL_REGEX.match(form['email']):
            flash("invalid email address!", 'email_err')
            is_valid = False

        if len(form['password']) < 8:
                flash("Password is not strong enough" , 'pass_err')
                is_valid = False

        if form['confirm_password'] != form['password']:
                flash("Passwords do not match" , 'match_err')
                is_valid = False
            
        return is_valid
    