import os

import sanic
from sanic import Sanic, Request
from tortoise.contrib.sanic import register_tortoise

from api import api

is_prod = os.getenv("MY_FRONTPAGE_SERVER")
root_dir = os.path.dirname(os.path.abspath(__file__))

app = Sanic("MyFrontpage")
app.ctx.is_prod = is_prod
app.static("/vite.svg", f"{root_dir}/dist/vite.svg", name="vite.svg")
app.blueprint(api)

register_tortoise(app, db_url=f"sqlite://{root_dir}/db/db.sqlite3", modules={"models": ["models"]})


@app.get("/")
async def get_index(request: Request):
    passport = request.args.get("passport")
    if passport != "zhimakaimen":
        raise sanic.NotFound()
    return await sanic.file(f"{root_dir}/dist/index.html")


@app.get("/assets/<f:str>")
async def get_assets(request, f: str):
    return await sanic.file(f"{root_dir}/dist/assets/{f}", headers={"content-type": "text/javascript"} if f.endswith(".js") else None)


if __name__ == "__main__" and not is_prod:
    app.run(host="0.0.0.0", port=8000, debug=True)