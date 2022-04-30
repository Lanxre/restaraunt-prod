from pymongo import MongoClient
from pymongo.collection import Collection


from ..settings import mongo_settings as settings

__all__ = ("MongoBase")

client = MongoClient(settings.uri)

class MongoBase:
	db = client['restaurantdb']