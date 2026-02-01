# GramAI - AI for Rural India 🌾

GramAI is a modern, AI-powered rural sustainability platform designed to empower farmers and Gram Panchayats with actionable insights, weather alerts, and market intelligence in their local language (Hindi/Marathi).

## 1. System Architecture

```mermaid
graph TD
    User[Farmer / User] -->|Voice/Text (Hi/Mr)| Frontend[Next.js Frontend (Mobile First)]
    Frontend -->|API Request| Backend[Next.js API Routes / Node.js]
    Backend -->|Auth & DB| Firebase[Firebase Firestore]
    Backend -->|Intelligence| AI[Google Gemini AI Model]
    
    subgraph Cloud Infrastructure
        Backend
        Firebase
        AI
    end
    
    AI -->|Response| Backend
    Backend -->|JSON Data| Frontend
    Frontend -->|Audio/Visual| User
```

**Key Features:**
- **Scalability:** Serverless architecture (Next.js + Firebase) scales automatically.
- **Security:** Environment variables for keys, Firebase Auth (ready), Input validation.
- **Low-Bandwidth:** Minimized data transfer, offline-capable PWA potential.

---

## 2. Backend Setup Guide (Firebase)

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Click **"Add project"** and name it `gram-ai`.
3. Disable Google Analytics for simplicity (optional).

### Step 2: Enable Firestore
1. In the sidebar, go to **Build** -> **Firestore Database**.
2. Click **Create Database**.
3. Select **Production Mode**.
4. Choose a location close to users (e.g., `asia-south1` Mumbai).

### Step 3: Service Account Key
1. Go to **Project Settings** (Gear icon) -> **Service accounts**.
2. Click **Generate new private key**.
3. A JSON file will download. Open it and copy:
   - `project_id`
   - `client_email`
   - `private_key`

### Step 4: Configure Environment
Create a file named `.env.local` in the root directory:

```env
# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id-from-json
FIREBASE_CLIENT_EMAIL=your-email-from-json
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

# Google AI Studio
GOOGLE_API_KEY=your-gemini-api-key
```

---

## 3. Presentation (PPT) Content

**Slide 1: Title**
- **Title:** GramAI: AI-Powered Rural Sustainability Platform
- **Subtitle:** Empowering Farmers with Technology & Intelligence
- **Presenter:** [Your Name]

**Slide 2: Problem Statement**
- **Information Gap:** Farmers lack real-time, actionable advice.
- **Language Barrier:** Most apps are in English; farmers speak local dialects.
- **Market Volatility:** Lack of insight into mandi prices and best selling times.
- **Climate Risk:** Unpredictable weather causes crop loss.

**Slide 3: Solution Overview**
- **GramAI** is a mobile-first web app bridging the gap between technology and the field.
- **Voice-First Interface:** Speak in Hindi or Marathi.
- **AI Intelligence:** Instant answers for crop diseases, government schemes, and farming tips.
- **Hyper-Local:** Village-level weather and market data.

**Slide 4: Key Features**
- 🎙️ **AI Voice Assistant:** "Ask about tomato blight in Marathi."
- 🌾 **Smart Crop Planner:** Personalized advice based on soil and acreage.
- 💰 **Market Pulse:** Live mandi prices + income prediction.
- ⚠️ **Risk Alerts:** Early warnings for pests and weather.
- 🏛️ **Panchayat Dashboard:** Admin view for sustainability tracking.

**Slide 5: Technology Stack**
- **Frontend:** Next.js (React) - Fast & Responsive.
- **Backend:** Node.js (API Routes) - Secure & Scalable.
- **Database:** Firebase Firestore - Real-time Data.
- **AI Model:** Google Gemini - Multilingual Intelligence.

**Slide 6: System Architecture**
- *[Insert Diagram from Section 1]*
- **Flow:** User Voice -> Text -> AI Analysis -> Database Storage -> Actionable Response.

**Slide 7: Benefits**
- **For Farmers:** Increased yield, reduced input costs, better market rates.
- **For Panchayat:** Data-driven decision making, better scheme coverage.
- **For Society:** Sustainable agriculture, resource efficiency.

**Slide 8: Future Scope**
- **Offline Mode:** SMS-based queries for non-smartphone users.
- **Drone Integration:** Soil health monitoring via aerial imagery.
- **Marketplace:** Direct buying/selling of produce.

**Slide 9: Conclusion**
- GramAI is not just an app; it's a **digital companion** for the Indian farmer.
- Scalable, Secure, and Impactful.
- **Thank You!**

---

## 4. API Documentation

### POST `/api/ask`
Interacts with the AI model.
- **Body:** `{ "userId": "123", "text": "टमाटर रोग", "language": "hi-IN" }`
- **Response:** `{ "answer": "...", "queryId": "..." }`

### GET `/api/history`
Fetches user's past queries.
- **Query Param:** `?userId=123`
- **Response:** `{ "history": [...] }`

### GET `/api/analytics`
Admin stats.
- **Response:** `{ "totalQueries": 150, "popularCrops": ["Soyabean"] }`
