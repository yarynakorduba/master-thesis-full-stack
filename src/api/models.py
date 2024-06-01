from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import JSON
import datetime
from sqlalchemy.sql import func

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }
    
class Configuration(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    created_at = db.Column(db.DateTime, default=func.now())
    value_properties = db.Column(JSON, nullable=False, default=[])
    time_property = db.Column(JSON, nullable=False, default=[])
    name = db.Column(db.String(300), nullable=False)
    data = db.Column(JSON, nullable=False) # limit 255MB


    def __repr__(self):
        return f'<Configuration {self.id}>'
    
    def serialize_general_info(self):
        return {
            "id": self.id,
            "name": self.name
        }

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "data": self.data,
            "time_property": self.time_property,
            "value_properties": self.value_properties
        }
    


class PredictionHistory(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    configuration_id = db.Column(db.String(36), db.ForeignKey('configuration.id'))
    created_at = db.Column(db.DateTime, default=func.now())
    prediction_mode = db.Column(db.String(10), nullable=False)

    selected_data_boundaries = db.Column(JSON, nullable=True)
    # Contains the input parameters, such as desired max lag order, horizon etc.
    # Input data depends on the model selection (ARIMA / VAR).
    input_data =  db.Column(JSON, nullable=False)

    test_prediction_parameters = db.Column(JSON, nullable=False)
    real_prediction_parameters = db.Column(JSON, nullable=False) # limit 255MB

    test_prediction = db.Column(JSON, nullable=False) # limit 255MB
    real_prediction = db.Column(JSON, nullable=False) # limit 255MB

    last_train_point = db.Column(JSON, nullable=False) # limit 255MB
    evaluation = db.Column(JSON, nullable=False) # limit 255MB

    def __repr__(self):
        return f'<Configuration History Item {self.id} {self.configuration_id}>'

    def serialize(self):
        return {
            "id": self.id,
            "configuration_id": self.configuration_id,
            "created_at": self.created_at.isoformat(),
            "prediction_mode": self.prediction_mode,

            "selected_data_boundaries": self.selected_data_boundaries,

            "test_prediction_parameters": self.test_prediction_parameters,
            "real_prediction_parameters": self.real_prediction_parameters, # limit 255MB

            "test_prediction": self.test_prediction, # limit 255MB
            "real_prediction": self.real_prediction, # limit 255MB

            "last_train_point": self.last_train_point, # limit 255MB
            "evaluation": self.evaluation, # limit 255MB
            "input_data": self.input_data
    }