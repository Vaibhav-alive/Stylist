# AI Stylist ✨

A fun AI-powered virtual stylist that suggests outfits and lets you **virtually try them on** using your own photo.

### How It Works
1. Enter your details: gender, occasion, budget, and personal preferences.
2. The backend uses **Groq** to generate smart outfit recommendations (with description, colors, brands).
3. The outfit description is sent to **Hugging Face** to generate an image.
4. If you upload your photo, the try-on diffusion model places the suggested outfit on you while keeping your face realistic.

It works surprisingly well even on free-tier APIs!
Try it out now: https://stylist-navy.vercel.app/
### Features
- Personalized outfit recommendations based on occasion, budget & taste
- AI image generation of outfits
- Virtual Try-On feature (uploads your face + applies outfit)
- Full-stack app with smooth frontend-backend communication

### Tech Stack
- **Frontend**: React.js (with nice glow effects)
- **Backend**: Python + FastAPI
- **AI Services**: Groq (LLM for suggestions), Hugging Face (image generation + try-on diffusion)

### Screenshots
<img width="429" height="266" alt="Group 2" src="https://github.com/user-attachments/assets/1f8c9fcf-e962-47e6-ace7-6474e2f1dd53" />



### What I Learned
- API orchestration between multiple AI services
- Prompt engineering (one-shot prompting, negative prompts, etc.)
- How to connect React frontend with Python FastAPI backend
- Using Axios for cleaner API calls (much better than raw fetch)
- Initializing and working with Groq + Hugging Face in a real project

### How to Run Locally
```bash
# 1. Backend
cd backend
pip install -r requirements.txt
uvicorn gem:app --reload   # (or whatever your start command is)

cd AI-stylist
npm install
npm run dev
