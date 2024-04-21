from flask import Flask, send_file, make_response, render_template, request
from flask_socketio import SocketIO, emit
from helper import *
from html import escape
import math, mimetypes, sys
from werkzeug.utils import secure_filename
import os
import uuid
from flask import send_from_directory
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)
username = "bob"

@socketio.on('my post')
def sock_data(message):
    my_id = post_id()
    post = {'data':message,'postId':my_id,'likes': 0, 'comments': []}
    post_save(post)
    emit('my response',[{'data':message,'postId':my_id,'likes': 0, 'comments': []}],broadcast=True)

@socketio.on('connect')
def show_logs():
    posts = GET_posts()
    emit('my response',posts)



#app.config['UPLOAD_FOLDER'] = '/root/uploads'
@app.route('/', methods=['GET'])
def index():
    error = None
    username = ""
    cook = request.cookies.get("auth_toke",-1)
    if cook != -1:
        user = check_token(cook)
        if user:
            username = user["username"]
    file = render_template('index.html', error=error,USER=username)
    response = make_response(file)
    response.headers['Content-Type'] = 'text/html; charset=utf-8'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    print("Hey", file=sys.stderr)
    return response

@app.route('/public/<path:path>', methods=['GET'])
def send_static_files(path):
    mimeType = mimetypes.guess_type(path)
    response = make_response(send_file('public/' + path, mimetype=mimeType[0]))
    response.headers['X-Content-Type-Options'] = 'nosniff'

    return response

@app.route('/templates/<path:path>', methods=['GET'])
def send_templates(path):
    token = request.cookies.get("auth_toke",-1)
    if path == "register.html" and token != -1:
        if check_token(token) != False:
            response = make_response()
            response.headers["location"] = "/account_user"
            response.headers['X-Content-Type-Options'] = 'nosniff'
            response.status = 302
            return response
    file = render_template(path)
    response = make_response(file)
    response.headers['Content-Type'] = 'text/html; charset=utf-8'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    return response

@app.route('/account_register', methods=['POST'])
def check_username():
    username = escape(request.form["username"])
    password = escape(request.form["password"])
    password2 = escape(request.form["password2"])
    #validate passwords match
    if password != password2:
        response = make_response()
        response.headers["location"] = "/templates/register.html"
        response.headers['Content-Type'] = 'text/html; charset=utf-8'
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.status = 302
        return response
    status = sign_up(username,password)
    if status == False:
        response = make_response()
        response.headers["location"] = "/templates/register.html"
        response.headers['Content-Type'] = 'text/html; charset=utf-8'
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.status = 302
        return response
    response = make_response()
    response.headers["location"] = "/templates/login.html"
    response.headers['Content-Type'] = 'text/html; charset=utf-8'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.status = 302
    return response
#this is the account page after successful login
@app.route("/account_user", methods = ["GET"])
def show_account():
    error = None
    username = ""
    cook = request.cookies.get("auth_toke",-1)
    if cook != -1:
        user = check_token(cook)
        if user:
            username = user["username"]

    account_info = get_account_info(username)
    user_document = user_data.find_one({"username": username})

    if account_info != -1:
        height = int(account_info["height_inches"])
        feet = math.floor(height / 12)
        inches = height - (feet * 12)
        str_height = str(feet) + " feet and " + str(inches) + " inches"
        profile_pic = user_document.get('profile_pic', 'default.jpg')
        print(profile_pic)
        print("@@@@@@@@@@@@@@@@@@@@@@@@")
        file = render_template('account.html',profile_pic=profile_pic, error=error,USER=username,name=account_info["fullname"],Gender=account_info["gender"],
                               age=account_info["age"],weight=account_info["weight"],height = str_height)
    else:
        profile_pic=user_document.get('profile_pic', 'default.jpg')
        file = render_template('account.html',profile_pic=profile_pic, error=error,USER=username)
    response = make_response(file)
    response.headers['Content-Type'] = 'text/html; charset=utf-8'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    return response

