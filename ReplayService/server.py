from flask import Flask, flash, request, redirect, url_for, send_from_directory
from werkzeug.utils import secure_filename
import os
import time
import subprocess
import json

UPLOAD_FOLDER = 'downloads'
ALLOWED_EXTENSIONS = set(['rofl'])

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = 'super secret key'

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_basic_data(filename):
    result = subprocess.run(['dotnet', 'match_id_helper/RoflHelper.dll', filename], stdout=subprocess.PIPE)
    return result.stdout.decode('UTF-8')

# used for uploading from the website
@app.route('/web_upload', methods=['POST'])
def upload_file_web():
    # check if the post request has the file part
    if 'file' not in request.files:
        response = app.response_class(response='no file',status=400,mimetype='text/plain')
        return response
    file = request.files['file']
    # if user does not select file, browser also
    # submit an empty part without filename
    if file.filename == '':
        response = app.response_class(response='empty file',status=400,mimetype='text/plain')
        return response
    # passes
    if file and allowed_file(file.filename):
        # save the file temporarily
        tempfilename = secure_filename(file.filename)
        tempfilepath = os.path.join(app.config['UPLOAD_FOLDER'], str(time.time()) + tempfilename)
        file.save(tempfilepath)
        # get the information from the replay
        basic_json = get_basic_data(tempfilepath)
        # grab the match id and make a path using new file name
        filename = str((json.loads(basic_json))['MatchId']) + '.rofl'
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        # check if the new file name exists, if not rename. Otherwise delete temporary
        if not os.path.isfile(filepath):
            os.rename(tempfilepath, filepath)
        else:
            os.remove(tempfilepath)

        response = app.response_class(response=basic_json,status=200,mimetype='application/json')
        return response

# used for uploaded from desktop app
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        response = app.response_class(response='no file',status=400,mimetype='text/plain')
        return response
    file = request.files['file']
    # if user does not select file, browser also
    # submit an empty part without filename
    if file.filename == '':
        response = app.response_class(response='empty file',status=400,mimetype='text/plain')
        return response
    # passes
    if file and allowed_file(file.filename):
        matchid = request.headers['match-id']
        playername = request.headers['player-name']
        #check if file with matchid exists, it not save it
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], str(matchid) + '.rofl')
        if not os.path.isfile(filepath):
            file.save(filepath)

        response = app.response_class(response=str(matchid) + str(playername),status=200,mimetype='text/plain')
        return response

@app.route('/download/<string:matchid>', methods=['GET'])
def download_file(matchid):
    _filename = matchid + '.rofl'
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], _filename)
    if os.path.isfile(filepath):
        return send_from_directory(directory=app.config['UPLOAD_FOLDER'], filename=_filename, as_attachment=True)
    else:
        response = app.response_class(response='not found',status=404,mimetype='text/plain')
        return response