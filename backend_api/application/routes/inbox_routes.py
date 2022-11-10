from flask import jsonify, session,request
from werkzeug.security import generate_password_hash,check_password_hash
from application import app
from application.models import *


@app.route("/api/v1/sendmessage/", methods=["POST"])
def send_message():
    data=request.get_json()
    receiver=data.get("receiver")
    content=data.get("message")
    sender=data.get("userSession")
    
    send_message=Inbox(msg_sender=sender,msg_recipient=receiver, message=content)
    db.session.add(send_message)
    db.session.commit()
    return{"status":True, "message":"Message Sent"}
    


@app.route("/api/v1/inbox/")
def inbox():
    developer_id=request.args.get("devId")
    messages=db.session.query(Inbox).filter(Inbox.msg_recipient==developer_id).all()
    
    
    inbox_info=[]
    
    if messages!= []:
        for msg in messages:
            message_sender=db.session.query(User).filter(User.user_id==msg.msg_sender).first()
            sender_name=message_sender.user_nickname
            
            msg_details={}
            msg_details["sender"]=sender_name
            msg_details["message_body"]=msg.message
            inbox_info.append(msg_details)
        return {"status":True, "message":inbox_info}
    else:
        return {"status":True, "message":"You have no mesages at this time"}