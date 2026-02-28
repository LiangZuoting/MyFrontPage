from .news import news
from .websites import websites
from sanic import Blueprint

api = Blueprint.group(news, websites, url_prefix="/api")
