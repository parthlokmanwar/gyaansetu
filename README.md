# 🌉 GyaanSetu — Free Learning for Rural Students

> **SDG 4 — Quality Education for All**  
> A free, lightweight web platform where college students share micro-tutorials with rural learners across India.  
> Works on 2G. Costs nothing. Helps everyone.

---

## 🚀 Live Demo

Hosted on GitHub Pages: **[your-username.github.io/gyaansetu](https://your-username.github.io/gyaansetu)**

---

## 📌 About

GyaanSetu (ज्ञानसेतु — "Bridge of Knowledge") connects college students who want to share knowledge with rural students who need it. The platform is designed to be:

- ⚡ **Ultra-lightweight** — loads on 2G connections
- 💰 **100% Free** — no fees, no subscriptions, ever
- 📱 **Mobile-first** — works on basic Android phones
- 🌍 **SDG 4 aligned** — Quality Education for All

---

## 🎓 Features

| Feature | Description |
|---|---|
| 🏠 Home Page | Welcome banner, mission, stats, recent tutorials |
| 📚 Browse Tutorials | Grid of tutorial cards with YouTube thumbnails |
| 🔍 Live Search | Instant search by title, notes, or contributor |
| 🏷️ Category Filter | Filter by Coding / English / Maths / Digital Skills |
| ▶️ Tutorial Detail | YouTube embed + written notes + view counter |
| + Submit Tutorial | Form to add new tutorials — saves to Firebase |
| 👁 View Counter | Tracks how many times each tutorial was viewed |
| 📱 Mobile Responsive | Clean layout on any screen size |
| ℹ️ About / Mission | SDG 4 linkage, team, tech stack |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML / CSS / JavaScript | Frontend (vanilla — no frameworks needed) |
| Firebase Firestore | Real-time database (free tier) |
| GitHub Pages | Free hosting |
| YouTube Embed | Video delivery |
| Canva | Logo & design |
| Google Forms | Survey data collection |

---

## ⚙️ Setup & Deployment

### Step 1 — Fork / Clone this repo

```bash
git clone https://github.com/your-username/gyaansetu.git
cd gyaansetu
```

### Step 2 — Set up Firebase

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"** → Name it `gyaansetu`
3. Click the **`</>`** (Web) icon to register your web app
4. Copy your `firebaseConfig` object
5. Open **`js/firebase-config.js`** and replace the placeholder values:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

6. In Firebase Console → **Firestore Database** → **Create database** → Start in **test mode**

### Step 3 — Set Firestore Rules (recommended)

In Firebase Console → Firestore → Rules, paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tutorials/{doc} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

### Step 4 — Deploy to GitHub Pages

1. Push your code to GitHub:
```bash
git add .
git commit -m "Initial GyaanSetu deployment"
git push origin main
```

2. In your GitHub repo → **Settings** → **Pages**
3. Set **Source** → Deploy from a branch → `main` → `/ (root)`
4. Click **Save** — your site will be live at `https://your-username.github.io/gyaansetu`

---

## 📁 Project Structure

```
gyaansetu/
├── index.html              ← Home page
├── css/
│   └── style.css           ← All styles (Deep Blue + Green theme)
├── js/
│   ├── firebase-config.js  ← Firebase credentials (edit this!)
│   └── app.js              ← All JavaScript logic
└── pages/
    ├── browse.html         ← Browse all tutorials
    ├── submit.html         ← Submit a new tutorial
    ├── detail.html         ← Tutorial detail + video
    └── about.html          ← About & team page
```

---

## 👥 Team — SY IT 2024 Batch

| Roll No | Name | Role |
|---|---|---|
| SY24INT103 | Jishan Ansari | M1 — Project Lead |
| SY24INT115 | Uday Gaikwad | M2 — Frontend Developer |
| SY24INT134 | Prashant Jadhavar | M3 — Backend / Firebase |
| SY24INT119 | Vedant Pande | M4 — Search & Filter |
| SY24INT126 | Riyanshi | M5 — UI/UX Designer |
| SY24INT151 | Parth Lokmanwar | M6 — Content Creator |
| SY24INT155 | Vishva Jadhav | M7 — Documentation |
| SY24INT159 | Darshan Kankrale | M8 — Research & Testing |

---

## 🌍 SDG 4 Alignment

| Target | Goal | How We Address It |
|---|---|---|
| SDG 4.1 | Free Quality Education | All tutorials are 100% free |
| SDG 4.4 | Skills for Employment | Coding, English, Digital Skills |
| SDG 4.6 | Literacy & Numeracy | Maths and English grammar |
| SDG 4.7 | Sustainable Development | UPI, internet safety, life skills |

---

## 📄 License

This project is open-source and free to use for educational purposes.

---

*Built with ❤️ for SDG 4 — Quality Education for All*
