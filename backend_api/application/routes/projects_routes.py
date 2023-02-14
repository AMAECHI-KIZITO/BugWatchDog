from flask import jsonify, session,request
from werkzeug.security import generate_password_hash,check_password_hash
from application import app
from application.models import *


# Create a new project
@app.route("/api/v1/createnewproject/", methods=["POST"])
def create_new_project():
    data=request.get_json()
    project_name_received=data.get('projectname')
    project_description_received=data.get('projectsummary')
    userid=data.get('userId')
    
    new_project=Project(project_name=project_name_received, project_description=project_description_received, project_owner=userid, date_added=datetime.now())
    db.session.add(new_project)
    db.session.commit()
    
    return {"status":"True", "message":"Project Added"}



# Fetch all the users projects
@app.route("/api/v1/view-projects/<id>")
def view_my_projects(id):
    developer_projects=[]
    counter=0
    projects=db.session.query(Project).filter(Project.project_owner==id).all()
    if projects !=[]:
        for p in projects:
            counter+=1
            project_details={}
            project_details["serial_no"]=counter
            project_details["project_id"]=p.project_id
            project_details["project_name"]=p.project_name
            project_details["project_description"]=p.project_description
            
            developer_projects.append(project_details)
        return {"status":True, "dev_projects":developer_projects}
    else:
        return {"status":False, "dev_projects":"No Projects Created"}
    
    

# Find a particular project
@app.route("/api/v1/find/project/")
def find_specific_project():
    project_id=request.args.get("projectId")
    
    developer_projects=[]
    
    the_project=db.session.query(Project).filter(Project.project_id==project_id).first()
    
    
    if the_project:
        project_details={}
        project_details["project_id"]=the_project.project_id
        project_details["project_name"]=the_project.project_name
        project_details["project_description"]=the_project.project_description
        project_details["date_created"]=the_project.date_added.strftime("%a, %d %b %y")
        developer_projects.append(project_details)
        
        return {"status":True, "dev_projects":developer_projects}
    else:
        return {"status":False, "dev_projects":"Project Not Found"}