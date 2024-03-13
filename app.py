from flask import Flask, send_from_directory, make_response, render_template, request

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    error = None
    file = render_template('index.html', error=error)
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

@app.route('/account', methods=['POST'])
def check_username():
    username = request.form["username"]
    password = request.form["password"]

    print(username, password)
    return index()

if __name__ == "__main__":
    host = '0.0.0.0'
    port = 8080

    app.run(debug=True, host=host, port=port)