from flask import jsonify, session,request
from werkzeug.security import generate_password_hash,check_password_hash
from application import app
from application.models import *

@app.route("/api/v1/inbox/")
def inbox():
    developer_id=request.args.get("devId")
    messages=db.session.query(Inbox).filter(Inbox.msg_recipient==developer_id).all()
    return {"status":True, "message":messages}