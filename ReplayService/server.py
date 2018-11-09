from flask import Flask, flash, request, redirect, url_for, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import time
import json
from parse import process_rofl
import sys

ALLOWED_EXTENSIONS = set(["rofl"])

app = Flask(__name__)
CORS(app)
app.config["UPLOAD_FOLDER"] = "./uploads"
app.secret_key = "super secret key"

def error(msg):
    return app.response_class(
            response=json.dumps({"error":  msg}),
            status=400,
            mimetype="application/json"
        )

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def clean_data(raw_dict):
    new_dict = { 'gameVersion':raw_dict['gameVersion'], 'matchId':raw_dict['MatchId'], 'gameLength':raw_dict['gameLength'] }
    player_list = []
    for player in raw_dict['statsJson']:
        player_list.append({ 'name':player['NAME'], 'champion':player['SKIN'], 'playerId':player['ID'] })

    new_dict['players'] = player_list
    return new_dict

@app.route("/exists/<string:matchid>", methods=["GET"])
def check_uploaded(matchid):
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], matchid + ".rofl")
    if os.path.isfile(filepath):
        return app.response_class(
            response="", status=200, mimetype="application/json"
        )
    else:
        return app.response_class(
            response="", status=404, mimetype="application/json"
        )

@app.route("/upload", methods=["POST"])
@app.route("/web_upload", methods=["POST"])
def upload_file_web():
    # check if the post request has the file part
    if "file" not in request.files:
        sys.stderr.write(str(len(request.files)) + '\n')
        #print(len(request.files), file=sys.stdout)
        return error("No file provided in the 'file' key")
    file = request.files["file"]
    # if user does not select file, browser also
    # submit an empty part without filename
    if file.filename == "":
        return error("No filename provided")
    # passes
    if file and allowed_file(file.filename):
        # If the user provided a match ID, use that name
        if "match-id" in request.headers:
            matchid = request.headers["match-id"]
            filepath = os.path.join(app.config["UPLOAD_FOLDER"], str(matchid) + ".rofl")
            if not os.path.isfile(filepath):
                file.save(filepath)

            basic_json = process_rofl(filepath)
        else:
        # If the user didn't specify a match ID, read it from the provided file
            tempfilename = secure_filename(file.filename)
            tempfilepath = os.path.join(
                app.config["UPLOAD_FOLDER"], str(time.time()) + tempfilename
            )

            file.save(tempfilepath)
            # get the information from the replay
            basic_json = process_rofl(tempfilepath)

            # grab the match id and make a path using new file name
            filename = str((json.loads(str(basic_json)))["MatchId"]) + ".rofl"
            filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)

            # check if the new file name exists, if not rename. Otherwise delete temporary
            if not os.path.isfile(filepath):
                os.rename(tempfilepath, filepath)
            else:
                os.remove(tempfilepath)
        #TODO DEAL WITH SUMMONER ID

        return app.response_class(
            response=json.dumps(clean_data(json.loads(str(basic_json)))), status=200, mimetype="application/json"
        )

@app.route("/download/<string:matchid>", methods=["GET"])
def download_file(matchid):
    _filename = matchid + ".rofl"
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], _filename)
    if os.path.isfile(filepath):
        return send_from_directory(
            directory=app.config["UPLOAD_FOLDER"],
            filename=_filename,
            as_attachment=True,
        )
    return error("File not found: " + matchid)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
