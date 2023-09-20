from flask_app.config.mysqlconnection import connectToMySQL
from flask import flash
import re

class Book:
    def __init__(self, data):
        self.id = data['id']
        self.money_home = data['money_home']
        self.money_away = data['money_away']
        self.spread = data['spread']
        self.over_under = data['over_under']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']
