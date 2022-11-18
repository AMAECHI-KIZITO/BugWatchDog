from flask import jsonify,request
from application import app
from application.models import *


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
    