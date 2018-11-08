from flask import Flask, flash, request, redirect, url_for, send_from_directory
from werkzeug.utils import secure_filename
import os
import time
import subprocess
import json
from parse import process_rofl

UPLOAD_FOLDER = "downloads"
ALLOWED_EXTENSIONS = set(["rofl"])

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = "./uploads"
app.secret_key = "super secret key"


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/upload", methods=["POST"])
@app.route("/web_upload", methods=["POST"])
def upload_file_web():
    # check if the post request has the file part
    if "file" not in request.files:
        response = app.response_class(
            response="no file", status=400, mimetype="text/plain"
        )
        return response
    file = request.files["file"]
    # if user does not select file, browser also
    # submit an empty part without filename
    if file.filename == "":
        response = app.response_class(
            response="empty file", status=400, mimetype="text/plain"
        )
        return response
    # passes
    if file and allowed_file(file.filename):

        if "match-id" in request.headers:
            # If the user provided a match ID, use that name
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

        response = app.response_class(
            response=str(basic_json), status=200, mimetype="application/json"
        )
        return response

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
    else:
        response = app.response_class(
            response="not found", status=404, mimetype="text/plain"
        )
        return response


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
