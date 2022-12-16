from flask import jsonify, session,request
from application import app
from application.models import *


def check_friend_status(user_id,friend_id):
    
    friend_status_1=Friend_Request.query.filter(Friend_Request.request_sent_by==user_id, Friend_Request.request_sent_to==friend_id, Friend_Request.request_status=='A').first()
    
    friend_status_2=Friend_Request.query.filter(Friend_Request.request_sent_by==friend_id, Friend_Request.request_sent_to==user_id, Friend_Request.request_status=='A').first()
    
    if friend_status_1 or friend_status_2:
        return "Friend"
    else:
        check_pending_request_1=Friend_Request.query.filter(Friend_Request.request_sent_by==user_id, Friend_Request.request_sent_to==friend_id, Friend_Request.request_status=='P').first()
            
        check_pending_request_2=Friend_Request.query.filter(Friend_Request.request_sent_by==friend_id, Friend_Request.request_sent_to==user_id, Friend_Request.request_status=='P').first()
            
        if check_pending_request_1:
            return "Friend Request Sent"
        elif check_pending_request_2:
            return "Friend Request Pending"
        else:
            return "Friend Request Not Found. Not Yet Friends."


# Getting unfriended developers to enable sending of requests to
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
        num_of_pending_requests=Friend_Request.query.filter(Friend_Request.request_sent_to==current_dev, Friend_Request.request_status=='P').count()
        
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
        return {"status":True, "developers":developers_list, 'no_of_requests':num_of_pending_requests}
    else:
        return{"status":False, "developers":"No Pending Requests", 'no_of_requests':0}



# Accept Friend Requests
@app.route('/api/v1/accept-friend-request/')
def accept_friend_request():
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


# Reject Friend Requests
@app.route('/api/v1/reject-friend-request/')
def reject_friend_request():
    invitee=request.args.get('invitee')
    invited=request.args.get('invited')
    
    invited_deets=User.query.get(invited)
    name_of_friend=invited_deets.user_nickname
    captitalized_name=name_of_friend[0].upper() + name_of_friend[1:]
    
    #accept request process
    accept_request=db.session.query(Friend_Request).filter(Friend_Request.request_sent_by==invited, Friend_Request.request_sent_to==invitee).first()
    accept_request.request_status='R'
    db.session.commit()
    return {"status":True, "message":f"You have declined the request from {captitalized_name}"}



def friends_i_accepted(id):
    f_i_a=[]
    
    friend_req_i_accepted= db.session.query(Friend_Request).filter(Friend_Request.request_sent_to==id, Friend_Request.request_status=='A').all()
    if friend_req_i_accepted != []:
        for accepted in friend_req_i_accepted:
            f_i_a.append(accepted.request_sent_by)
    
    return f_i_a
    

def friends_that_accepted_me(id):
    f_t_a_m=[]
    friends_that_accepted_me= db.session.query(Friend_Request).filter(Friend_Request.request_sent_by==id, Friend_Request.request_status=='A').all()
    
    if friends_that_accepted_me != []:
        for accepted in friends_that_accepted_me:
            f_t_a_m.append(accepted.request_sent_to)
    
    return f_t_a_m




#getting my friends
@app.route('/api/v1/get-friends/')
def get_my_dev_friends():
    logged_in_dev=request.args.get("currentDev")
    
    friends_records=[]
    counter=0
    
    accepted_by_me=friends_i_accepted(logged_in_dev)
    accepted_by_others=friends_that_accepted_me(logged_in_dev)
    all_friends= sorted(accepted_by_me + accepted_by_others)
    
    #getting friends deets
    if all_friends!=[]:
        for friend in all_friends:
            friend_history=User.query.get(friend)
            counter+=1
            stack_id=friend_history.user_stack
            stack=db.session.query(Techstack).filter(Techstack.stack_id==stack_id).first()
            stack_name=stack.stack_name
                
            dev_info={}
            dev_info["serial_no"]=counter
            dev_info["dev_id"]=friend_history.user_id
            dev_info["dev_nickname"]=friend_history.user_nickname
            dev_info["dev_stack"]=stack_name
            friends_records.append(dev_info)
        return {"status":True, "developers":friends_records}
    else:
        return {"status":True, "developers":"You don't have any friends."}
