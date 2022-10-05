from datetime import datetime, date

import httpx
from sanic import Blueprint, json

from appcodes.appcodes import ALIYUN_APPCODE

news_bp = Blueprint('News', url_prefix='/news')
news_bp.ctx.update_time = datetime.now()
news_bp.ctx.cached_news = None


@news_bp.get('/')
async def get_news(_request):
    cached_news = news_bp.ctx.cached_news
    update_time = news_bp.ctx.update_time
    if cached_news is not None and update_time.date() == date.today() and (datetime.now() - update_time).total_seconds() < 4 * 60 * 60:
        return json(cached_news)
    toutiao = await get_news_by_channel('头条')
    caijing = await get_news_by_channel('财经')
    tiyu = await get_news_by_channel('体育')
    junshi = await get_news_by_channel('军事')
    keji = await get_news_by_channel('科技')
    news_bp.ctx.update_time = datetime.now()
    news_bp.ctx.cached_news = {'ret': 0, 'data': [toutiao, caijing, tiyu, junshi, keji]}
    return json(news_bp.ctx.cached_news)


async def get_news_by_channel(channel):
    url = f'https://jisunews.market.alicloudapi.com/news/get?channel={channel}'
    async with httpx.AsyncClient() as client:
        r = await client.get(url, headers={'Authorization': f'APPCODE {ALIYUN_APPCODE}'})
        if r.status_code != 200:
            return {'ret': r.status_code}
        j = r.json()
        if j['status'] != 0:
            return {'ret': j['status']}
        return {'ret': 0, 'channel': channel, 'data': j['result']['list']}
    return {'ret': 500}
