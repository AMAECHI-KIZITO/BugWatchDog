from flask import jsonify, session,request
from werkzeug.security import generate_password_hash,check_password_hash
from application import app
from application.models import *


@app.route('/api/v1/sampleapi/')
def test_backend():
    return {
        "members":["Amaechi","Sandra","Cynthia","Chinedu 69rc","Iyovwaro Mary"]
    }

# get dashboard statistics
@app.route('/api/v1/get_dashboard_numbers/')
def get_dashboard_stats():
    dev_user_id=request.args.get("userId")

    project_ids=[]
    total_bugs=0
    outstanding_bugs=0
    dev_total_projects=db.session.query(Project).filter(Project.project_owner==dev_user_id).count()
    
    
    if dev_total_projects != 0:
        dev_projects=db.session.query(Project).filter(Project.project_owner==dev_user_id).all()
        
        for project in dev_projects:
            project_ids.append(project.project_id)
        
        for x in project_ids:
            project_bugs= db.session.query(Bugsheet).filter(Bugsheet.bug_project==x).count()
            if project_bugs > 0:
                total_bugs=total_bugs + project_bugs
                
                project_outstanding_bugs= db.session.query(Bugsheet).filter(Bugsheet.bug_project==x, Bugsheet.bug_status=="Unsolved").count()
                outstanding_bugs = outstanding_bugs + project_outstanding_bugs
            
        
        average_bugs=total_bugs/dev_total_projects

        return {
            "total_projects":f"{dev_total_projects}",
            "bugs_outstanding": f"{outstanding_bugs}",
            "average_bugs": f"{average_bugs}"
        }
    else:
        return {
            "total_projects":0,
            "bugs_outstanding":0,
            "average_bugs":0
        }




# Fetch all the users projects for choosing the project affected by a bug
@app.route("/api/v1/fetch-user-projects/")
def get_user_projects():
    user_id=request.args.get("userId")
    user_projects=db.session.query(Project).filter(Project.project_owner==user_id).all()
    developer_projects=[]
    
    if user_projects:
        for prj in user_projects:
            project_info={}
            project_info['project_id']=prj.project_id
            project_info['project_name']=prj.project_name
            developer_projects.append(project_info)
            
        return {"status":True, "projects_list":developer_projects}
    else:
        return {"status":False, "projects_list":0}

# Create new bug
@app.route("/api/v1/create-new-bug/", methods=["POST"])
def create_new_bug():
    data=request.get_json()
    project_affected=data.get('affectedProject')
    bug_description_received=data.get('bugDescription')
    
    new_bug=Bugsheet(bug_project=project_affected, bug_description=bug_description_received, bug_status="Unsolved")
    db.session.add(new_bug)
    db.session.commit()
    
    return {"status":"True", "message":"Bug Added"}
    
    
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