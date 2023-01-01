from flask import jsonify,request, render_template, url_for
from flask_mail import Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadTimeSignature
from werkzeug.security import generate_password_hash,check_password_hash
from application import app, mail
from application.models import *

serializer=URLSafeTimedSerializer('sscewykbsxnfhqhv')

# Check if email availability
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
    
       
# Registration of a new user 
@app.route('/api/v1/registeruser/', methods=["POST"])
def register_user():
    data=request.get_json()
    
    fname=data.get("fname",None)
    lname=data.get("lname",None)
    n_name= data.get("nickname",None)
    email=data.get("regemail",None)
    passwd=data.get("pswd",None)
    stack=data.get("developerStack",None)
    if fname != None and lname!= None and n_name!= None and email!= None and passwd!= None and stack!="#":
        
        email_availability=db.session.query(User).filter(User.user_email==email).first()
        
        if email_availability is None:
            hashed_password=generate_password_hash(passwd)
            newUser=User(user_firstname=fname, user_lastname=lname, user_nickname=n_name, user_email=email, user_pswd=hashed_password, user_stack=stack)
            db.session.add(newUser)
            db.session.commit()
            
            token = serializer.dumps(email, salt='email_confirm')
            confirm_email_link = url_for(confirm_email, token=token, external=True)
            
            msg = Message("Verify your account",sender=('Debugger', 'konkakira1960@gmail.com'), recipients=[f"{email}"])
            msg.html = render_template('confirm_email.html', token=token)
            mail.send(msg)
            
            
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
    

# confirm email
@app.route('/api/v1/confirm-email/<token>')
def confirm_email(token):
    try:
        email=serializer.loads(token, salt='email_confirm', max_age=120)
        return 'it works'
    except SignatureExpired:
        return 'Token expired'
    except BadTimeSignature:
        return 'Invalid token'
    
# Login User
@app.route('/api/v1/login-user/')
def login_user():
    
    user_email=request.args.get('email')
    user_password=request.args.get('password')
    
    verify_user=db.session.query(User).filter(User.user_email==user_email).first()
    protected_password=verify_user.user_pswd
    if verify_user:
        if verify_user and check_password_hash(protected_password, user_password):
            return {
                "status":True,
                "dev_username":f"{verify_user.user_nickname}",
                "sessionId":f"{verify_user.user_id}"
            }
        else:
            return {"status":False,"message":"Invalid Credentials"} 
    else:
        return {"status":False, "message":"User Not Found"} 
