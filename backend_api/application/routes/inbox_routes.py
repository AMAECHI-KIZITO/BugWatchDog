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
    messages=db.session.query(Inbox).filter(Inbox.msg_recipient==developer_id).order_by(Inbox.datesent.desc()).all()
    
    allsenders=[]
    names_of_senders=[]
    last_message_sent=[]
    timesent=[]
    
    if messages!= []:
        #getting all distinct senders
        for i in messages:
            if i.msg_sender in allsenders:
                pass
            else:
                allsenders.append(i.msg_sender)
        
        for x in allsenders:
            the_msg_sender=db.session.query(User).filter(User.user_id==x).first()
            name=the_msg_sender.user_nickname
            names_of_senders.append(name)
            
            #getting last message sent
            last_sent_message = db.session.query(Inbox).filter(Inbox.msg_sender==x).order_by(Inbox.datesent.desc()).first()
            timesent.append(last_sent_message.datesent)
            last_message_sent.append(last_sent_message.message)
        return {"status":True, "message":last_message_sent, 'list_of_senders':allsenders, "names":names_of_senders, 'timestamp':timesent}
    else:
        return {"status":False, "message":"You have no mesages at this time"}
    
@app.route("/api/v1/inbox-details/<id>/")
def get_inbox_messages(id):
    loggedInDev=request.args.get("loggedInDev")
    sender_details=db.session.query(User).get(id)
    sender_name=sender_details.user_nickname
    message_records=[]
    all_message_log=[]
    
    sender_to_receiver_records=db.session.query(Inbox).filter(Inbox.msg_sender==id, Inbox.msg_recipient==loggedInDev).all()
    receiver_to_sender_records=db.session.query(Inbox).filter(Inbox.msg_sender==loggedInDev, Inbox.msg_recipient==id).all()
    
    for s in sender_to_receiver_records:
        message_records.append(s.msg_id)
    for r in receiver_to_sender_records:
        message_records.append(r.msg_id)
    sorted_records=sorted(message_records)
    
    for msg in sorted_records:
        msg_details=db.session.query(Inbox).filter(Inbox.msg_id==msg).first()
        
        info={}
        info['msgId']=msg_details.msg_id
        info['senderId']=msg_details.msg_sender
        info['receiverId']=msg_details.msg_recipient
        info['message']=msg_details.message
        info['timestamp']=msg_details.datesent
        all_message_log.append(info)
    return {"status":True, "senderName":sender_name, 'details':all_message_log}