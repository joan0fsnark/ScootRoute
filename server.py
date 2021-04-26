from flask import Flask, request, render_template
from flask import session, flash, make_response, redirect
import os

app = Flask(__name__)

# Flask uses a secret key to encrypt cookies used to connect
# the browser to the session--so if you want to use sessions,
# you have to have a secret key. If the public learns this
# value, they can forge session information--so for sites with
# security concerns, make sure this isn't checked into a
# public place like GitHub
os.system("source secrets.sh")

app.secret_key = os.environ['SECRETKEY']


@app.route('/')
def index():
    """Homepage."""

    return render_template('index.html')




if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')