from flask import jsonify, request
from application import app
from application.models import *

@app.route("/bugwatch-status-cleanup/")
def clean_up():
    users = User.query.all()
    if users == []:
        pass
    else:
        for user in users:
            if user.confirm_email == "False":
                db.session.delete(user)
                db.session.commit()
            else:
                pass
        return "Clean up successful"