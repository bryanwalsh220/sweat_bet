from flask_app import app
from flask import render_template, redirect, session, flash, request, jsonify
from flask_app.models.user_model import User
from flask_app.models.game_model import Game
from flask_app.models.odd_model import Book