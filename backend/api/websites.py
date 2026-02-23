import sanic
from sanic import Blueprint

from models import Websites

websites = Blueprint("websites", url_prefix="/websites")


@websites.get("/")
async def get_all_websites(request):
    all_websites = Websites.all()
    topmost = await Websites.filter(topmost=True)
    topmost = [wb.to_dict() for wb in topmost]
    categories = await all_websites.distinct().values_list("category", flat=True)
    categorical_websites = {}
    for category in categories:
        categorical_websites[category] = [wb.to_dict() for wb in await all_websites.filter(category=category)]
    return sanic.json({"topmost": topmost, "categories": categorical_websites})


@websites.post("/")
async def add_website(request):
    data = request.json
    if data is None:
        return sanic.json({"ret": 403})
    name = data.get("name")
    url = data.get("url")
    category = data.get("category")
    topmost = data.get("topmost")
    if not all([name, url, category, topmost]):
        return sanic.json({"ret": 403})
    await Websites.create(name=name, url=url, category=category, topmost=topmost)
    return sanic.json({"ret": 200})


@websites.put("/")
async def update_website(request):
    data = request.json
    if data is None:
        return sanic.json({"ret": 403})
    id = data.get("id")
    name = data.get("name")
    url = data.get("url")
    category = data.get("category")
    topmost = data.get("topmost")
    if not all([id, name, url, category, topmost]):
        return sanic.json({"ret": 403})
    await Websites.update_from_dict(data)
    return sanic.json({"ret": 200})


@websites.delete("/<id:int>")
async def delete_website(request):
    await Websites.filter(id=id).delete()
    return sanic.json({"ret": 200})


@websites.get("/categories")
async def get_categories(request):
    categories = await Websites.all().distinct().values_list("category", flat=True)
    return sanic.json({"categories": categories})
