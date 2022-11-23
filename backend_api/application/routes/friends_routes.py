from flask import jsonify, session,request
from application import app
from application.models import *

@app.route('/api/v1/get-unfriended-developers/')
def get_unfriended_devs():
    current_dev=3
    all_requests_users_id=[current_dev]
    
    # Getting the accepted requests sent out by logged in dev
    checking_req_sent_by_current_user=Friend_Request.query.filter(Friend_Request.request_sent_by==current_dev, Friend_Request.request_status=='A').all()
    if checking_req_sent_by_current_user != []:
        for sent_out in checking_req_sent_by_current_user:
            all_requests_users_id.append(sent_out.request_sent_to)
            
    # Getting the accepted requests sent in i accepted
    checking_req_received_by_current_user=Friend_Request.query.filter(Friend_Request.request_sent_to==current_dev, Friend_Request.request_status=='A').all()
    if checking_req_received_by_current_user != []:
        for sent_in in checking_req_received_by_current_user:
            all_requests_users_id.append(sent_in.request_sent_by)
            
    
    developers_list=[]
    counter=0
    developers=db.session.query(User).all()
    
    if developers != []:
        for dev in developers:
            if dev.user_id in all_requests_users_id:
                pass
            else:
                counter+=1
                stack_id=dev.user_stack
                stack=db.session.query(Techstack).filter(Techstack.stack_id==stack_id).first()
                stack_name=stack.stack_name
                
                dev_info={}
                dev_info["serial_no"]=counter
                dev_info["dev_id"]=dev.user_id
                dev_info["dev_nickname"]=dev.user_nickname
                dev_info["dev_stack"]=stack_name
                developers_list.append(dev_info)
        return {"status":True, "developers":developers_list}
    else:
        return {"status":True, "developers":"No Developers registered at this time"}
    
    
#Send Friend Request   
@app.route('/api/v1/send-friend-request/')
def send_friend_request():
    
    receiver_of_request=request.args.get("friendRequestRecipient")
    sender=request.args.get("userSession")
    send_friend_request=Friend_Request(request_sent_by=sender, request_sent_to=receiver_of_request, request_date=date.today())
    db.session.add(send_friend_request)
    db.session.commit()
    return{"status":True, "message":"Friend Request Sent"}

get_unfriended_devs()