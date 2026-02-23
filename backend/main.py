import os

from sanic import Sanic
from tortoise.contrib.sanic import register_tortoise

from api import api

is_prod = os.getenv("MY_FRONTPAGE_SERVER")

app = Sanic("MyFrontpage")
app.static("/", "dist/index.html", name="index")
app.static("/vite.svg", "dist/vite.svg", name="vite.svg")
app.static("/assets", "dist/assets", name="assets")
app.blueprint(api)

register_tortoise(app, db_url="sqlite://db/db.sqlite3", modules={"models": ["models"]}, generate_schemas=not is_prod)


if __name__ == "__main__" and not is_prod:
    app.run(host="0.0.0.0", port=8000, debug=True)