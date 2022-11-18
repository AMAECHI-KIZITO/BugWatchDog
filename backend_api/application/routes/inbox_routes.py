from datetime import datetime
from flask import jsonify,request
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
    unread_messages_cases=db.session.query(Inbox).filter(Inbox.msg_sender==developer_id).order_by(Inbox.datesent.desc()).all()
    
    all_persons_involved_user_id_list=[]
    the_names_of_persons_involved_in_the_conversations=[]
    last_message_sent=[]
    timesent=[]
    
    if messages != [] or unread_messages_cases != []:
        #getting all distinct senders
        for i in messages:
            if i.msg_sender in all_persons_involved_user_id_list:
                pass
            else:
                all_persons_involved_user_id_list.append(i.msg_sender)
        
        
        #trying to get the unreplied messages cases
        for unreplied in unread_messages_cases:
            if unreplied.msg_recipient in all_persons_involved_user_id_list:
                pass
            else:
                all_persons_involved_user_id_list.append(unreplied.msg_recipient)
        
        for x in all_persons_involved_user_id_list:
            #get the person nickname
            the_msg_sender=db.session.query(User).filter(User.user_id==x).first()
            name=the_msg_sender.user_nickname
            
            the_names_of_persons_involved_in_the_conversations.append(name)
            the_latest_msg_id=[]
            
            last_msg_i_received= db.session.query(Inbox).filter(Inbox.msg_sender==x, Inbox.msg_recipient==developer_id).all()
            if last_msg_i_received!=[]:
                the_latest_msg_id.append(last_msg_i_received[-1].msg_id)
            
            last_message_i_sent= db.session.query(Inbox).filter(Inbox.msg_sender==developer_id, Inbox.msg_recipient==x).all()
            if last_message_i_sent!=[]:
                the_latest_msg_id.append(last_message_i_sent[-1].msg_id)
            
            if len(the_latest_msg_id) > 1:
                if the_latest_msg_id[0] > the_latest_msg_id[1]:
                    timesent.append(last_msg_i_received[-1].datesent.strftime("%a, %d %b %y %H:%M:%S %p"))
                    last_message_sent.append(last_msg_i_received[-1].message)
                else:
                    timesent.append(last_message_i_sent[-1].datesent.strftime("%a, %d %b %y %H:%M:%S %p"))
                    last_message_sent.append(last_message_i_sent[-1].message)
            elif len(the_latest_msg_id) == 1:
                for nos in the_latest_msg_id:
                    deets=db.session.query(Inbox).get(nos)
                    timesent.append(deets.datesent.strftime("%a, %d %b %y %H:%M:%S %p"))
                    last_message_sent.append(deets.message)
          
        return {"status":True, "message":last_message_sent, 'list_of_senders':all_persons_involved_user_id_list, "names":the_names_of_persons_involved_in_the_conversations, 'timestamp':timesent}
    else:
        return {"status":False, "message":"You have no mesages at this time"}


# Viewing each specific inbox messages    
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




# Get Developer Profile
@app.route('/api/v1/get-developer-profile/<id>/')
def developer_profile(id):
    dev_deets=User.query.filter(User.user_id==id).first()
    dev_stack=Techstack.query.filter(Techstack.stack_id==dev_deets.user_stack).first()
    dev_stack_name=dev_stack.stack_name
    
    profile={"dev_name":dev_deets.user_nickname, "dev_email":dev_deets.user_email, "dev_stack":dev_stack_name, "date_reg":dev_deets.date_reg.strftime("%d %b %Y")}
    return {"status":True, "information":profile}
    