from application import app
from flask import jsonify, session,request
from werkzeug.security import generate_password_hash,check_password_hash
from application.models import *


@app.route('/api/v1/sampleapi/')
def test_backend():
    return {
        "members":["Amaechi","Sandra","Cynthia","Chinedu 69rc","Iyovwaro Mary"]
    }
    
    
@app.route('/api/v1/registeruser/', methods=["POST"])
def register_user():
    data=request.get_json()
    
    fname=data.get("fname",None)
    lname=data.get("lname",None)
    n_name= data.get("nickname",None)
    email=data.get("regemail",None)
    passwd=data.get("pswd",None)
    
    if fname != None and lname!= None and n_name!= None and email!= None and passwd!= None:
        
        email_availability=db.session.query(User).filter(User.user_email==email).first()
        
        if email_availability is None:
            hashed_password=generate_password_hash(passwd)
            newUser=User(user_firstname=fname, user_lastname=lname, user_nickname=n_name, user_email=email, user_pswd=hashed_password)
            db.session.add(newUser)
            db.session.commit()
            
            return jsonify({
                "message":"Registration Successful"
            })
        else:
            return jsonify({
                "message":"This email has already been registered. Try again"
            })
    else:
        return jsonify({
            "message":"Registration Failed. Incomplete Form Data"
        })
    
    
@app.route('/api/v1/check_email_availability/')
def check_email_availability():
    email_entered=request.args.get("email",None)
    
    if email_entered:
        checking_email=db.session.query(User).filter(User.user_email==email_entered).first()
        
        if checking_email is None:
            return {"status":"Email Is Available"}
        else:
            return {"status":"Email Already Registered"}
    else:
        return {"status":"No email Provided"}
    
    
# @app.route('/api/v1/login-user/', methods=["POST"])
# def login_user():
#     data=request.get_json()
    
#     user_email=data.get('emailInput')
#     user_password=data.get('passwordInput')
    
#     verify_user=db.session.query(User).filter(User.user_email==user_email).first()
#     protected_password=verify_user.user_pswd
    
#     if verify_user and check_password_hash(protected_password, user_password):
#         return {
#             "status":"Login Successful",
#             "username":f"{verify_user.user_nickname}"
#         }
#     else:
#         return {"status":"Invalid Credentials"} 
    
@app.route('/api/v1/login-user/')
def login_user():
    
    user_email=request.args.get('email')
    user_password=request.args.get('password')
    
    verify_user=db.session.query(User).filter(User.user_email==user_email).first()
    protected_password=verify_user.user_pswd
    
    if verify_user and check_password_hash(protected_password, user_password):
        return {
            "status":"Login Successful",
            "username":f"{verify_user.user_nickname}"
        }
    else:
        return {"status":"Invalid Credentials"} 