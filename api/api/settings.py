import pydantic

__all__ = ("api_settings", "mongo_settings")


class BaseSettings(pydantic.BaseSettings):
    class Config:
        env_file = ".env"


class APISettings(BaseSettings):
    title: str = "People API"
    host: str = "0.0.0.0"
    port: int = 5000
    log_level: str = "INFO"

    class Config(BaseSettings.Config):
        env_prefix = "API_"


class MongoSettings(BaseSettings):
    uri: str = "mongodb+srv://vittalius:<password>@cluster0.5qo0t.mongodb.net/" \
               "myFirstDatabase?retryWrites=true&w=majority"

    class Config(BaseSettings.Config):
        env_prefix = "MONGO_"


api_settings = APISettings()
mongo_settings = MongoSettings()