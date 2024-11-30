import json
from api.models import Configuration, PredictionHistory
from api.models import db
from sqlalchemy.sql import text

from api.utils import APIException

class Configurations:
  def __init__(self):
    self = self

  def create_configuration(self, config_data):
    try:
      data = json.loads(config_data["data"])
      time_property = json.loads(config_data["time_property"])
      value_properties = json.loads(config_data["value_properties"])
      if (len(data) == 0):
        raise APIException("Data cannot be empty")
      if (not(time_property) or not(value_properties) or len(value_properties) == 0):
        raise APIException('Time variable and at least one variable to analyze should be indicated')
      
      value_keys = [prop["value"] for prop in (value_properties)]
      def map_item(item):
        try:
          for key in item:
            if (key in value_keys and isinstance(item[key], str)):
              item[key] = float(item[key])
          return item
        except Exception:
          raise APIException("Some values of the selected fields could not be converted to numeric. Please check your dataset and correct the values at fault.")

      mapped_data = [map_item(datum) for datum in data]
      configuration = Configuration(
        id=config_data["id"],
        name=config_data["name"],
        data=mapped_data,
        time_property=time_property,
        value_properties=value_properties,
      )
      db.session.add(configuration)
      db.session.commit()
      return json.dumps(Configuration.serialize(configuration))
    except APIException as e:
        print(e)
        raise e
    except Exception as e:
        print(e)
        raise APIException('Failed to create a configuration')  
  
  def delete_configuration(self, configuration_id):
    db.session.query(PredictionHistory).filter(PredictionHistory.configuration_id == configuration_id).delete()
    result = db.session.query(Configuration).filter(Configuration.id == configuration_id).delete()
    db.session.commit()
    return result
  
  def get_configurations(self):
    configurations = Configuration.query.all()
    response = []
    for configuration in configurations:
      response.append(Configuration.serialize_general_info(configuration))
    return json.dumps(response)

  def get_configuration(self, configuration_id):
    configuration = Configuration.query.get(configuration_id)
    return json.dumps(Configuration.serialize(configuration))