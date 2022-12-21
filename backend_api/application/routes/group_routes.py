import random
from datetime import datetime,date
from flask import jsonify,request
from application import app
from application.models import *
from . import friends_routes

def group_information(identity):
    information=[]
    group_deets=Chatgroups.query.filter(Chatgroups.group_identifier==identity).first()
    total_members=Group_Members.query.filter(Group_Members.chat_group_id==group_deets.group_id).count()
    grp_info={}
    grp_info['name']=group_deets.group_name
    grp_info['bio']=group_deets.group_description
    grp_info['date_formed']=group_deets.group_creation_date
    grp_info['id']=group_deets.group_id
    grp_info["participants"]=total_members
    grp_info["founder"]=group_deets.group_founder
    information.append(grp_info)
    
    return information

def get_my_group_membership(id):
    check_group_membembership= Group_Members.query.filter(Group_Members.member==id).all()
    if check_group_membembership != []:
        my_groups=[]
        for group in check_group_membembership:
            if group.chat_group_id not in my_groups:
                my_groups.append(group.chat_group_id)
        return my_groups
    else:
        return "You do not belong to a group"


def get_group_last_message(group_id):
    group_chat_log=Group_Inbox.query.filter(Group_Inbox.group_id==group_id).all()
    if group_chat_log!=[]:
        last_msg_deets=group_chat_log[-1]
        
        message_time=last_msg_deets.datesent
        message_sender=last_msg_deets.grp_msg_sender
        sender_deets=User.query.filter(User.user_id==message_sender).first()
        last_message=last_msg_deets.message
        return {"timesent":message_time, "sender":sender_deets.user_nickname, "last_msg":last_message}
    else:
        group_info=Chatgroups.query.filter(Chatgroups.group_id==group_id).first()
        message_time=group_info.group_creation_date
        message_sender="Debugger Team"
        last_message="You just created this group"
        return {"timesent":message_time, "sender":message_sender, "last_msg":last_message}
    
    

def get_group_members(group_id):
    members=Group_Members.query.filter(Group_Members.chat_group_id == group_id).all()
    if members != []:
        membership=[]
        for member in members:
            membership.append(member.member)
        return membership
    else:
        return "No Members Found"
    
    
      
@app.route("/api/v1/create-group/")
def create_new_group():
    group_name_tag=request.args.get("groupName")
    group_bio=request.args.get('groupBio')
    group_creator=request.args.get("groupFounder")
    group_unique_id=request.args.get('uniqueId')
    
    new_group=Chatgroups(group_name=group_name_tag, group_description=group_bio, group_founder=group_creator, group_identifier=group_unique_id, group_creation_date=date.today())
    db.session.add(new_group)
    db.session.commit()
    
    return {"status":True, "group_id":group_unique_id}


@app.route("/api/v1/get-group-info/")
def get_group_info():
    group_identity=request.args.get("groupId")
    information=[]
    group_deets=Chatgroups.query.filter(Chatgroups.group_identifier==group_identity).first()
    grp_info={}
    grp_info['name']=group_deets.group_name
    grp_info['bio']=group_deets.group_description
    grp_info['date_formed']=group_deets.group_creation_date
    information.append(grp_info)
    
    return {"status":True, "details":information}


#Add members to newly created group
@app.route("/api/v1/add-group-members/", methods=['POST'])
def add_group_members():
    data=request.get_json()
    group_identity=data.get("groupid")
    group_selected_members=data.get('groupMembers')
    developer=data.get("userSession")
    
    group_deets=Chatgroups.query.filter(Chatgroups.group_identifier==group_identity).first()
    group_id=group_deets.group_id
    
    #check if the group founder is already in group
    my_membership=Group_Members.query.filter(Group_Members.chat_group_id==group_id, Group_Members.member==developer).first()
    
    if my_membership == None:
        #Add the group founder
        add_developer=Group_Members(chat_group_id=group_id, member=developer, date_added=date.today())
        db.session.add(add_developer)
        
        #Add the chosen members
        for person in group_selected_members:
            new_member=Group_Members(chat_group_id=group_id, member=person, date_added=date.today())
            db.session.add(new_member)
        db.session.commit()
        
        return {'status':True, "message":"Members Added"}
    else:
        group_selected_members=data.get('newMembers')
        
        #Add the chosen members
        for person in group_selected_members:
            new_member=Group_Members(chat_group_id=group_id, member=person, date_added=date.today())
            db.session.add(new_member)
        db.session.commit()
        
        return {'status':True, "message":"Members Added"}

#get my groups inbox deets
@app.route("/api/v1/group-inbox/")
def get_group_inbox():
    logged_in_developer = request.args.get("devId")
    
    my_membership=get_my_group_membership(logged_in_developer)
    
    if my_membership != 'You do not belong to a group':
        group_information=[]
        for group in my_membership:
            group_info=Chatgroups.query.filter(Chatgroups.group_id==group).first()
            group_message_info=get_group_last_message(group)
            
            detail={}
            detail["groupname"]=group_info.group_name
            detail["group_desc"]=group_info.group_description
            detail["founder"]=group_info.group_founder
            detail["id"]=group_info.group_identifier
            detail["last_message"]=group_message_info["last_msg"]
            detail["last_message_timestamp"]=group_message_info["timesent"].strftime("%d/%m/%Y")
            detail["last_message_sender"]=group_message_info["sender"]
            group_information.append(detail)
            
        return {"status": True, "message":group_information}
    else:
        return {"status": True, "message":"No groups Found"}
    
    
