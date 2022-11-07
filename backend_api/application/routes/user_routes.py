from application import app
from flask import jsonify, session,request
from werkzeug.security import generate_password_hash,check_password_hash
from application.models import *


@app.route('/api/v1/sampleapi/')
def test_backend():
    return {
        "members":["Amaechi","Sandra","Cynthia","Chinedu 69rc","Iyovwaro Mary"]
    }
    
    
@app.route('/api/v1/registeruser/', methods=["POST"])
def register_user():
    data=request.get_json()
    
    fname=data.get("fname",None)
    lname=data.get("lname",None)
    n_name= data.get("nickname",None)
    email=data.get("regemail",None)
    passwd=data.get("pswd",None)
    
    if fname != None and lname!= None and n_name!= None and email!= None and passwd!= None:
        
        email_availability=db.session.query(User).filter(User.user_email==email).first()
        
        if email_availability is None:
            hashed_password=generate_password_hash(passwd)
            newUser=User(user_firstname=fname, user_lastname=lname, user_nickname=n_name, user_email=email, user_pswd=hashed_password)
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


@app.route("/api/v1/create-new-bug/", methods=["POST"])
def create_new_bug():
    data=request.get_json()
    project_affected=data.get('affectedProject')
    bug_description_received=data.get('bugDescription')
    userid=data.get('userId')
    
    new_bug=Bugsheet(bug_project=project_affected, bug_description=bug_description_received, bug_status="Unsolved")
    db.session.add(new_bug)
    db.session.commit()
    
    return {"status":"True", "message":"Bug Added"}