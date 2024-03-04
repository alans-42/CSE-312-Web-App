from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def index():
    error = None
    file = render_template("index.html", error=error)
    return file

@app.route('/static/<path:path>')
def send_css(path):
    return send_from_directory('static', path)

@app.route('/newFile.html')
def send_new():
    error = None
    return render_template("newFile.html", error=error)