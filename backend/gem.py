from groq import Groq
import requests
from PIL import Image
from io import BytesIO
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import base64
import urllib.parse
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
    budget: str = ""
    

@app.post('/gen')
async def gen_output(data: OutfitReq):
    gender = data.gender
    body = data.body_type
    occasion = data.occasion
    desc = data.desc
    budget = data.budget
    weather = f'the very feeling of surrounding of {occasion}'
    content = f""" You are a professional fashion stylist. Generate a COMPLETE outfit using REAL clothing items available in stores.
Constraints:
- Budget: under Rs {budget}
- Gender: {gender}
- Body Type: {body}
- Occasion: {occasion}
- Desc of clothes: {desc} 
STRICT RULES:
- Output ONLY in this exact format
- No extra text, no explanations
FORMAT:
Top: <item name>, <color>, <brand>
Bottom: <item name>, <color>, <brand>
Shoes: <item name>, <color>, <brand>
Accessories: <item>, <color>, <brand>
Extra: <optional item>
Keep descriptions short and realistic.
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
    lines = image_prompt.split('\n')
    clean = [l.strip() for l in lines if ':' in l]
    l = '\n'.join(clean)
   
    content_HF = f""" 
                 high-end fashion photoshoot of a {gender} model with a {body} body type.
                Outfit:
                {l}
                Scene: {occasion} setting, realistic environment.
                Style: luxury fashion editorial, Vogue magazine, minimal background.
                Ensure all clothing items match in style and color coordination.
                Lighting: soft studio lighting, cinematic shadows.
                Camera: 85mm lens, full body shot, sharp focus.
                Quality: ultra realistic, 4k, highly detailed fabric textures.
                Negative prompt: cartoon, anime, blurry, distorted body, bad anatomy, watermark, text.
                """

    API_URL = "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0"
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

    content_type = res.headers.get("content-type", "")
    if not content_type.startswith("image/"):
        error_detail = res.text
        print("HF Error:", error_detail)  
        return {"error": "Image generation failed", "details": error_detail}
    else:
        print('Saved!')
        image_base = base64.b64encode(res.content).decode('utf-8')
        return {
            'outfit': l,
            'img': f'data:{content_type};base64,{image_base}'
        }
@app.post('/try')
async def tryon(
    avatar_image:   UploadFile = File(...),
    gender:   str = Form(...),
    body:     str = Form(...),
    occasion: str = Form(...),
    desc:     str = Form(""),
    budget:   str = Form(""),
):
    content = f""" You are a professional fashion stylist. Generate a COMPLETE outfit using REAL clothing items available in stores.
Constraints:
- Budget: under Rs {budget}
- Gender: {gender}
- Body Type: {body}
- Occasion: {occasion}
- Desc of clothes: {desc} 
STRICT RULES:
- Output ONLY in this exact format
- No extra text, no explanations
FORMAT:
Top: <item name>, <color>, <brand>
Bottom: <item name>, <color>, <brand>
Shoes: <item name>, <color>, <brand>
Accessories: <item>, <color>, <brand>
Extra: <optional item>
Keep descriptions short and realistic.
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
    lines = image_prompt.split('\n')
    clean = [l.strip() for l in lines if ':' in l]
    l = '\n'.join(clean)
   
    content_HF = f""" 
                 high-end fashion photoshoot of a {gender} model with a {body} body type.
                Outfit:
                {l}
                Scene: {occasion} setting, realistic environment.
                Style: luxury fashion editorial, Vogue magazine, minimal background.
                Ensure all clothing items match in style and color coordination.
                Lighting: soft studio lighting, cinematic shadows.
                Camera: 85mm lens, full body shot, sharp focus.
                Quality: ultra realistic, 4k, highly detailed fabric textures.
                Negative prompt: cartoon, anime, blurry, distorted body, bad anatomy, watermark, text.
                """

    headers = {
        'x-rapidapi-key': os.getenv('RAPIDAPI_KEY'),
        "x-rapidapi-host": "try-on-diffusion.p.rapidapi.com"
    }

    files = {
        "avatar_image": (avatar_image.filename, await avatar_image.read(), avatar_image.content_type) 
    }

    data = {
        "avatar_sex": f'{gender.lower()}',
        "clothing_prompt": f"{l}",
    }

    res = requests.post(
        "https://try-on-diffusion.p.rapidapi.com/try-on-file",
        headers = headers,
        files = files,
        data = data
    )

    content_type = res.headers.get("content-type", "")
    if not content_type.startswith("image/"):
        error_detail = res.text
        print("Try-on Error:", error_detail)
        return {"error": "Try-on image generation failed", "details": error_detail}

    img_base = base64.b64encode(res.content).decode('utf-8')
    return {
        'outfit': l,
        'img': f"data:{content_type};base64,{img_base}"
    }
