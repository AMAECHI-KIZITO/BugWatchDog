import re
from flask import jsonify,request, render_template, url_for, redirect
from flask_mail import Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadTimeSignature
from werkzeug.security import generate_password_hash,check_password_hash
from application import app, mail
from application.models import *

s=URLSafeTimedSerializer('super_secret_key')

def validate_email(email):
    regex = '^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$'
    if (re.search(regex, email)):
        return True
    else:
        return False
        
        
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
            valid_email = validate_email(email)
            if valid_email is True:
                hashed_password=generate_password_hash(passwd)
                newUser=User(user_firstname=fname, user_lastname=lname, user_nickname=n_name, user_email=email, user_pswd=hashed_password, user_stack=stack, confirm_email="False")
                db.session.add(newUser)
                db.session.commit()
                
                token = s.dumps(email, salt='email-confirm')
                
                
                msg = Message("Confirm Email", sender=('BugWatch Registration', 'support@bugwatch.com.ng'), recipients=[email])
                
                email_link = url_for('confirm_email', token=token, _external=True)
                
                msg.html = render_template('confirm_email.html', activation_link=email_link, recipient=email, username=fname)
                mail.send(msg)
                
                return jsonify({"message":"Registration Successful"})
            else:
                return jsonify({"message":"Invalid Email Format"})
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
        email=s.loads(token, salt='email-confirm', max_age=5400)
        checking_email=db.session.query(User).filter(User.user_email==email).first()
        if checking_email:
            checking_email.confirm_email='True'
            db.session.commit()
            return render_template("account_verified.html", status="verified")
    except SignatureExpired:
        return render_template("account_verified.html", status="expired")
    except BadTimeSignature:
        return render_template("account_verified.html", status="altered")
    

#Login User
@app.route('/api/v1/login-user/', methods=["POST"])
def login_user():
    data=request.get_json()
    
    user_email=data.get("emailInput")
    user_password=data.get("passwordInput")
    
    verify_user=db.session.query(User).filter(User.user_email==user_email).first()
    
    if verify_user and check_password_hash(verify_user.user_pswd, user_password):
        if verify_user.confirm_email != "False":
            return jsonify({
                "status":True,
                "dev_username":f"{verify_user.user_nickname}",
                "sessionId":f"{verify_user.user_id}"
            })
        else:
            return jsonify({"status":False,"message":"Access Denied! Please check your email for a verification link"})
    else:
        return jsonify({"status":False,"message":"Invalid Credentials"})




# Resend Verification Link
@app.route('/api/v1/resend-verification-link/<email>', methods=['POST'])
def reverify_email(email):
    # data=request.get_json()
    # account_email=data.get("gmail")
    
    
    # token = s.dumps(account_email, salt='email-confirm')

    # msg = Message("Confirm Email", sender=('Bug Watch', 'support@bugwatch.com.ng'), recipients=[account_email])
    # email_link = url_for('confirm_email', token=token, _external=True)
            
    # msg.html = render_template('confirm_email.html', activation_link=email_link, recipient=account_email, username=user_info.user_firstname)
    # mail.send(msg)
    
    token = s.dumps(email, salt='email-confirm')
    email_availability=db.session.query(User).filter(User.user_email==email).first()
    msg = Message("Confirm Email", sender=('Bug Watch', 'support@bugwatch.com.ng'), recipients=[email])
    email_link = url_for('confirm_email', token=token, _external=True)
            
    msg.html = render_template('confirm_email.html', activation_link=email_link, recipient=email, username=email_availability.user_firstname)
    mail.send(msg)
            
            
            
    return jsonify({
        "message":"Verification Link Sent"
    })