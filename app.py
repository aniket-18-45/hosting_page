from flask import Flask, render_template, request, flash, redirect, url_for, session, send_file
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from database import db, User
from config import Config
import bcrypt
import os
from flask import send_file,send_from_directory


app = Flask(__name__)
app.config.from_object(Config)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)




@app.route('/download-voice-assistant')
@login_required
def download_voice_assistant():

    # record download in database
    db.record_download(current_user.id)

    download_folder = os.path.join(app.root_path, 'static', 'downloads')

    return send_from_directory(
        directory=download_folder,
        path='voice_assistant.exe',
        as_attachment=True
    )

@app.route('/')
def index():
    total_users = db.get_total_users()
    total_downloads = db.get_total_downloads()
    return render_template('index.html', 
                         total_users=total_users, 
                         total_downloads=total_downloads)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']
        
        # Check if user exists
        if db.get_user_by_email(email):
            flash('Email already registered!', 'error')
            return render_template('register.html')
        
        # Hash password
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Create user
        if db.create_user(name, email, password_hash) > 0:
            flash('Registration successful! Please login.', 'success')
            return redirect(url_for('login'))
        else:
            flash('Registration failed. Try again.', 'error')
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        
        user_data = db.get_user_by_email(email)
        if user_data and User(user_data).check_password(password):
            user = User(user_data)
            login_user(user)
            flash('Login successful! Welcome back.', 'success')
            return redirect(url_for('dashboard'))
        
        flash('Invalid email or password!', 'error')
    
    return render_template('login.html')

@app.route('/dashboard')
@login_required
def dashboard():
    total_users = db.get_total_users()
    total_downloads = db.get_total_downloads()
    user_downloads = db.get_user_downloads(current_user.id)
    
    return render_template('dashboard.html', 
                         total_users=total_users, 
                         total_downloads=total_downloads,
                         user_downloads=user_downloads)

@app.route('/download')
def download():
    return render_template('download.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Logged out successfully!', 'success')
    return redirect(url_for('index'))

@app.route('/features')
def features():
    return render_template('features.html')

@app.route('/documentation')
def documentation():
    return render_template('documentation.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)