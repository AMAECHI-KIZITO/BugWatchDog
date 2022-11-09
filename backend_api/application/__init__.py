from flask import Flask,jsonify, session,request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from application import config
from flask_cors import CORS,cross_origin

app=Flask(__name__, instance_relative_config=True)
api_v1_cors_config={
    "allow_origins":["http://localhost:5000", "http://localhost:3000"],
    "allow_methods":["OPTIONS","GET", "POST"],
    "Access-Control-Allow-Origin": ["Authorization", "Content-Type"]
}
CORS(app, supports_credentials=True, resources={
    r"/api/v1/*":api_v1_cors_config
})

app.config.from_pyfile("config.py")
app.config.from_object(config.ApplicationSettings)
db=SQLAlchemy(app)

migrate=Migrate(app,db)
from application.routes import user_routes
from application import models

