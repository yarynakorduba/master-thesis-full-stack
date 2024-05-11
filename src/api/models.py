from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import JSON
import datetime

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
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
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
    
