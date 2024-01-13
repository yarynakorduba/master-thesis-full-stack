"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from api.services.analysis import Analysis
from flask_cors import CORS
import json

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api, origins=['http://localhost:3000'], \
    methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], \
    supports_credentials=True
)
@api.route('/white-noise', methods=['POST', 'GET'])
def handle_white_noise():

    f = open('/Users/yarynakorduba/Projects/master-thesis-full-stack/src/api/data/AIR_Q_TU_Graz/output_chunk_1.json')
    data = json.load(f)

    data_serie = [x["health"] for x in data]
    print(data_serie[0])
    result = Analysis.detect_white_noise(data_serie)

    response_body = { "result": result }

    return json.dumps(response_body), 200
