import json
import os
from datetime import datetime, timedelta

import httpx
import sanic
from httpx import AsyncClient
from sanic import Blueprint, Request

news = Blueprint("news", url_prefix="/news")
news.ctx.update_time = datetime.now()
news.ctx.cached_news = None
# other categories cannot connect
categories = {
    "财经": "https://top.finance.sina.com.cn/ws/GetTopDataList.php?top_type=day&top_cat=finance_0_suda",
    #"国际": "https://top.news.sina.com.cn/ws/GetTopDataList.php?top_type=day&top_cat=news_world_suda",
    #"军事": "https://top.news.sina.com.cn/ws/GetTopDataList.php?top_type=day&top_cat=news_mil_suda",
    #"科技": "https://top.tech.sina.com.cn/ws/GetTopDataList.php?top_type=day&top_cat=tech_news_suda"
}


@news.get("/")
async def get_news(request: Request):
    now = datetime.now()
    if request.app.ctx.is_prod:
        now = now + timedelta(hours=8)
    if news.ctx.cached_news is not None and news.ctx.update_time.date() == now.date() and now - news.ctx.update_time < timedelta(hours=1):
        return sanic.json(news.ctx.cached_news)
    today = now.strftime("%Y%m%d")
    queries = f"&top_time={today}&top_show_num=20&top_order=DESC"
    async with AsyncClient() as client:
        n = []
        for k, v in categories.items():
            url = f"{v}{queries}"
            r: httpx.Response = await client.get(url)
            if r.status_code != 200:
                continue
            print(r.text)
            text = r.text.replace("var data = ", "")
            text = text.replace(";\n", "")
            d = json.loads(text)["data"]
            for i in d:
                del i["id"]
                del i["author"]
                del i["comment_url"]
                del i["cat_name"]
                del i["top_time"]
                del i["top_num"]
                for e in range(1, 6):
                    a = f"ext{e}"
                    if i.get(a):
                        del i[a]
                del i["time"]
            n.append({"category": k, "news": d})
        news.ctx.cached_news = {"news": n}
        news.ctx.update_time = now
        return sanic.json(news.ctx.cached_news)
