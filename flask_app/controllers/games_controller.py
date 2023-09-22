from flask_app import app
from flask import render_template, redirect, session, flash, request, jsonify
import requests
from flask_app.models.user_model import User
from flask_app.models.game_model import Game


@app.route('/game')
def game():
        home_team = request.args.get('home')
        away_team = request.args.get('away')

        odds_data = fetch_odds_data(home_team, away_team)
        return render_template('game.html', odds_data = odds_data)

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