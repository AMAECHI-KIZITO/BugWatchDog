from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_mail import Mail
from application import config
from flask_cors import CORS,cross_origin

app=Flask(__name__, instance_relative_config=True)
api_v1_cors_config={
    "allow_origins":["http://localhost:5000", "http://localhost:3000", "https://bugwatch.com.ng"],
    "allow_methods":["OPTIONS","GET", "POST"],
    "Access-Control-Allow-Origin": ["Authorization", "Content-Type"]
}
CORS(app, supports_credentials=True, resources={
    r"/api/v1/*":api_v1_cors_config
})

app.config.from_pyfile("config.py")
app.config.from_object(config.ApplicationSettings)

# mail=Mail(app)
# app.config['TESTING'] = False
# app.config['MAIL_SERVER'] = 'smtp.gmail.com'
# app.config['MAIL_PORT'] = 465
# app.config['MAIL_USERNAME'] = 'konkakira1960@gmail.com'
# app.config['MAIL_PASSWORD'] = 'ooriyylqzqyrwyor'
# app.config['MAIL_USE_SSL'] = True
# app.config['MAIL_SUPPRESS_SEND '] = False
# mail=Mail(app)

mail=Mail(app)
app.config['MAIL_SERVER'] = 'mail.bugwatch.com.ng'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'support@bugwatch.com.ng'
app.config['MAIL_PASSWORD'] = 'Secret Password Here'
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USE_TLS'] = True
app.config['TESTING'] = False
app.config['MAIL_SUPPRESS_SEND '] = False
app.config['MAIL_DEBUG '] = True
mail=Mail(app)
db=SQLAlchemy(app)

migrate=Migrate(app,db)
from application.routes import user_routes, create_acct_and_login_routes, inbox_routes, projects_routes, bugs_routes,friends_routes,group_routes, cleanup
from application import models

