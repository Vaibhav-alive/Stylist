# AI Stylist ✨

A fun AI-powered virtual stylist that suggests outfits and lets you **virtually try them on** using your own photo.

### How It Works
1. Enter your details: gender, occasion, budget, and personal preferences.
2. The backend uses **Groq** to generate smart outfit recommendations (with description, colors, brands).
3. The outfit description is sent to **Hugging Face** to generate an image.
4. If you upload your photo, the try-on diffusion model places the suggested outfit on you while keeping your face realistic.

It works surprisingly well even on free-tier APIs!

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
Style me:
<img width="1366" height="630" alt="Elio-landing page" src="https://github.com/user-attachments/assets/a056b40b-618b-4c02-b2eb-da3153ae749c" />
<img width="1366" height="635" alt="response(style me)" src="https://github.com/user-attachments/assets/8235d97a-ed75-4c11-b20a-4c4e6ce37df8" />

Virtual Try on:
Before: 
![4c2016bb414ac55822e025ab2f2e0a33](https://github.com/user-attachments/assets/9cf2554d-6e97-4d58-b507-fb5dc6c44fb7)
After:
<img width="1366" height="633" alt="virtual-try-on" src="https://github.com/user-attachments/assets/1a386420-c2ee-4965-9a81-b358016b5908" />


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
