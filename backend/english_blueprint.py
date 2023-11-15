import json
import random
import sanic
from sanic import Blueprint


english_bp = Blueprint('English', url_prefix='/english')


@english_bp.before_server_start
async def worker_start(app):
    f = open('../db/english_words.json', 'r', encoding='utf-8')
    app.ctx.words = json.load(f)
    f.close()


@english_bp.get('/words')
async def get_words(request):
    """
    随机获取10个单词
    :param request:
    :return:
    """
    words = random.choices(request.app.ctx.words, k=10)
    return sanic.json({'ret': 200, 'data': words})
