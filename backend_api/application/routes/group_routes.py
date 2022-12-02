from datetime import datetime,date
from flask import jsonify,request
from application import app
from application.models import *
# from . import friends_routes


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
    
    return{'status':True, "message":"Members Added"}

# def test():
#     x=friends_routes.friends_i_accepted(1)
#     print(x)
    
# test()