from flask_app.config.mysqlconnection import connectToMySQL
from flask import flash
import re
import requests

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


def fetch_odds_data(home_team, away_team):
    api_url = f'https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/?apiKey=b4418957800fb40d56e91f6373cb876c&regions=us&markets=h2h&oddsFormat=american'

    try:
        response = requests.get(api_url)
        data = response.json()


        odds_data = extract_odds_data(data, home_team, away_team)  
        return odds_data
    except Exception as e:
        print(f"Error fetching odds data: {str(e)}")
        return {}
    


def extract_odds_data(data, home_team, away_team):
    odds_data = {}
    
    if 'data' in data:
        for team in data['data']:
            if team['home_team'] == home_team and team['away_team'] == away_team:
                
                for bookmaker in team['bookmakers']:
                    for market in bookmaker['markets']:
                        if market['key'] == 'h2h':
                            for outcome in market['outcomes']:
                                odds_data[bookmaker['title']] = outcome['price']
    
    return odds_data
