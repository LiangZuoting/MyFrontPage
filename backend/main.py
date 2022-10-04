import os.path

from sanic import Sanic, Blueprint

from today_of_history_blueprint import history_bp
from weather_forecast_blueprint import weather_bp
from websites_navigation_blueprint import websites_bp

app = Sanic('FrontPage')
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
app.static('/', root + '/frontend/build/index.html', name='index')
app.static('/static', root + '/frontend/build/static', name='static')  # Sanic v22.9.0 bug: cannot use relative path here, 404
app.static('/manifest.json', root + '/frontend/build/manifest.json', name='manifest')
app.static('/favicon.ico', root + '/frontend/build/favicon.ico', name='favicon')
app.static('/logo192.png', root + '/frontend/build/logo192.png', name='logo192')
bp_group = Blueprint.group(weather_bp, websites_bp, history_bp, url_prefix='/api')
app.blueprint(bp_group)


if __name__ == '__main__':
    app.run(access_log=True)