#get my groups chats
@app.route("/api/v1/group-inbox-messages/")
def get_group_chats():
    group_identity=request.args.get('grpID')
    logged_in_dev=request.args.get('dev')
    
    #fetching group information
    group_data=group_information(group_identity)
    
    for group in group_data:
        the_group_id=group['id']
        
    chats=Group_Inbox.query.filter(Group_Inbox.group_id==the_group_id).all()
    if chats != []:
        messages=[]
        for msg in chats:
            user_name=User.query.filter(User.user_id==msg.grp_msg_sender).first()
            nickname=user_name.user_nickname
            chat_info={}
            chat_info['msgId']=msg.grp_msg_id
            chat_info['senderId']=msg.grp_msg_sender
            chat_info['senderName']=nickname
            chat_info['message']=msg.message
            chat_info['timestamp']=msg.datesent.strftime("%a, %d %b %y %H:%M:%S %p")
            messages.append(chat_info)
        return {"status":True, "group_info":group_data, "chat_history":messages}
    else:
        return {"status":True, "group_info":group_data, "chat_history":"No message has been sent to this group"}
    

# Send Group Message
@app.route("/api/v1/send-group-message/", methods=["POST"])
def send_group_message():
    data=request.get_json()
    content=data.get("message")
    sender=data.get("userSession")
    group=data.get('currentGroupId')
    
    send_message=Group_Inbox(group_id=group, grp_msg_sender=sender, message=content, datesent=datetime.now())
    db.session.add(send_message)
    db.session.commit()
    return{"status":True, "message":"Message Sent"}



    
# Get all members of a group
@app.route("/api/v1/get-group-membership")
def get_group_membership():
    group_identity=request.args.get('grpID')
    developer_id=request.args.get('dev')
    group_integer_id=Chatgroups.query.filter(Chatgroups.group_identifier==group_identity).first()
    id=group_integer_id.group_id
    
    members_ids=get_group_members(id)
    if members_ids != "No Members Found":
        member_info=[]
        for mem in members_ids:
            member_details={}
            the_member=User.query.filter(User.user_id==mem).first()
            friend_stats=friends_routes.check_friend_status(developer_id,mem)
            
            member_details['dev_nickname']=the_member.user_nickname
            member_details['dev_id']=the_member.user_id
            member_details['friend_status']=friend_stats
            member_info.append(member_details)
        return{"status":True, "membership":member_info}
    

# Leave group as member
@app.route('/api/v1/leave-group-chat')
def exit_group_chat():
    group_identity = request.args.get('grpID')
    developer_id = request.args.get('dev')
    group_to_leave = Chatgroups.query.filter(Chatgroups.group_identifier==group_identity).first()
    the_group_id = group_to_leave.group_id
    
    leave_group = Group_Members.query.filter(Group_Members.member==developer_id, Group_Members.chat_group_id==the_group_id).first()
    
    
    db.session.delete(leave_group)
    db.session.commit()
    return {"status":True, "message":"you are no longer a member of the group."}
        

# Leave group as admin
@app.route('/api/v1/admin-leave-group-chat/')
def admin_exit_group_chat():
    group_identity = request.args.get('grpID')
    developer_id = request.args.get('dev')
    group_to_leave = Chatgroups.query.filter(Chatgroups.group_identifier==group_identity).first()
    the_group_id = group_to_leave.group_id
    
    leave_group = Group_Members.query.filter(Group_Members.member==developer_id, Group_Members.chat_group_id==the_group_id).first()
    
    
    members=db.session.query(Group_Members).filter(Group_Members.chat_group_id == the_group_id, Group_Members.member != developer_id).all()
        
    
    if members != []:
        membership=[]
        for participant in members:
            membership.append(participant.member)
                
        #delete membership record
        db.session.delete(leave_group)
                
        #create a new admin
        group_to_leave.group_founder = membership[0]
            
        db.session.commit()
        return {"status":True, "message":membership}
    else:
        db.session.delete(leave_group)
        db.session.commit()
        return {"status":True, "message":"You have left the group chat with no members."}
    
    
#fetch unadded group members
@app.route('/api/v1/fetch-unadded-group-members/')
def fetch_unadded_members():
    group_identity = request.args.get('grpID')
    developer_id = request.args.get('dev')
    the_group = Chatgroups.query.filter(Chatgroups.group_identifier==group_identity).first()
    the_group_id = the_group.group_id
    
    current_group_members=get_group_members(the_group_id)
    my_friends=friends_routes.friends_i_accepted(developer_id) + friends_routes.friends_that_accepted_me(developer_id)
    not_added=[]
    
    for pal in my_friends:
        if pal not in current_group_members:
            not_added.append(pal)
    
    friends_records=[]
    counter=0
    #getting friends deets
    if not_added!=[]:
        for friend in not_added:
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
        return {"status":True,"members":friends_records}
    else:
        return {"status":True,"members":"No new members to add."}
