import os.path

import aiosqlite
import sanic
from sanic import Sanic, Blueprint

from chatgpt_blueprint import gpt_bp
from english_blueprint import english_bp
from news_blueprint import news_bp
from weather_blueprint import weather_bp
from websites_navigation_blueprint import websites_bp

app = Sanic('FrontPage')
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
print(root)
app.static('/', root + '/frontend/build/index.html', name='index')
app.static('/static', root + '/frontend/build/static', name='static')
app.static('/manifest.json', root + '/frontend/build/manifest.json', name='manifest')
app.static('/favicon.ico', root + '/frontend/build/favicon.ico', name='favicon')
app.static('/logo192.png', root + '/frontend/build/logo192.png', name='logo192')
app.static('/logo512.png', root + '/frontend/build/logo512.png', name='logo512')


@app.get('/chatgpt')
async def get_chatgpt_page(_request):
    return await sanic.file(f'{root}/frontend/build/index.html')


@app.before_server_start
async def worker_start(_app):
    app.ctx.db = await aiosqlite.connect('../db/myfrontpage.db')
    app.ctx.db.row_factory = aiosqlite.Row


bp_group = Blueprint.group(weather_bp, websites_bp, news_bp, gpt_bp, english_bp, url_prefix='/api')
app.blueprint(bp_group)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, access_log=True)
