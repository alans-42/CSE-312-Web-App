from flask import Flask, send_from_directory, make_response, render_template, request, redirect
from helper import *
from markupsafe import escape
import math
app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    error = None
    username = ""
    cook = request.cookies.get("auth_toke",-1)
    file = render_template('index.html', error=error,USER=username)
    if cook != -1:
        user = check_token(cook)
        if user:
            username = user["username"]
    response = make_response(file)
    response.headers['X-Content-Type-Options'] = 'nosniff'
    return response

@app.route('/static/<path:path>', methods=['GET'])
def send_css(path):
    # I think this not beinf render temlate may be the reason that the {{message}} is showing up
    file = send_from_directory('static', path)
    response = make_response(file)
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
    file = send_from_directory('templates', path)
    response = make_response(file)
    response.headers['X-Content-Type-Options'] = 'nosniff'
    return response

@app.route('/account_register', methods=['POST'])
def check_username():
    username = request.form["username"]
    password = request.form["password"]
    password2 = request.form["password2"]
    #validate passwords match
    if password != password2:
        response = make_response()
        response.headers["location"] = "/templates/register.html"
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.status = 302
        return response
    status = sign_up(username,password)
    if status == False:
        response = make_response()
        response.headers["location"] = "/templates/register.html"
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.status = 302
        return response
    response = make_response()
    response.headers["location"] = "/templates/login.html"
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
    if account_info != -1:
        height = int(account_info["height_inches"])
        feet = math.floor(height / 12)
        inches = height - (feet * 12)
        str_height = str(feet) + " feet and " + str(inches) + " inches"
        file = render_template('account.html', error=error,USER=username,name=account_info["fullname"],Gender=account_info["gender"],
                               age=account_info["age"],weight=account_info["weight"],height = str_height)
    else:
        file = render_template('account.html', error=error,USER=username)
    response = make_response(file)
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
    username = request.form["username"]
    password = request.form["password"]
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


if __name__ == "__main__":
    host = '0.0.0.0'
    port = 8080

    app.run(debug=True, host=host, port=port)