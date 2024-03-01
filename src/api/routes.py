"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from api.services.analysis import Analysis
from api.services.predict import Predict
from flask_cors import CORS
import json
 


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api, origins=['http://localhost:3000'], \
    methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], \
    supports_credentials=True
)
@api.route('/white-noise', methods=['POST'])
def test_white_noise():
    requestBody = request.get_json()
    data_serie = requestBody["data"]

    result = Analysis().test_white_noise(data_serie)

    return json.dumps(result), 200


@api.route('/stationarity-test', methods=['POST'])
def test_stationarity():
    requestBody = request.get_json()
    data_serie = requestBody["data"]
    result = Analysis().test_stationarity(data_serie)

    return json.dumps(result), 200

@api.route('/granger-causality-test', methods=['POST'])
def test_grander_causality():
    requestBody = request.get_json()
    # print(requestBody)
    data_serie = requestBody["data"]
    data_keys = requestBody["dataKeys"]
    print(data_keys)
    result = Analysis().test_granger_causality(data_serie, data_keys)
    return result, 200


@api.route('/test-var', methods=['POST'])
def test_var():
    print("hEREkfjnkdfjvnkfdjvn!!!")
    requestBody = request.get_json()
    data_serie = requestBody["data"]


    # Opening JSON file
    # f = open('/Users/yarynakorduba/Projects/master-thesis-full-stack/src/front/js/pages/App/test.json')
    
    # returns JSON object as 
    # a dictionary
    # data_serie = json.load(f)
    # print(data_serie)

    result = Predict().test_var(data_serie)
    return result, 200
