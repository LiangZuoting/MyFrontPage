import time
import urllib.parse
import uuid

import openai
import sanic
from openai import OpenAIError
from sanic import Blueprint

gpt_bp = Blueprint('ChatGPT', url_prefix='/chatgpt')


@gpt_bp.before_server_start
async def worker_start(app):
    await app.ctx.db.execute('create table if not exists chatgpt_history (uuid text primary key, question text, answer text, time real)')
    await app.ctx.db.commit()


@gpt_bp.get('/answer')
async def get_answer(request):
    question = request.args.get('question')
    question = urllib.parse.unquote(question)
    try:
        resp = await openai.Completion.acreate(model='text-davinci-003', prompt=question, n=1, temperature=0.6, max_tokens=3072)
    except OpenAIError as e:
        return sanic.json({'ret': 500, 'desc': e.user_message})
    answer = resp.choices[0].text
    db = request.app.ctx.db
    await db.execute(f"insert into chatgpt_history values ('{uuid.uuid4().hex}', '{question}', '{answer}', {time.time()})")
    await db.commit()
    return sanic.json({'ret': 200, 'answer': answer})


@gpt_bp.get('/histories/<count:int>')
async def get_histories(request, count: int):
    if count <= 0:
        count = 20
    db = request.app.ctx.db
    cursor = await db.execute(f"select * from chatgpt_history order by time desc limit {count}")
    rows = await cursor.fetchall()
    return sanic.json({'ret': 200, 'data': [{key: row[key] for key in row.keys()} for row in rows]})
