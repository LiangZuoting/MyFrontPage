import asyncio
import os
import time

import httpx
import sanic
from sanic import Blueprint

WEATHER_DATA_CACHE_MAX_AGE = 4 * 60 * 60  # 4 hours

weather_bp = Blueprint('Weather', url_prefix='/weather')
open_weather_key = os.getenv('OPEN_WEATHER_KEY')
wind_direction_expr = ("北", "北偏东北", "东北", "东偏东北", "东", "东偏东南", "东南", "南偏东南", "南", "南偏西南", "西南", "西偏西南", "西", "西偏西北", "西北", "北偏西北")


@weather_bp.before_server_start
async def worker_start(app):
    app.ctx.last_update_time = 0


@weather_bp.get('/')
async def get_weather(request):
    now = time.time()
    if now - request.app.ctx.last_update_time > WEATHER_DATA_CACHE_MAX_AGE:
        data = await asyncio.gather(get_current_weather(), get_forecast())
        request.app.ctx.last_update_time = now
        request.app.ctx.weather_data = data
    data = request.app.ctx.weather_data
    return sanic.json({'ret': 200, 'now': data[0], 'forecast': data[1]})


async def get_current_weather():
    async with httpx.AsyncClient() as client:
        resp = await client.get(f'https://api.openweathermap.org/data/2.5/weather?lat=23.1167&lon=113.25&appid={open_weather_key}&units=metric')
        if resp.status_code != 200:
            return {'ret': resp.status_code, 'desc': 'request error'}
        data = resp.json()
        code = int(data['cod'])
        if code != 200:
            return {'ret': code, 'desc': 'open weather error'}
        result = get_weather(data)
        sun = data['sys']
        result['sunrise'] = time_str(sun['sunrise'])
        result['sunset'] = time_str(sun['sunset'])
        return result


async def get_forecast():
    async with httpx.AsyncClient() as client:
        resp = await client.get(f'https://api.openweathermap.org/data/2.5/forecast?lat=23.1167&lon=113.25&appid={open_weather_key}&units=metric')
        if resp.status_code != 200:
            return {'ret': resp.status_code, 'desc': 'request error'}
        data = resp.json()
        code = int(data['cod'])
        if code != 200:
            return {'ret': code, 'desc': 'open weather error'}
        arr = data['list']
        result = []
        for i in range(0, len(arr), 8):
            result.append(get_weather(arr[i]))
        return result


def get_weather(data):
    weather = data['main']
    wind = data['wind']
    return {'temp': temp_str(weather['temp']), 'temp_min': temp_str(weather['temp_min']),
            'temp_max': temp_str(weather['temp_max']),
            'humidity': percentage_str(weather['humidity']), 'wind_speed': speed_str(wind['speed']),
            'wind_direction': direction_str(wind['deg']), 'time': time_str(data['dt'])}


def temp_str(temp):
    return f'{temp}℃'


def percentage_str(num):
    return f'{num}%'


def speed_str(speed):
    return f'{speed}米/秒'


def direction_str(degree):
    direction = int((degree / 22.5) + 0.5)
    return f'{wind_direction_expr[direction % 16]}风'


def time_str(timestamp):
    t = time.localtime(timestamp)
    return time.strftime('%Y-%m-%d %H:%M:%S', t)
