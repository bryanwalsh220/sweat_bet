from flask_app import app
from flask import render_template, redirect, session, flash, request
from flask_app.models.user_model import User
from flask_bcrypt import Bcrypt
bcrypt = Bcrypt(app)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/dashboard')
def test():
    return render_template('dashboard.html')

@app.route('/signup')
def signup():
    return render_template('login.html')

# Login and Registration

@app.route('/register', methods=['POST'])
def register():
    if not User.validate(request.form):
        return redirect('/signup')
    
    pw_hash = bcrypt.generate_password_hash(request.form['password'])
    print(pw_hash)

    data = {
        'first_name': request.form['first_name'],
        'last_name': request.form['last_name'],
        'email': request.form['email'],
        'password': pw_hash
    }

    user_id = User.save_user(data)

    session['user_id'] = user_id
    session['name'] = request.form['first_name']


    return redirect('/dashboard')



@app.route('/login', methods=['POST'])
def login():
    print(request.form)
    data = {'email' : request.form['email']}
    user_in_db = User.get_by_email(data)
    
    if not user_in_db:
        flash("Invalid Login, please try again", "login_err")
        return redirect('/signup')
    if not bcrypt.check_password_hash(user_in_db.password, request.form['password']):
        flash("Invalid Login, please try again", "login_err")
        return redirect('/signup')

    

    session['user_id'] = user_in_db.id
    session['name'] = user_in_db.first_name

    return redirect('/dashboard')

# signout

@app.route('/signout')
def sign_out():
    session.clear()
    return redirect('/')
