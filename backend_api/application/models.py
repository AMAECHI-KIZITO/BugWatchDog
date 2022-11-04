from datetime import datetime,date
from application import db


class User(db.Model):
    user_id=db.Column(db.Integer(), primary_key=True, autoincrement=True)
    user_firstname=db.Column(db.String(50), nullable=False)
    user_lastname=db.Column(db.String(50), nullable=False)
    user_nickname=db.Column(db.String(50), nullable=False)
    user_email=db.Column(db.String(80), nullable=False, unique=True)
    user_pswd=db.Column(db.String(200),nullable=False)
    date_reg=db.Column(db.Date(), nullable=False, default=date.today())
    
    
class Project(db.Model):
    project_id=db.Column(db.Integer(), primary_key=True, autoincrement=True)
    project_owner=db.Column(db.Integer(), db.ForeignKey("user.user_id"))
    project_name=db.Column(db.String(200),nullable=False)
    project_description=db.Column(db.Text(), nullable=False)
    date_added=db.Column(db.Date(), nullable=False, default=date.today())
    
    
class Bugsheet(db.Model):
    bug_id=db.Column(db.Integer(), primary_key=True, autoincrement=True)
    bug_project=db.Column(db.Integer(), db.ForeignKey("project.project_id"))
    bug_description=db.Column(db.Text(), nullable=False)
    bug_status=db.Column(db.Enum('Unsolved','Fixed'), nullable=False)
    date_added=db.Column(db.Date(), nullable=False, default=date.today())