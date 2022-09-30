import json
from datetime import datetime, date

import urllib3
from nameko.rpc import rpc
# USE your aliyun appcode to get this service
from appcodes import ALIYUN_APPCODE

global last_update_time
global last_update_result
last_update_time = None
last_update_result = None


class WeatherForecastService:
    name = 'weather_forecast_service'

    @rpc
    def get_weather_forecast(self, province, city, area):
        global last_update_time
        global last_update_result
        if last_update_result is not None \
                and last_update_time is not None \
                and last_update_time.date() == date.today() \
                and (datetime.now() - last_update_time).total_seconds() < 4 * 60 * 60:
            return last_update_result
        http = urllib3.PoolManager()
        url = f'https://iweather.market.alicloudapi.com/address?city={city}&needday=7&prov={province}'
        if area is not None:
            url = url + f'&area={area}'
        rsp = http.request('GET', url, headers={'Authorization': f'APPCODE {ALIYUN_APPCODE}'})
        if rsp.status != 200:
            return {'ret': rsp.status}
        j = json.loads(rsp.data)
        ret = j['ret']
        if ret != 200:
            return {'ret': ret}
        result = []
        for day in j['data']['day7']:
            result.append({'date': day['date'], 'week': day['week'], 'nongli': day['nongli'],
                           'weather': f"{day['day_air_weather']}转{day['night_air_weather']}",
                           'temperature': f"{day['day_air_temperature']}-{day['night_air_temperature']}",
                           'wind_power': f"{day['day_wind_power']}转{day['night_wind_power']}",
                           'wind_direction': f"{day['day_wind_direction']}转{day['night_wind_direction']}",
                           'sunrise': day['sun_begin'], 'sunset': day['sun_end'], 'aqi': day['aqi'],
                           'quality': day['quality']})
        last_update_time = datetime.now()
        last_update_result = json.dumps({'ret': 200, 'data': result})
        return last_update_result
