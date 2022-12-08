from datetime import datetime,date
from flask import jsonify,request
from application import app
from application.models import *
from . import friends_routes


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
    
    #Add the group founder
    add_developer=Group_Members(chat_group_id=group_id, member=developer, date_added=date.today())
    db.session.add(add_developer)
    
    #Add the chosen members
    for person in group_selected_members:
        new_member=Group_Members(chat_group_id=group_id, member=person, date_added=date.today())
        db.session.add(new_member)
    db.session.commit()
    
    return {'status':True, "message":"Members Added"}

# def test():
#     x=friends_routes.friends_i_accepted(1)
#     print(x)
    
# test()


def get_group_membership(id):
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

#get my groups inbox deets
@app.route("/api/v1/group-inbox/")
def get_group_inbox():
    logged_in_developer = request.args.get("devId")
    
    my_membership=get_group_membership(logged_in_developer)
    
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