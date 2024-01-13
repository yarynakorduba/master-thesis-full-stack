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
    supports_credentials=True)


@api.route('/hello', methods=['POST', 'GET'])
def handle_arima():

    f = open('/Users/yarynakorduba/Projects/master-thesis-full-stack/src/api/data/AIR_Q_TU_Graz/output_chunk_1.json')
    data = json.load(f)

    data_serie = [x["health"] for x in data]
    print(data_serie[0])
    result = Analysis.detect_white_noise(data_serie)
    print(result)

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200
