import json
from api.models import Configuration
from api.models import db

class Configurations:
  def __init__(self):
    self = self


  def create_configuration(self, data):
    configuration = Configuration(
      id=data["id"],
      name=data["name"],
      data=json.loads(data["data"]),
      time_property=json.loads(data["time_property"]),
      value_properties=json.loads(data["value_properties"]),
    )
    db.session.add(configuration)
    db.session.commit()
    return json.dumps(Configuration.serialize(configuration))
  
  def get_configurations(self):
    configurations = Configuration.query.all()
    response = []
    for configuration in configurations:
      response.append(Configuration.serialize_general_info(configuration))
    print(response)
    return json.dumps(response)

  def get_configuration(self, configuration_id):
    configuration = Configuration.query.get(configuration_id)
    return json.dumps(Configuration.serialize(configuration))