import bcrypt, secrets, hashlib, json
from pymongo import MongoClient
from html import escape

mongo_client = MongoClient("mongo")
data_base = mongo_client["loopie_boop"]
user_data = data_base["users"]
token_data = data_base["token"]
user_info = data_base["user_info"]
posts = data_base["posts"]
ids = data_base["post_ids"]
if ids.find_one({"type": "post"}) == None:
    ids.insert_one({"type": "post", "id": 0}) 

# adds salted+hashed verison of password ot database alogn with user name
def sign_up(username,password):
    find_dup_user = user_data.find_one({"username":username})
    if find_dup_user:
        return False
    pass_bytes = password.encode()
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pass_bytes,salt)
    user_dict = {"username":username, "password": hashed,"salt": salt }
    user_data.insert_one(user_dict)
    return True

# check if user is in system. If they are validate password.
# returns token as in database on valid log in and add token + username to database
# returns -1 on fail
def log_in(username,password):
    user_dict = user_data.find_one({"username":username})
    if user_dict:
        pass_encode = password.encode()
        salt = user_dict["salt"]
        hashed = bcrypt.hashpw(pass_encode,salt)
        if hashed == user_dict["password"]:
            token = secrets.token_urlsafe() #token
            #hash the token then store in database
            hasher = hashlib.sha256()
            hasher.update(token.encode())
            token_hashed = hasher.digest()
            toke_dict = {"token":token_hashed,"username":username}
            token_data.insert_one(toke_dict)
            return token
    return -1
# takes auth token as in header, decodes it amd checks in database
# returns the user_info dict on success, returns False on fail
def check_token(auth_token):
    auth_token = auth_token.encode()
    hasher = hashlib.sha256()
    hasher.update(auth_token)
    auth_token = hasher.digest()
    user_token_dict = token_data.find_one({"token":auth_token},{"_id":0})
    if user_token_dict != None:
        username = user_token_dict["username"]
        user_info_dict = user_data.find_one({"username":username},{"_id":0})
        return user_info_dict
    else:
        return False

#function deletes auth token from db
def log_user_out(token):
    auth_token = token.encode()
    hasher = hashlib.sha256()
    hasher.update(auth_token)
    auth_token = hasher.digest()
    token_data.delete_one({"token":auth_token})

#this adds user info for first time or updates info if already some present
def add_user_data(user_dict,token):
    if token != -1:
        auth_token = token.encode()
        hasher = hashlib.sha256()
        hasher.update(auth_token)
        auth_token = hasher.digest()
        user_token_dict = token_data.find_one({"token":auth_token},{"_id":0})
        if user_token_dict != None:
            username = user_token_dict["username"]
            user_dict["username"] = username
            find_user = user_info.find_one({"username":username})
            if find_user:
                filter1 = {"username":username}
                new_vals = {"$set":user_dict}
                user_info.update_one(filter1,new_vals)
            else:
                user_info.insert_one(user_dict)

#this pulls user info from db and returns dict
def get_account_info(username):
    account_info = user_info.find_one({"username":username},{"_id":0})
    if account_info:
        return account_info
    else:
        return -1

def post_id():
    id_dict = ids.find_one({'type': 'post'})
    my_id = id_dict["id"]
    ids.update_one({'id': my_id}, {'$set': {'id': my_id+1}})
    return my_id

def post_save(dict1):
    posts.insert_one(dict1)
    
def POST_posts(user, data):
    data = json.loads(data.decode())
    postId = ids.find_one({'type': 'post'})
    username = user["username"]
    postData = escape(data['post'])
    time = data['time_posted']
    post = {'username': username, 'post': postData, 'time': time, 'postId': postId['id'], 'likes': 0, 'comments': []}
    ids.update_one({'id': postId['id']}, {'$set': {'id': postId['id']+1}})
    posts.insert_one(post)

def GET_posts():
    allPosts = posts.find({},{'_id':0})
    data = []
    for post in allPosts:
        data.append(post)
    return data

def POST_comment(user, data):
    data = json.loads(data.decode())
    username = user['username']
    commentData = escape(data['comment'])
    postId = data['post_id']
    post = posts.find_one({'postId': postId})

    comment = {'username': username, 'comment': commentData, 'commentId': len(post['comments'])+1}
    newComments = post['comments']
    newComments.append(comment)
    posts.update_one({'postId': postId}, {'$set': {'comments': newComments}})
    
    post = posts.find_one({'postId': postId})