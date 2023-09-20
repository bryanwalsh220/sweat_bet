from flask_app.config.mysqlconnection import connectToMySQL
from flask import flash
import re

class Game:
    def __init__(self, data):
        self.id = data['id']
        self.home_team = data['home_team']
        self.away_team = data['away_team']
        self.home_money = data['home_money']
        self.away_money = data['away_money']
        self.spread = data['spread']
        self.over_under = data['over_under']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']