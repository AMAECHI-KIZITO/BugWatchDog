from application import app
from flask import jsonify, session,request
from werkzeug.security import generate_password_hash,check_password_hash
from application.models import *


@app.route('/api/v1/sampleapi/')
def test_backend():
    return {
        "members":["Amaechi","Sandra","Cynthia","Chinedu 69rc","Iyovwaro Mary"]
    }


# Check if email availability
@app.route('/api/v1/check_email_availability/')
def check_email_availability():
    email_entered=request.args.get("email",None)
    
    if email_entered:
        checking_email=db.session.query(User).filter(User.user_email==email_entered).first()
        
        if checking_email is None:
            return {"status":"Email Is Available"}
        else:
            return {"status":"Email Already Registered"}
    else:
        return {"status":"No email Provided"}
    
       
# Registration of a new user 
@app.route('/api/v1/registeruser/', methods=["POST"])
def register_user():
    data=request.get_json()
    
    fname=data.get("fname",None)
    lname=data.get("lname",None)
    n_name= data.get("nickname",None)
    email=data.get("regemail",None)
    passwd=data.get("pswd",None)
    stack=data.get("developerStack",None)
    if fname != None and lname!= None and n_name!= None and email!= None and passwd!= None and stack!="#":
        
        email_availability=db.session.query(User).filter(User.user_email==email).first()
        
        if email_availability is None:
            hashed_password=generate_password_hash(passwd)
            newUser=User(user_firstname=fname, user_lastname=lname, user_nickname=n_name, user_email=email, user_pswd=hashed_password, user_stack=stack)
            db.session.add(newUser)
            db.session.commit()
            
            return jsonify({
                "message":"Registration Successful"
            })
        else:
            return jsonify({
                "message":"This email has already been registered. Try again"
            })
    else:
        return jsonify({
            "message":"Registration Failed. Incomplete Form Data"
        })
    
    
# Login User
@app.route('/api/v1/login-user/')
def login_user():
    
    user_email=request.args.get('email')
    user_password=request.args.get('password')
    
    verify_user=db.session.query(User).filter(User.user_email==user_email).first()
    protected_password=verify_user.user_pswd
    if verify_user:
        if verify_user and check_password_hash(protected_password, user_password):
            return {
                "status":"True",
                "dev_username":f"{verify_user.user_nickname}",
                "sessionId":f"{verify_user.user_id}"
            }
        else:
            return {"status":"Invalid Credentials"} 
    else:
        return {"status":"User Not Found"} 
    
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

# Create a new project
@app.route("/api/v1/createnewproject/", methods=["POST"])
def create_new_project():
    data=request.get_json()
    project_name_received=data.get('projectname')
    project_description_received=data.get('projectsummary')
    userid=data.get('userId')
    
    new_project=Project(project_name=project_name_received, project_description=project_description_received, project_owner=userid)
    db.session.add(new_project)
    db.session.commit()
    
    return {"status":"True", "message":"Project Added"}


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
            project_details["project_name"]=p.project_name
            project_details["project_description"]=p.project_description
            project_details["date_created"]=p.date_added
            
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
        project_details["date_created"]=the_project.date_added
        developer_projects.append(project_details)
        
        return {"status":True, "dev_projects":developer_projects}
    else:
        return {"status":False, "dev_projects":"Project Not Found"}
    
    
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
            dev_info["dev_nickname"]=dev.user_nickname
            dev_info["dev_stack"]=stack_name
            developers_list.append(dev_info)
        return {"status":True, "developers":developers_list}
    else:
        return {"status":True, "developers":"No Developers registered at this time"}
    
    
# Get all developers
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