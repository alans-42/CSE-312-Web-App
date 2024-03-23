from flask import Flask, send_from_directory, make_response, render_template, request, render_template_string, escape
from helper import *
app = Flask(__name__)

from pymongo import MongoClient
from bson.json_util import dumps
client = MongoClient('mongodb_uri')
db = client.fitness_app
lunch_logs = db.lunch_logs

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
    file =  send_from_directory('templates', path)
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

@app.route('/log_lunch', methods=['POST'])
def log_lunch():
    lunch = escape(request.form['lunch'])
    calories = escape(request.form['calories'])
    lunch_logs.insert_one({'lunch': lunch, 'calories': calories})
    return "Lunch logged successfully!"


@app.route('/view_logs')
def view_logs():
    logs = list(lunch_logs.find({}))
    logs_json = dumps(logs)
    
    logs_template = '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Lunch Logs</title>
    </head>
    <body>
        <h1>Lunch Logs</h1>
        {% for log in logs %}
            <div>
                <p>Lunch: {{ log['lunch'] }}</p>
                <p>Calories: {{ log['calories'] }}</p>
            </div>
        {% endfor %}
    </body>
    </html>
    '''
    return render_template_string(logs_template, logs=logs)

if __name__ == "__main__":
    host = '0.0.0.0'
    port = 8080

    app.run(debug=True, host=host, port=port)