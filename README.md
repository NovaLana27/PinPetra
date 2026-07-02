# PinPetra 🌸

**Your style, your inspiration.**

PinPetra is a Pinterest-inspired mobile app concept for discovering, saving, and organizing fashion and lifestyle inspiration. Designed as a polished front-end prototype, it brings together an elegant editorial aesthetic, intuitive browsing, and a seamless mobile experience for users who love curating ideas around style, beauty, home décor, and creativity.

## ✨ What this project includes

- A complete interactive user flow from splash screen to onboarding, login, interests, feed, search, and profile
- A Pinterest-style masonry feed with categories including bags, shoes, loafers, clothes, hair braids, makeup, flowers, DIY crafts, accessories, and home décor
- Save-to-board interactions, notifications, profile settings, and a refined mobile UI experience
- A feminine, minimal, modern design language built around blush pink, dusty rose, berry pink, and soft ivory tones

## 🎨 Design Direction

| Token | Value |
|---|---:|
| Primary — Blush Pink | #F8D7E5 |
| Secondary — Dusty Rose | #D88CA0 |
| Accent — Berry Pink | #C2185B |
| Background — Soft Ivory | #FFFDFB |

Typography pairs **Playfair Display** for elegant headings and the wordmark with **DM Sans** for clean, modern UI text. The interface uses a signature petal-cut card style to create a distinctive, fashion-forward feel.

## 🛠 Tech Stack

- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/) — development server and build tool
- [Tailwind CSS](https://tailwindcss.com/) — utility-first styling
- [Lucide React](https://lucide.dev/) — icon set

## ▶️ Getting Started

```bash
git clone https://github.com/NovaLana27/PinPetra.git
cd PinPetra
npm install
npm run dev
```

Then open the local Vite URL in your browser, usually http://localhost:5173.

## 📁 Project Structure

```text
pinpetra-app/
├── index.html            # HTML entry point and app mount
├── package.json           # dependencies and scripts
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind setup
├── postcss.config.js      # Tailwind/PostCSS pipeline
└── src/
    ├── App.jsx            # Main prototype UI and screens
    ├── index.css          # Tailwind directives and base styling
    └── main.jsx           # React entry point
```

## 📌 Status

This is a front-end prototype: all data such as pins, boards, likes, saves, and follows is mock/in-memory, and images are placeholder-based. There is no backend or persistence yet — the project is currently focused on demonstrating the experience, flow, and visual direction.

## 🚀 Future Direction

This prototype is ready to evolve into a full product with:

- real authentication
- backend storage for boards and saves
- image upload and media handling
- social interactions such as comments and follows
- a scalable production-ready design system

## 📄 License

MIT — feel free to fork and build on it.
