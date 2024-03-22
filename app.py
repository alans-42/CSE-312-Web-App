from flask import Flask, send_from_directory, make_response, render_template, request, redirect
from helper import *
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
    file = send_from_directory('static', path)
    response = make_response(file)
    response.headers['X-Content-Type-Options'] = 'nosniff'
    return response

@app.route('/templates/<path:path>', methods=['GET'])
def send_templates(path):
    file = send_from_directory('templates', path)
    response = make_response(file)
    response.headers['X-Content-Type-Options'] = 'nosniff'
    return response

@app.route('/account_register', methods=['POST'])
def check_username():
    username = request.form["username"]
    password = request.form["password"]
    sign_up(username,password)
    response = make_response()
    response.headers["location"] = "/templates/login.html"
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.status = 302
    return response

@app.route("/account_login",methods = ["POST"])
def validate_user():
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
        file = render_template('login.html',MESSAGE="Invalid username or password, please try again")
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