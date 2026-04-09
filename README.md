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
<img width="1200" height="500" alt="Elio-landing page" src="https://github.com/user-attachments/assets/542484de-611b-4b43-b881-9be45420dc7b" />
<img width="1200" height="500" alt="response(style me)" src="https://github.com/user-attachments/assets/353d6f25-48ff-41d4-844c-8713c8ff7fff" />
![4c2016bb414ac55822e025ab2f2e0a33](https://github.com/user-attachments/assets/026c4f0d-1aa8-45c1-af9b-5065e967fdd1)
<img width="1200" height="500" alt="virtual-try-on" src="https://github.com/user-attachments/assets/d1036e13-30c8-42a2-8bad-af0282828ce4" />
<img width="1200" height="622" alt="response" src="https://github.com/user-attachments/assets/60a810ac-72bd-4105-b032-0cef1cf9aa8d" />



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
code .env
in .env file create variables: GROQ_API_KEY = YOUR_API_KEY, HF_API_KE= your_key, RAPIDAPI_KEY= your_key
uvicorn main:app --reload   

npm install
npm run dev
