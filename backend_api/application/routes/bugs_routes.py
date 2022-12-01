import os
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
    code_image=data.get('codeSnippet')
    
    # original_filename=code_image.filename
    # originalfile = "application/bugs_images/"+original_filename
    # code_image.save(originalfile)
    
    new_bug=Bugsheet(bug_project=project_affected, bug_description=bug_description_received, bug_status="Unsolved", bug_image=code_image, date_added=date.today())
    db.session.add(new_bug)
    db.session.commit()
    
    return {"status":"True", "message":"Bug Added"}


#Find bugs assigned to a project
@app.route('/api/v1/get-project-bugs/<id>/')
def get_project_bug(id):
    project_bugs=Bugsheet.query.filter(Bugsheet.bug_project==id).all()
    bug_records=[]
    counter=0
    if project_bugs != []:
        
        for bug in project_bugs:
            counter+=1
            bug_report={}
            bug_report['bug_id']=bug.bug_id
            bug_report['bug_name']=bug.bug_description
            bug_report['bug_status']=bug.bug_status
            bug_report['bug_date'] = bug.date_added
            bug_report['serial_no']=counter
            bug_records.append(bug_report)
        return {"status":True, "bugRecords":bug_records}
    else:
        return {"status":True, "bugRecords":"No bugs found for this project"}