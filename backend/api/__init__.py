from .websites import websites
from sanic import Blueprint

api = Blueprint.group(websites, url_prefix="/api")
