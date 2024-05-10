"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from api.services.arima import Arima
from api.services.configurations import Configurations
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from api.services.statistical_tests import Analysis
from api.services.var import Predict
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
    print("--------------HERE!!!")
    requestBody = request.get_json()
    data_serie = requestBody["data"]
    result = Analysis().test_stationarity_kpss_pmdarima(data_serie)

    return json.dumps(result), 200

@api.route('/granger-causality-test', methods=['POST'])
def test_grander_causality():
    requestBody = request.get_json()
    data_serie = requestBody["data"]
    data_keys = requestBody["dataKeys"]
    print(data_keys)
    result = Analysis().test_granger_causality(data_serie, data_keys)
    return result, 200


@api.route('/test-var', methods=['POST'])
def test_var():
    requestBody = request.get_json()
    data_serie = requestBody["data"]
    lag_order = requestBody["lagOrder"]
    horizon = requestBody["horizon"]

    result = Predict().test_var(data_serie, lag_order, horizon)
    return result, 200

@api.route('/get-arima-prediction', methods=['POST'])
def get_arima_prediction():
    requestBody = request.get_json()
    data_serie = requestBody["data"]
    # lag_order = requestBody["parameters"]["lag_order"]
    horizon = requestBody["parameters"]["horizon"]
    is_seasonal = requestBody["parameters"]["isSeasonal"]

    min_p = requestBody["parameters"]["minP"]
    max_p = requestBody["parameters"]["maxP"]
    min_q = requestBody["parameters"]["minQ"]
    max_q = requestBody["parameters"]["maxQ"]
    periods_in_season = requestBody["parameters"]["periodsInSeason"]

    result = Arima().arima_predict(data_serie, horizon, is_seasonal, min_p, max_p, min_q, max_q, periods_in_season)
    return result, 200


@api.route('/configurations', methods=['GET'])
def get_configurations():
    config_id = request.args.get('id')
    if config_id:
        result = Configurations().get_configuration(config_id)
    else:
        result = Configurations().get_configurations()
    return result, 200
