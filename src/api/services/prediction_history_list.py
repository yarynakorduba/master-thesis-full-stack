import json
from api.models import PredictionHistory
from api.models import db


class PredictionHistoryList:
  def __init__(self):
    self = self

  def add_entry_to_prediction_history(self, data):

    entry = PredictionHistory(
      id=data["id"],
      configuration_id=data["configuration_id"],
      prediction_mode=data["prediction_mode"],
      selected_data_boundaries=data.get("selected_data_boundaries", None),
      test_prediction_parameters=data["test_prediction_parameters"],
      real_prediction_parameters=data["real_prediction_parameters"],
      test_prediction=data["test_prediction"],
      real_prediction=data["real_prediction"],
      last_train_point=data["last_train_point"],
      evaluation=data["evaluation"],
      input_data=data["input_data"]
    )
    print("--------------- AAAA!!!!----")
    print(getattr(data, "selected_data_boundaries", None))

    db.session.add(entry)
    db.session.commit()
    return PredictionHistory.serialize(entry)
  

  def get_prediction_history(self, configuration_id):
    history_items = PredictionHistory\
      .query.filter(PredictionHistory.configuration_id == configuration_id)\
      .order_by(PredictionHistory.created_at.desc())
    response = []
    for history_item in history_items:
      response.append(PredictionHistory.serialize(history_item))
    return response
    
  