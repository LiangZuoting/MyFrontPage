from datetime import date

import httpx
from sanic import Blueprint, json

from appcodes.appcodes import ALIYUN_APPCODE

history_bp = Blueprint('TodayOfHistory', url_prefix='/history')
history_bp.ctx.update_time = date.today()
history_bp.ctx.cached_history_of_today = None


@history_bp.get('/today')
async def get_history_of_today(_request):
    update_time = history_bp.ctx.update_time
    cached_data = history_bp.ctx.cached_history_of_today
    if cached_data is not None and date.today() == update_time:
        return cached_data
    async with httpx.AsyncClient() as client:
        r = await client.get(f'https://ali-todayhistory.showapi.com/today-of-history?needContent=1', headers={'Authorization': f'APPCODE {ALIYUN_APPCODE}'})
        if r.status_code != 200:
            return json({'ret': r.status_code})
        j = r.json()
        if 'showapi_res_body' in j:
            return json({'ret': 0, 'data': j['showapi_res_body']['list'][:5]})
    return json({'ret': 500})
