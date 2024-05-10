import json
from api.models import Configuration


class Configurations:
  def __init__(self):
    self = self

  def _serialize_general_info(self, config):
    return {
        "id": config.id,
        "name": config.name
    }

  def _serialize(self, config):
    return {
        "id": config.id,
      "name": config.name,
        "data": config.data
    }

  def create_configuration(self):
    return None
  
  def get_configurations(self):
    configurations = Configuration.query.all()
    response = []
    for configuration in configurations:
      response.append(self._serialize_general_info(configuration))
    print(response)
    return json.dumps(response) #map(lambda x: self._serialize(x), configurations)

  def get_configuration(self, configuration_id):
    configuration = Configuration.query.get(configuration_id)
    return json.dumps(self._serialize(configuration))