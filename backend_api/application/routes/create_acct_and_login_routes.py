from flask import jsonify,request, render_template, url_for, redirect
from flask_mail import Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadTimeSignature
from werkzeug.security import generate_password_hash,check_password_hash
from application import app, mail
from application.models import *

s=URLSafeTimedSerializer('sscewykdfsFbsxnfhqhv')

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
            newUser=User(user_firstname=fname, user_lastname=lname, user_nickname=n_name, user_email=email, user_pswd=hashed_password, user_stack=stack, confirm_email="False")
            db.session.add(newUser)
            db.session.commit()
            
            token = s.dumps(email, salt='email-confirm')
            
            
            msg = Message("Confirm Email", sender=('Debugger', 'konkakira1960@gmail.com'), recipients=[email])
            email_link = url_for('confirm_email', token=token, _external=True)
            
            msg.body = f"Dear Developer,\n\nWelcome to Debugger. I'm thrilled you've decided to join us and can't wait for you toget started.\n\nThe application is designed to make debugging and troubleshooting easier for everyone. I encourage you to explore the application as I'm confident it will make your development process more efficient. But first, a confirmation of your email is required.\n\nTo confirm your email address click here {email_link}\n\nIf you do not recognize this email please ignore.\n\nKeep Debugging,\nThe Debugger Team."
            #msg.html = render_template('confirm_email.html', token=token)
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
        email=s.loads(token, salt='email-confirm', max_age=120)
        checking_email=db.session.query(User).filter(User.user_email==email).first()
        if checking_email:
            checking_email.confirm_email='True'
            db.session.commit()
            return redirect(f'https://my-app-name.com/account-verified')
    except SignatureExpired:
        return redirect(f'https://my-app-name.com/token-expired/{email}')
    except BadTimeSignature:
        return redirect('https://my-app-name.com/invalid-token')
    
    

    
# Login User
@app.route('/api/v1/login-user/')
def login_user():
    
    user_email=request.args.get('email')
    user_password=request.args.get('password')
    
    verify_user=db.session.query(User).filter(User.user_email==user_email).first()
    protected_password=verify_user.user_pswd
    if verify_user:
        if verify_user and check_password_hash(protected_password, user_password):
            if verify_user.confirm_email != "False":
                return {
                    "status":True,
                    "dev_username":f"{verify_user.user_nickname}",
                    "sessionId":f"{verify_user.user_id}"
                }
            else:
                return {"status":False,"message":"Access Denied! Account verification required"}
        else:
            return {"status":False,"message":"Invalid Credentials"} 
    else:
        return {"status":False, "message":"User Not Found"}


# Resend Verification Link
@app.route('/api/v1/resend-verification-link/', methods=['POST'])
def reverify_email():
    data=request.get_json()
    account_email=data.get("gmail")
    
    
    token = s.dumps(account_email, salt='email-confirm')

    msg = Message("Confirm Email", sender=('Debugger', 'konkakira1960@gmail.com'), recipients=[account_email])
    email_link = url_for('confirm_email', token=token, _external=True)
            
    msg.body = f"WELCOME TO DEBUGGER\n\nTo confirm your email address click here {email_link}\n\nIf you do not recognize this email please ignore.\n\nKeep Debugging,\nThe Debugger Team."
    #msg.html = render_template('confirm_email.html', token=token)
    mail.send(msg)
            
            
    return jsonify({
        "message":"Verification Link Sent"
    })