from groq import Groq
import requests
from PIL import Image
from io import BytesIO
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import base64
from dotenv import load_dotenv


API_KEY = os.getenv('HF_API_KEY')
client = Groq(api_key= os.getenv('GROQ_API_KEY'))

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_methods=["*"],
    allow_headers=["*"],
)

class OutfitReq(BaseModel):
    gender: str
    body_type: str
    occasion: str
    desc: str = ""

@app.post('/gen')
async def gen_output(data: OutfitReq):
    gender = data.gender
    body = data.body_type
    occasion = data.occasion
    weather = f'the very weather of {occasion}'
    content = f"""
    You are a professional fashion stylist.
    Recommend a COMPLETE outfit using real clothing items sold in stores.

    Gender: {gender}
    Occasion: {occasion}
    Weather: {weather}
    Body type: {body}
    Output format ONLY:
    Top:
    Bottom:
    Shoes:
    Accessories:
    Extra:
    """
    prompt = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
            "role": "user",
            "content" : content
            }
        ]
    )

    image_prompt = prompt.choices[0].message.content
    y = []
    x = image_prompt.split(',')
    for i in x:
        y.append(i.replace('\n', ''))
    y = ','.join(y)

    summary = client.chat.completions.create(
        model = 'llama-3.3-70b-versatile',
        messages= [
            {
                "role": "user",
                "content": f'Summarize this text {y} extract the top, bottom and other things with its colour and very specific in as low words possible and only give names of items with their bit desc in 4-5 words with their colour and their brand name for image generation'
            }
        ]
    )

    l = summary.choices[0].message.content
    lines = l.split('\n')
    unique_lines = list(dict.fromkeys(lines))  # preserves order, removes duplicates
    l = '\n'.join(unique_lines)
    print(l)
    content_HF = f""" 
    A full body editorial fashion photograph of a {gender} model with body type {body}.
    Outfit:
    {l}
    The model is standing naturally in a festive outdoor {occasion} setting with warm lights and decorations.
    Style:
    ultra realistic fashion photography, 4k, sharp focus, natural lighting, professional photoshoot, detailed fabric texture.

    The entire outfit must be visible from head to toe.
    Full body shot, head to toe, including shoes must be visible.
    Wide angle, full length portrait.
    shot on 50mm lens, professional fashion photography

    """

    API_URL = "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0"
    res = requests.post(
        API_URL,
        headers={"Authorization": f"Bearer {API_KEY}"},
        json={"inputs": content_HF}
    )
    print("Status:", res.status_code)

    if res.headers.get("content-type") != "image/jpeg":
        print("Error from HF:", res.json())
    else:
        print('Saved!')
        image_base = base64.b64encode(res.content).decode('utf-8')
        return {
            'outfit': l,
            'img': image_base
        }