from sanic import Sanic, text, Blueprint

from weather_forecast_blueprint import weather_bp

app = Sanic('FrontPage')
bp_group = Blueprint.group(weather_bp, url_prefix='/api')
app.blueprint(bp_group)


@app.get('/')
async def get_index(_request):
    return text('My Front Page')


if __name__ == '__main__':
    app.run(access_log=True)
