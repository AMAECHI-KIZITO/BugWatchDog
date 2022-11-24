from flask import jsonify, session,request
from application import app
from application.models import *

@app.route('/api/v1/get-unfriended-developers/')
def get_unfriended_devs():
    current_dev=request.args.get('currentDev')
    all_accepted_requests_users_id=[]
    all_pending_requests_users_id=[]
    
    # Getting the accepted requests sent out by logged in dev
    checking_req_sent_by_current_user=Friend_Request.query.filter(Friend_Request.request_sent_by==current_dev, Friend_Request.request_status=='A').all()
    if checking_req_sent_by_current_user != []:
        for sent_out in checking_req_sent_by_current_user:
            all_accepted_requests_users_id.append(sent_out.request_sent_to)
            
    # Getting the accepted requests sent in i accepted
    checking_req_received_by_current_user=Friend_Request.query.filter(Friend_Request.request_sent_to==current_dev, Friend_Request.request_status=='A').all()
    if checking_req_received_by_current_user != []:
        for sent_in in checking_req_received_by_current_user:
            all_accepted_requests_users_id.append(sent_in.request_sent_by)
            
    # Getting the pending requests yet to be accepted by me
    pending_from_me=Friend_Request.query.filter(Friend_Request.request_sent_to==current_dev, Friend_Request.request_status=='P').all()
    if pending_from_me != []:
        for pending in pending_from_me:
            all_pending_requests_users_id.append(pending.request_sent_by)
            
    # Getting the pending requests yet to be accepted by them
    pending_from_them=Friend_Request.query.filter(Friend_Request.request_sent_by==current_dev, Friend_Request.request_status=='P').all()
    if pending_from_them != []:
        for pending in pending_from_them:
            all_pending_requests_users_id.append(pending.request_sent_to)
    
    combined_list= all_pending_requests_users_id + all_accepted_requests_users_id
    
    developers_list=[]
    counter=0
    developers=db.session.query(User).filter(User.user_id != current_dev).all()
    
    if combined_list != []:
        for dev in developers:
            if dev.user_id not in combined_list:
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
        for dev in developers:
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
    



#Send Friend Request   
@app.route('/api/v1/send-friend-request/')
def send_friend_request():
    receiver_of_request=request.args.get("friendRequestRecipient")
    sender=request.args.get("userSession")
    send_friend_request=Friend_Request(request_sent_by=sender, request_sent_to=receiver_of_request, request_date=date.today())
    db.session.add(send_friend_request)
    db.session.commit()
    return{"status":True, "message":"Friend Request Sent"}



# retrieve Friend Requests
@app.route('/api/v1/retrieve-friend-requests/')
def retrieve_friend_requests():
    current_dev=request.args.get('currentDev')
    developers_list=[]
    counter=0
    
    get_all_my_pending_requests=Friend_Request.query.filter(Friend_Request.request_sent_to==current_dev, Friend_Request.request_status=='P').all()
    
    if get_all_my_pending_requests != []:
        for dev in get_all_my_pending_requests:
            dev_info=db.session.query(User).filter(User.user_id == dev.request_sent_by).first()
            counter+=1
            stack_id=dev_info.user_stack
            stack=db.session.query(Techstack).filter(Techstack.stack_id==stack_id).first()
            stack_name=stack.stack_name
            
            developer_info={}
            developer_info["serial_no"]=counter
            developer_info["dev_id"]=dev_info.user_id
            developer_info["dev_nickname"]=dev_info.user_nickname
            developer_info["dev_stack"]=stack_name
            developers_list.append(developer_info)
        return {"status":True, "developers":developers_list}
    else:
        return{"status":False, "developers":"No Pending Requests"}


# Accept Friend Requests
@app.route('/api/v1/accept-friend-request/')
def accept_friend_requests():
    invitee=request.args.get('invitee')
    invited=request.args.get('invited')
    
    invited_deets=User.query.get(invited)
    name_of_friend=invited_deets.user_nickname
    captitalized_name=name_of_friend[0].upper() + name_of_friend[1:]
    
    #accept request process
    accept_request=db.session.query(Friend_Request).filter(Friend_Request.request_sent_by==invited, Friend_Request.request_sent_to==invitee).first()
    accept_request.request_status='A'
    db.session.commit()
    return {"status":True, "message":f"{captitalized_name} is now your friend."}