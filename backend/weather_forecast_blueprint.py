from datetime import datetime, date

import httpx
from sanic import Blueprint, json

from appcodes.appcodes import ALIYUN_APPCODE

weather_bp = Blueprint('WeatherForecast', url_prefix='/weatherforecast')
weather_bp.ctx.update_time = datetime.now()
weather_bp.ctx.cached_forecast = None


@weather_bp.get('/')
async def get_forecast(_request):
    last_update_time = weather_bp.ctx.update_time
    if weather_bp.ctx.cached_forecast is not None \
            and last_update_time.date() == date.today() \
            and (datetime.now() - last_update_time).total_seconds() < 4 * 60 * 60:
        return json(weather_bp.ctx.cached_forecast)
    panyu = await get_city_forecast('广东', '广州', '番禺')
    nansha = await get_city_forecast('广东', '广州', '南沙')
    weather_bp.ctx.update_time = datetime.now()
    weather_bp.ctx.cached_forecast = {'ret': 0, 'data': [panyu, nansha]}
    return json(weather_bp.ctx.cached_forecast)


async def get_city_forecast(province, city, area):
    url = f'https://iweather.market.alicloudapi.com/address?city={city}&needday=7&prov={province}'
    if area is not None:
        url = url + f'&area={area}'
    async with httpx.AsyncClient() as client:
        r = await client.get(url, headers={'Authorization': f'APPCODE {ALIYUN_APPCODE}'})
        if r.status_code != 200:
            return {'ret': r.status_code}
        j = r.json()
        ret = j['ret']
        if ret != 200:
            return {'ret': ret}
        location = {'province': province, 'city': city, 'area': area}
        result = []
        for day in j['data']['day7']:
            result.append({'date': day['date'],
                           'week': day['week'], 'nongli': day['nongli'],
                           'weather': format_day_night_data(day['day_air_weather'], day['night_air_weather'], '转'),
                           'temperature': format_day_night_data(day['day_air_temperature'], day['night_air_temperature'], '-'),
                           'wind_power': format_day_night_data(day['day_wind_power'], day['night_wind_power'], '转'),
                           'wind_direction': format_day_night_data(day['day_wind_direction'], day['night_wind_direction'], '转'),
                           'sunrise': day['sun_begin'], 'sunset': day['sun_end'], 'aqi': day['aqi'],
                           'quality': day['quality']})
        return {'ret': 0, 'data': {'location': location, 'weather': result}}
    return {'ret': 500}


def format_day_night_data(day, night, seperator):
    if day == night:
        return day
    return f'{day}{seperator}{night}'
