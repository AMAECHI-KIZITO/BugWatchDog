from datetime import datetime,date
from flask import jsonify, session,request
from application import app
from application.models import *


@app.route("/api/v1/sendmessage/", methods=["POST"])
def send_message():
    data=request.get_json()
    receiver=data.get("receiver")
    content=data.get("message")
    sender=data.get("userSession")
    
    send_message=Inbox(msg_sender=sender,msg_recipient=receiver, message=content, datesent=datetime.now())
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
            the_latest_msg_id=[]
            
            last_msg_i_received= db.session.query(Inbox).filter(Inbox.msg_sender==x, Inbox.msg_recipient==developer_id).all()
            the_latest_msg_id.append(last_msg_i_received[-1].msg_id)
            
            last_message_i_sent= db.session.query(Inbox).filter(Inbox.msg_sender==developer_id, Inbox.msg_recipient==x).all()
            the_latest_msg_id.append(last_message_i_sent[-1].msg_id)
            
            if the_latest_msg_id[0] > the_latest_msg_id[1]:
                timesent.append(last_msg_i_received[-1].datesent.strftime("%a, %d %b %y %H:%M:%S %p"))
                last_message_sent.append(last_msg_i_received[-1].message)
            else:
                timesent.append(last_message_i_sent[-1].datesent.strftime("%a, %d %b %y %H:%M:%S %p"))
                last_message_sent.append(last_message_i_sent[-1].message)
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
        info['timestamp']=msg_details.datesent.strftime("%a, %d %b %y %H:%M:%S %p")
        all_message_log.append(info)
    return {"status":True, "senderName":sender_name, 'details':all_message_log}