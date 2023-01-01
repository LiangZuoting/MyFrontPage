from datetime import datetime, date
import json
import httpx
from sanic import Blueprint, response

from appcodes.appcodes import ALIYUN_APPCODE

news_bp = Blueprint('News', url_prefix='/news')
news_bp.ctx.update_time = datetime.now()
news_bp.ctx.cached_news = None

channels = {'头条': 'https://top.news.sina.com.cn/ws/GetTopDataList.php?top_cat=www_www_all_suda_suda',
            '财经': 'https://top.finance.sina.com.cn/ws/GetTopDataList.php?top_cat=finance_0_suda',
            '体育': 'https://top.sports.sina.com.cn/ws/GetTopDataList.php?top_cat=sports_suda',
            '军事': 'https://top.news.sina.com.cn/ws/GetTopDataList.php?top_cat=news_mil_suda',
            '科技': 'https://top.tech.sina.com.cn/ws/GetTopDataList.php?top_cat=tech_news_suda'}


@news_bp.get('/')
async def get_news(_request):
    cached_news = news_bp.ctx.cached_news
    update_time = news_bp.ctx.update_time
    if cached_news is not None and update_time.date() == date.today() and (datetime.now() - update_time).total_seconds() < 4 * 60 * 60:
        return response.json(cached_news)
    toutiao = await get_news_by_channel('头条')
    caijing = await get_news_by_channel('财经')
    tiyu = await get_news_by_channel('体育')
    junshi = await get_news_by_channel('军事')
    keji = await get_news_by_channel('科技')
    news_bp.ctx.update_time = datetime.now()
    news_bp.ctx.cached_news = {'ret': 0, 'data': [toutiao, caijing, tiyu, junshi, keji]}
    return response.json(news_bp.ctx.cached_news)


async def get_news_by_channel(channel):
    url = f'{channels[channel]}&top_type=day&top_time={date.today().strftime("%Y%m%d")}&top_show_num=10&top_order=DESC'
    async with httpx.AsyncClient() as client:
        r = await client.get(url)
        if r.status_code != 200:
            return {'ret': r.status_code}
        text = r.text.removeprefix('var data = ')
        text = text.removesuffix(';\n')
        j = json.loads(text)
        return {'ret': 0, 'channel': channel, 'data': j['data']}
    return {'ret': 500}
