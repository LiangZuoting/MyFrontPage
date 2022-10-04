import uuid

import aiosqlite
from sanic import Blueprint, json

websites_bp = Blueprint('WebsitesNavigation', url_prefix='/websitesnavigation')


@websites_bp.before_server_start
async def on_server_start(app):
    app.ctx.db = await aiosqlite.connect('../db/myfrontpage.db')
    app.ctx.db.row_factory = aiosqlite.Row
    await app.ctx.db.execute('create table if not exists websites(uuid text primary key, name text, url text, tag text, topmost integer)')
    await app.ctx.db.commit()


@websites_bp.get('/')
async def get_all(request):
    async with request.app.ctx.db.execute('select * from websites') as cursor:
        rows = await cursor_to_rows(cursor)
        return json({'ret': 0, 'data': rows})
    return json({'ret': 500})


@websites_bp.get('/topmost')
async def get_topmost(request):
    async with request.app.ctx.db.execute('select * from websites where topmost = 1') as cursor:
        rows = await cursor_to_rows(cursor)
        return json({'ret': 0, 'data': rows})
    return json({'ret': 500})


@websites_bp.get('/tags')
async def get_tags(request):
    async with request.app.ctx.db.execute('select tag from websites group by tag') as cursor:
        rows = []
        async for r in cursor:
            rows.append({'tag': r['tag']})
        return json({'ret': 0, 'data': rows})
    return json({'ret': 500})


@websites_bp.get('/tag/<name:str>')
async def get_websites_by_tag(request, name: str):
    async with request.app.ctx.db.execute(f"select * from websites where tag = '{name}'") as cursor:
        rows = await cursor_to_rows(cursor)
        return json({'ret': 0, 'data': rows})
    return json({'ret': 500})


@websites_bp.delete('/<_uuid:str>')
async def delete_website(request, _uuid: str):
    await request.app.ctx.db.execute(f"delete from websites where uuid = '{_uuid}'")
    await request.app.ctx.db.commit()
    return json({'ret': 0})


@websites_bp.delete('/tag/<name:str>')
async def delete_websites_by_tag(request, name: str):
    await request.app.ctx.db.execute(f"delete from websites where tag = '{name}'")
    await request.app.ctx.db.commit()
    return json({'ret': 0})


@websites_bp.post('/')
async def add_website(request):
    name, url, tag, topmost = request_to_row(request)
    if not name or not url:
        return json({'ret': 400})
    await request.app.ctx.db.execute(f"insert into websites values('{uuid.uuid4().hex}', '{name}', '{url}', '{tag}', {topmost})")
    await request.app.ctx.db.commit()
    return json({'ret': 0})


@websites_bp.put('/<_uuid:str>')
async def update_website(request, _uuid: str):
    name, url, tag, topmost = request_to_row(request)
    if not name or not url:
        return json({'ret': 400})
    await request.app.ctx.db.execute(f"update websites set name = '{name}', url = '{url}', tag = '{tag}', topmost = {topmost} where uuid = '{_uuid}'")
    await request.app.ctx.db.commit()
    return json({'ret': 0})


async def cursor_to_rows(cursor):
    rows = []
    async for r in cursor:
        rows.append({'uuid': r['uuid'], 'name': r['name'], 'url': r['url'], 'topmost': r['topmost']})
    return rows


def request_to_row(request):
    name = request.json['name'] if 'name' in request.json else None
    url = request.json['url'] if 'url' in request.json else None
    tag = request.json['tag'] if 'tag' in request.json else None
    topmost = request.json['topmost'] if 'topmost' in request.json else 0
    return name, url, tag, topmost
