from nameko.standalone.rpc import ClusterRpcProxy
from sanic import Blueprint, response

from rabbitmqconfig.rabbitmq_config import USER, PASS, HOST

weather_bp = Blueprint('WeatherForecast', url_prefix='/weatherforecast')


@weather_bp.get('/')
async def get_forecast(_request):
    with ClusterRpcProxy({'AMQP_URI': f'amqp://{USER}:{PASS}@{HOST}'}) as rpc:
        result = rpc.weather_forecast_service.get_weather_forecast('广东', '广州', '南沙')
        return response.json(result)
    return response.json({'ret': 500})
