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
load_dotenv()


API_KEY = os.getenv('HF_API_KEY')
client = Groq(api_key= os.getenv('GROQ_API_KEY'))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
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
    unique_lines = list(dict.fromkeys(lines))  
    l = '\n'.join(unique_lines)
    print(l)
    content_HF = f""" 
                A full body professional fashion photograph of a {gender} model, {body} build.
                The model is wearing:
                {l}
                Setting: {occasion} themed background, elegant atmosphere.
                Photography style: Vogue editorial, fashion lookbook, studio quality.
                Technical: shot on 85mm lens, soft studio lighting, 4k, sharp focus, ultra realistic.
                Model: natural standing pose, confident expression, full body visible head to toe including shoes.
                Quality: photorealistic, detailed fabric texture, professional fashion photography, high resolution.
                Negative elements to avoid: cartoon, anime, illustration, deformed, blurry, watermark, text.


    """

    API_URL = "https://router.huggingface.co/hf-inference/models/yahoooooo/sdxl-fashion"
    res = requests.post(
        API_URL,
        headers={"Authorization": f"Bearer {API_KEY}"},
        json={"inputs": content_HF,
              "parameters": {
                    "num_inference_steps": 40, 
                    "guidance_scale": 8.0 
                }
            }
    )
    print("Status:", res.status_code)

    if res.headers.get("content-type") != "image/jpeg":
        print("Error from HF:", res.json())
        return {"error": "Image generation failed"} 
    else:
        print('Saved!')
        image_base = base64.b64encode(res.content).decode('utf-8')
        return {
            'outfit': l,
            'img': image_base
        }