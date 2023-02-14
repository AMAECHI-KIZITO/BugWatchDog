from flask import jsonify, session,request
from werkzeug.security import generate_password_hash,check_password_hash
from application import app
from application.models import *



# get dashboard statistics
@app.route('/api/v1/get_dashboard_numbers/')
def get_dashboard_stats():
    dev_user_id=request.args.get("userId")

    project_ids=[]
    total_bugs=0
    outstanding_bugs=0
    dev_total_projects=db.session.query(Project).filter(Project.project_owner==dev_user_id).count()
    
    #getting the total number of friends
    friends_i_accepted=Friend_Request.query.filter(Friend_Request.request_sent_to==dev_user_id, Friend_Request.request_status=="A").count()
    
    friends_who_accepted_my_request=Friend_Request.query.filter(Friend_Request.request_sent_by==dev_user_id, Friend_Request.request_status=="A").count()
    
    total_friends = friends_i_accepted + friends_who_accepted_my_request
    
    if dev_total_projects > 0:
        dev_projects=db.session.query(Project).filter(Project.project_owner==dev_user_id).all()
        
        for project in dev_projects:
            project_ids.append(project.project_id)
        
        for x in project_ids:
            project_bugs= db.session.query(Bugsheet).filter(Bugsheet.bug_project==x).count()
            if project_bugs > 0:
                total_bugs=total_bugs + project_bugs
                
                project_outstanding_bugs= db.session.query(Bugsheet).filter(Bugsheet.bug_project==x, Bugsheet.bug_status=="Unsolved").count()
                outstanding_bugs = outstanding_bugs + project_outstanding_bugs
            
        try:
            average_bugs = dev_total_projects/total_bugs
        except ZeroDivisionError:
            average_bugs = 0

        return {
            "total_projects":f"{dev_total_projects}",
            "bugs_outstanding": f"{outstanding_bugs}",
            "average_bugs": f"{average_bugs}",
            "friends":f"{total_friends}"
        }
    else:
        return {
            "total_projects":0,
            "bugs_outstanding":0,
            "average_bugs":0,
            "friends":f"{total_friends}"
        }

    
# Get all developers
@app.route("/api/v1/developers/")
def retieve_all_developers():
    logged_in_dev=request.args.get("currentDev")
    
    developers_list=[]
    counter=0
    developers=db.session.query(User).filter(User.user_id != logged_in_dev).all()
    if developers != []:
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
    else:
        return {"status":True, "developers":"No Developers registered at this time"}
    
    
# Get all tech stacks
@app.route("/api/v1/tech-stacks/")
def retrieve_tech_stacks():
    tech_stacks=db.session.query(Techstack).all()
    tech=[]
    for stack in tech_stacks:
        data_to_send={}
        data_to_send["id"]=stack.stack_id
        data_to_send["name"]=stack.stack_name
        tech.append(data_to_send)
    return {"status":True, "stacks":tech}

