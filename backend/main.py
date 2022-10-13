import os.path

from sanic import Sanic, Blueprint
from sanic.response import file, empty

from news_blueprint import news_bp
from today_of_history_blueprint import history_bp
from weather_forecast_blueprint import weather_bp
from websites_navigation_blueprint import websites_bp

app = Sanic('FrontPage')
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
app.static('/', root + '/frontend/build/index.html', name='index')
app.static('/manifest.json', root + '/frontend/build/manifest.json', name='manifest')
app.static('/favicon.ico', root + '/frontend/build/favicon.ico', name='favicon')
app.static('/logo192.png', root + '/frontend/build/logo192.png', name='logo192')
bp_group = Blueprint.group(weather_bp, websites_bp, history_bp, news_bp, url_prefix='/api')
app.blueprint(bp_group)


@app.get('/static/<filepath:path>')
async def get_static(_request, filepath):
    f = f'{root}/frontend/build/static/{filepath}'
    if os.path.exists(f):
        return await file(f, headers={'cache-control': 'public, 31536000'})
    return empty(status=404)


if __name__ == '__main__':
    app.run(access_log=True)