#logout endpoint
@app.route("/logout_user", methods = ["POST"])
def log_out():
    cook = request.cookies.get("auth_toke",-1)
    response = make_response()
    response.headers["location"] = "/"
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.status = 302
    if cook != -1:
        log_user_out(cook)
        response.delete_cookie("auth_toke")
    return response

#this is te endpoint to send the html form for user info
@app.route("/user_info_page", methods = ["POST"])
def serve_user():
    file = render_template("account_info.html")
    response = make_response(file)
    response.headers['Content-Type'] = 'text/html; charset=utf-8'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    return response
#this is the end point reached when the user presses enter after entering data
@app.route("/user_info",methods = ["POST"])
def user_info():
    user_info_dict = {}
    user_info_dict["fullname"] = escape(request.form["user_fullname"])
    user_info_dict["gender"] = escape(request.form["user_gender"])
    user_info_dict["age"] = escape(request.form["user_age"])
    user_info_dict["weight"] = escape(request.form["user_weight"])
    user_info_dict["height_inches"] = escape(request.form["user_height"])
    add_user_data(user_info_dict,request.cookies.get("auth_toke",-1))
    #return account page redirect
    response = make_response()
    response.headers["location"] = "/account_user"
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.status = 302
    return response

@app.route("/account_login",methods = ["POST"])
def validate_user():
    error = None
    username = escape(request.form["username"])
    password = escape(request.form["password"])
    token = log_in(username,password)
    if token != -1:
        response = make_response()
        response.set_cookie("auth_toke",value=token,max_age=50000,httponly=True)
        response.headers["location"] = "/"
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.status = 302
    else:
        file = render_template('login.html',error=error,MESSAGE="Invalid username or password, please try again")
        response = make_response(file)
        response.headers['X-Content-Type-Options'] = 'nosniff'

    return response

@app.route("/send-post", methods=['POST'])
def makeForumPost():
    response = make_response()
    response.headers['X-Content-Type-Options'] = 'nosniff'
    # Only allows logged in users to post
    if request.cookies.get('auth_toke', 0) and check_token(request.cookies['auth_toke']):
        POST_posts(check_token(request.cookies['auth_toke']), request.data)
        response.status = 200
    else:
        response.status = 403

    return response

@app.route("/send-post", methods=['GET'])
def getForumPosts():
    response = make_response()
    response.headers['X-Content-Type-Options'] = 'nosniff'
    data = GET_posts()
    response.set_data(json.dumps(data))
    response.status = 200

    return response

@app.route("/send-comment", methods=['POST'])
def makeComment():
    response = make_response()
    response.headers['X-Content-Type-Options'] = 'nosniff'
    # Only allows logged in users to post
    if request.cookies.get('auth_toke', 0) and check_token(request.cookies['auth_toke']):
        POST_comment(check_token(request.cookies['auth_toke']), request.data)
        response.status = 200
    else:
        response.status = 403

    return response

@app.route('/upload-profile-picture', methods=['POST'])
def upload_profile_picture():
    if 'profile_picture' not in request.files:
        return 'No file part', 400
    file = request.files['profile_picture']
    if file.filename == '':
        return 'No selected file', 400
    unique_filename = str(uuid.uuid4()) + "_" + secure_filename(file.filename)
    file_path = os.path.join('/root/uploads', unique_filename)
    file.save(file_path)

    token = request.cookies.get("auth_toke", -1)
    username = get_username_from_token(token)
    if username:
        user_data.update_one({"username": username}, {"$set": {"profile_pic": unique_filename}}, upsert=True)
    else:
        return 'Unauthorized', 401

    response = make_response()
    response.headers["location"] = "/account_user"
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.status = 302
    return response

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory('/root/uploads', filename)



if __name__ == "__main__":
    host = '0.0.0.0'
    port = 8080
    socketio.run(app,debug=True, host=host, port=port, allow_unsafe_werkzeug=True)