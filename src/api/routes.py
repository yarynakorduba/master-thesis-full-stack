"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import api
from api.services.arima import ARIMAPrediction
from api.services.configurations import Configurations
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.services.prediction_history_list import  PredictionHistoryList
from api.utils import generate_sitemap, APIException
from api.services.statistical_tests import StatisticalTests
from api.services.var import VARPrediction
from flask_cors import CORS
import json
 
api = Blueprint('api', __name__) 
CORS(api, origins=['http://localhost:3000'], \
    methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], \
    supports_credentials=True
)

# ----- Statistical Test Routes -----
@api.route('/white-noise', methods=['POST'])
def test_white_noise():
    request_body = request.get_json()
    data = request_body["data"]
    data_keys = request_body["data_keys"]
    max_lag_order = request_body["max_lag_order"]
    print(f"Max Lag Order: {max_lag_order}")
    result = StatisticalTests().multitest_white_noise(data, data_keys, max_lag_order)

    return json.dumps(result), 200


@api.route('/stationarity-test', methods=['POST'])
def test_stationarity():
    request_body = request.get_json()
    data_serie = request_body["data"]
    result = StatisticalTests().test_stationarity_kpss_adf(data_serie)

    return json.dumps(result), 200

@api.route('/granger-causality-test', methods=['POST'])
def test_granger_causality():
    request_body = request.get_json()
    data = request_body["data"]
    data_keys = request_body["data_keys"]
    max_lag_order = request_body["max_lag_order"]
    
    print(f"eee -- eee -- eee {max_lag_order}")
    result = StatisticalTests().multitest_granger_causality(data, data_keys, max_lag_order)
    return result, 200


@api.route('/var-prediction', methods=['POST'])
def test_var():
    request_body = request.get_json()
    data_serie = request_body["data"]
    lag_order = request_body["parameters"]["lagOrder"]
    horizon = request_body["parameters"]["horizon"]
    data_keys = request_body["data_keys"]

    result = VARPrediction().test_var(data_serie, data_keys, lag_order, horizon)
    return result, 200

@api.route('/arima-prediction', methods=['POST'])
def get_arima_prediction():
    try:
        data = request.get_json()
        result = ARIMAPrediction().arima_predict(data)
        return result, 200
    except APIException as e:
        raise e
    except Exception as e:
        print(f"APIException: {e}")
        raise APIException('Failed to make a prediction')

# ----- Configuration Routes -----
@api.route('/configurations', methods=['GET'])
def get_configurations():
    config_id = request.args.get('id')
    if config_id:
        result = Configurations().get_configuration(config_id)
    else:
        result = Configurations().get_configurations()
    return result, 200


@api.route('/configurations', methods=['POST'])
def create_configuration():
    try:
        config_id = request.form["id"]
        file = request.form["data"]
        name = request.form["name"]
        time_property = request.form["time_property"]
        value_properties = request.form["value_properties"]
        result = Configurations().create_configuration({
            "id": config_id,
            "data": file,
            "name": name,
            "time_property": time_property,
            "value_properties": value_properties
        })

        return result, 200
    except APIException as e:
        raise e
    except Exception as e:
        raise APIException('Failed to create a configuration')

@api.route('/configurations', methods=['DELETE'])
def delete_configuration():
    config_id = request.args.get('id')
    result = Configurations().delete_configuration(config_id)
    if (result > 0):
      return json.dumps({ "message": "Item deleted successfully" }), 200
    else:
      raise APIException('The configuration was not found', 404)

# ----- Prediction History Routes -----

@api.route('/prediction_history', methods=['POST'])
def add_entry_to_prediction_history():
    request_body = request.get_json()
    result = PredictionHistoryList().add_entry_to_prediction_history(request_body)
    return json.dumps(result), 200

@api.route('/prediction_history', methods=['GET'])
def get_prediction_history_for_config():
    config_id = request.args.get('configuration_id')
    result = PredictionHistoryList().get_prediction_history(config_id)
    return json.dumps(result), 200
