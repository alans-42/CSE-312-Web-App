from pymongo import MongoClient
import re
import bcrypt
import secrets
import hashlib

mongo_client = MongoClient("mongo")
data_base = mongo_client["loopie_boop"]
user_data = data_base["users"]
token_data = data_base["token"]

# adds salted+hashed verison of password ot database alogn with user name
def sign_up(username,password):
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


    