import jwt

global SECRETKEY
SECRETKEY = "mysecretkey"


def genToken(email, password):
    global SECRETKEY
    # Define the payload
    payload = {"email": email, 'password': password}

    # Create the token
    token = jwt.encode(payload, SECRETKEY, algorithm="HS256")
    print(token)
    return token


def verifyToken(TOKEN):
    global SECRETKEY
    try:
        payload = jwt.decode(TOKEN, SECRETKEY, algorithms=["HS256"])
        print("valid token")
        print(payload)
    except jwt.InvalidSignatureError:
        print('Invalid token')


userEmail = "8jk.ang8@gmail.com"
userPassword = "ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f"
userToken = genToken(userEmail, userPassword)
verifyToken(userToken)
