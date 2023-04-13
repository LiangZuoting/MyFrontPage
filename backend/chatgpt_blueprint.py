import base64
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
    try:
        resp = await openai.Completion.acreate(model='text-davinci-003', prompt=question, n=1, temperature=0.6, max_tokens=3072)
    except OpenAIError as e:
        return sanic.json({'ret': 500, 'desc': e.user_message})
    answer = resp.choices[0].text
    db = request.app.ctx.db
    await db.execute(f"insert into chatgpt_history values ('{uuid.uuid4().hex}', '{base64_encode(question)}', '{base64_encode(answer)}', {time.time()})")
    await db.commit()
    return sanic.json({'ret': 200, 'answer': answer})


@gpt_bp.get('/histories/<count:int>')
async def get_histories(request, count: int):
    if count <= 0:
        count = 20
    db = request.app.ctx.db
    cursor = await db.execute(f"select * from chatgpt_history order by time desc limit {count}")
    rows = await cursor.fetchall()
    data = []
    for row in rows:
        data.append({'uuid': row['uuid'], 'question': base64_decode(row['question']), 'answer': base64_decode(row['answer']), 'time': int(row['time']*1000)})
    return sanic.json({'ret': 200, 'data': data})


def base64_encode(utf8):
    return base64.standard_b64encode(utf8.encode('utf-8')).decode('ascii')


def base64_decode(b64):
    return base64.standard_b64decode(b64).decode('utf-8')
