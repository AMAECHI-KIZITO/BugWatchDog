from datetime import datetime,date
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
        return {"status":True, "message":last_message_sent, 'list_of_senders':allsenders, "names":names_of_senders, 'timestamp':timesent}
    else:
        return {"status":False, "message":"You have no mesages at this time"}






# class Get_chat_history:
#     def __init__(self,devid):
#         self.dev_id=devid
#         self.allSenders=[]
#         self.msg_ids=[]
#         self.names_of_senders=[]
#         self.last_message=[]
#         self.last_msg_timestamp=[]
        
        
#     def get_developer_chats_senders(self):
#         records_of_dev=db.session.query(Inbox).filter((Inbox.msg_sender==self.dev_id)|(Inbox.msg_recipient==self.dev_id)).all()
#         if records_of_dev != []:
#             for i in records_of_dev:
                
#                 if i.msg_sender in self.allSenders or i.msg_sender==self.dev_id:
#                     pass
#                 else:
#                     self.allSenders.append(i.msg_sender)
                    
#                 if i.msg_recipient in self.allSenders or i.msg_recipient==self.dev_id:
#                     pass
#                 else:
#                     self.allSenders.append(i.msg_recipient)
#             self.get_my_messages_ids()
#         else:
#             pass
    
    
#     def get_my_messages_ids(self):
#         for x in self.allSenders:
#             sms=Inbox.query.filter(Inbox.msg_sender==x).all()
#             if sms != []:
#                 for deets in sms:
#                     if deets.msg_sender==self.dev_id or deets.msg_recipient == self.dev_id:
#                         if deets.msg_id not in self.msg_ids:
#                             self.msg_ids.append(deets.msg_id)
#                     else:
#                         pass
#             else: 
#                 sms=Inbox.query.filter(Inbox.msg_recipient==x).all()
#                 for deets in sms:
#                     if deets.msg_sender==self.dev_id or deets.msg_recipient == self.dev_id:
#                         if deets.msg_id not in self.msg_ids:
#                             self.msg_ids.append(deets.msg_id)
#                     else:
#                         pass
                
#         self.get_senders_names()
#         self.get_last_chat()
        
#         #print(sorted(self.msg_ids))
#         print(self.allSenders)
#         print(self.last_message)
#         print(self.names_of_senders)
        
#     def get_senders_names(self):
#         for sender in self.allSenders:
#             sender_info=User.query.filter(User.user_id==sender).first()
#             sender_name=sender_info.user_nickname
            
#             if sender_name not in self.names_of_senders:
#                 self.names_of_senders.append(sender_name)
#             else:
#                 pass
        
            
            
#     def get_last_chat(self):
#         for x in self.allSenders:
#             last_chat=Inbox.query.filter(Inbox.msg_sender==x, Inbox.msg_recipient==self.dev_id).all()
            
#             if last_chat!=[]:
#                 last_msg=last_chat[-1].message
#                 last_msg_time=last_chat[-1].datesent.strftime("%a, %d %b %y %H:%M:%S %p")
                    
#                 self.last_message.append(last_msg)
#                 self.last_msg_timestamp.append(last_msg_time)
#             else:
#                 last_chat=Inbox.query.filter(Inbox.msg_sender==self.dev_id, Inbox.msg_recipient==x).all()
                
#                 last_msg=last_chat[-1].message
#                 last_msg_time=last_chat[-1].datesent.strftime("%a, %d %b %y %H:%M:%S %p")
                    
#                 self.last_message.append(last_msg)
#                 self.last_msg_timestamp.append(last_msg_time)
         
# chat=Get_chat_history(1)
# chat.get_developer_chats_senders()       




# @app.route("/api/v1/inbox/")
# def my_inbox():
#     developer_id=request.args.get("devId")
    
#     chat=Get_chat_history(developer_id)
#     chat.get_developer_chats_senders()
    
    
#     allsenders=chat.allSenders
#     messages_ids=chat.msg_ids
#     names_of_senders=chat.names_of_senders
#     last_message=chat.last_message
#     last_message_timestamp=chat.last_msg_timestamp

#     if allsenders!=[]:
#         return {"status":True, "message":last_message, 'list_of_senders':allsenders, "names":names_of_senders, 'timestamp':last_message_timestamp}
#     else:
#         return {"status":False, "message":"You have no mesages at this time"}
    
    

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

