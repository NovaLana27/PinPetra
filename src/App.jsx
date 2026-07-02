import React, { useState, useEffect, useRef } from "react";
import {
  Home, Search, Plus, Bookmark, User, Bell, Download, Share2, Link2,
  MessageCircle, ArrowLeft, X, Check, Settings, LogOut, ChevronRight,
  Heart, Lock, Globe, MoreHorizontal, UserPlus, UserCheck, Sparkles
} from "lucide-react";

/* ---------------------------------------------------------------------
   PinPetra — design tokens
   Blush #F8D7E5 · Dusty Rose #D88CA0 · Berry #C2185B · Ivory #FFFDFB
   Display: Playfair Display (editorial serif) · Body/UI: DM Sans
   Signature: "petal-cut" asymmetric corners on every card + a pin/petal
   monogram mark, used consistently across the whole app.
--------------------------------------------------------------------- */
const C = {
  blush: "#F8D7E5",
  dusty: "#D88CA0",
  berry: "#C2185B",
  ivory: "#FFFDFB",
  ink: "#2B1B24",
  inkSoft: "#8C7482",
  line: "#F1DFE5",
  cream: "#FBF1F4",
};

const PETAL = "26px 26px 26px 6px";
const PETAL_SM = "16px 16px 16px 5px";

const CATEGORIES = [
  "Bags", "Shoes", "Loafers", "Clothes", "Hair Braids",
  "Makeup", "Flowers", "DIY Crafts", "Accessories", "Home Décor",
];

const TITLES = {
  "Bags": ["Woven straw tote", "Quilted mini bag", "Pastel crossbody", "Structured top-handle"],
  "Shoes": ["Strappy block heels", "Satin ballet flats", "Platform sandals", "Pearl-trim mules"],
  "Loafers": ["Bow-detail loafers", "Suede penny loafers", "Chunky sole loafers", "Two-tone loafers"],
  "Clothes": ["Linen co-ord set", "Puff-sleeve blouse", "Wrap midi skirt", "Cropped cardigan"],
  "Hair Braids": ["Boho fishtail braid", "Half-up milkmaid braid", "Braided low bun", "Micro box braids"],
  "Makeup": ["Dewy blush look", "Soft cut crease", "Glossy berry lip", "Sun-kissed bronze"],
  "Flowers": ["Dried pampas arrangement", "Pastel peony bouquet", "Pressed flower art", "Ranunculus centerpiece"],
  "DIY Crafts": ["Macramé wall hanging", "Hand-poured candles", "Beaded phone strap", "Painted terracotta pots"],
  "Accessories": ["Pearl hair clips", "Layered gold necklaces", "Silk hair scarf", "Tortoiseshell sunglasses"],
  "Home Décor": ["Ceramic vase edit", "Linen bedding set", "Rattan mirror", "Gallery wall moodboard"],
};

const CREATORS = ["Amara", "Lily Chen", "Noor", "Priya", "Sofia M.", "Wren", "Isla", "Maya", "Bea", "Junko"];

function seedImg(seed, w, h) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

function makePins() {
  const heights = [300, 380, 260, 420, 340, 300, 360, 260];
  let pins = [];
  let id = 1;
  CATEGORIES.forEach((cat) => {
    TITLES[cat].forEach((title, i) => {
      const h = heights[(id + i) % heights.length];
      pins.push({
        id: id,
        category: cat,
        title,
        creator: CREATORS[id % CREATORS.length],
        likes: 40 + ((id * 37) % 900),
        comments: 2 + ((id * 13) % 40),
        h,
        img: seedImg(`${cat}-${i}-${id}`, 400, h),
      });
      id++;
    });
  });
  return pins;
}
const ALL_PINS = makePins();

/* ---------------------------------------------------------------------
   Small shared bits
--------------------------------------------------------------------- */
function Logo({ size = 22, color = C.berry }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 3c6 0 10.5 4.6 10.5 10.2 0 7.4-8 14.6-9.9 16.2a.9.9 0 0 1-1.2 0C13.5 27.8 5.5 20.6 5.5 13.2 5.5 7.6 10 3 16 3z" fill={color} />
      <circle cx="16" cy="13" r="4.5" fill={C.ivory} />
    </svg>
  );
}

function Wordmark({ dark }) {
  return (
    <div className="flex items-center gap-1.5">
      <Logo />
      <span
        style={{ fontFamily: "'Playfair Display', serif", color: dark ? C.ivory : C.ink, fontStyle: "italic" }}
        className="text-xl font-semibold tracking-tight"
      >
        PinPetra
      </span>
    </div>
  );
}

function PetalButton({ children, onClick, active, className = "", style = {} }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center transition-all active:scale-95 ${className}`}
      style={{
        background: active ? C.berry : C.ivory,
        color: active ? C.ivory : C.ink,
        border: `1px solid ${active ? C.berry : C.line}`,
        borderRadius: 999,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function Avatar({ name, size = 36 }) {
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  return (
    <div
      className="flex items-center justify-center font-semibold shrink-0"
      style={{
        width: size, height: size, borderRadius: PETAL_SM,
        background: `linear-gradient(135deg, ${C.blush}, ${C.dusty})`,
        color: C.ink, fontFamily: "'DM Sans', sans-serif", fontSize: size * 0.38,
      }}
    >
      {initials}
    </div>
  );
}

function BottomNav({ screen, go }) {
  const items = [
    { key: "home", icon: Home },
    { key: "search", icon: Search },
    { key: "create", icon: Plus, isCta: true },
    { key: "boards", icon: Bookmark },
    { key: "profile", icon: User },
  ];
  return (
    <div
      className="absolute bottom-0 left-0 right-0 flex items-center justify-around px-2"
      style={{ height: 64, background: C.ivory, borderTop: `1px solid ${C.line}` }}
    >
      {items.map(({ key, icon: Icon, isCta }) =>
        isCta ? (
          <button
            key={key}
            onClick={() => go("createBoard")}
            className="flex items-center justify-center active:scale-95 transition-transform"
            style={{ width: 46, height: 46, borderRadius: PETAL, background: C.berry, color: C.ivory, marginTop: -18, boxShadow: "0 6px 14px rgba(194,24,91,0.35)" }}
          >
            <Icon size={20} />
          </button>
        ) : (
          <button key={key} onClick={() => go(key)} className="flex flex-col items-center gap-0.5 py-2 px-3">
            <Icon size={21} strokeWidth={screen === key ? 2.4 : 1.8} color={screen === key ? C.berry : C.inkSoft} />
          </button>
        )
      )}
    </div>
  );
}

function Header({ title, onBack, right }) {
  return (
    <div className="flex items-center justify-between px-4 pt-5 pb-2 shrink-0">
      {onBack ? (
        <button onClick={onBack} className="p-1 -ml-1"><ArrowLeft size={20} color={C.ink} /></button>
      ) : (
        <Wordmark />
      )}
      {title && (
        <span style={{ fontFamily: "'Playfair Display', serif", color: C.ink }} className="text-base font-medium">
          {title}
        </span>
      )}
      <div>{right}</div>
    </div>
  );
}

/* ---------------------------------------------------------------------
   Pin card (masonry) — signature petal-cut corner
--------------------------------------------------------------------- */
function PinCard({ pin, saved, onOpen, onToggleSave }) {
  return (
    <div className="mb-3 break-inside-avoid group cursor-pointer" onClick={() => onOpen(pin)}>
      <div className="relative overflow-hidden" style={{ borderRadius: PETAL }}>
        <img src={pin.img} alt={pin.title} className="w-full block" style={{ height: pin.h }} />
        <button
          onClick={(e) => { e.stopPropagation(); onToggleSave(pin.id); }}
          className="absolute top-2 right-2 flex items-center gap-1 px-3 py-1.5 text-xs font-semibold transition-all active:scale-95"
          style={{
            borderRadius: 999,
            background: saved ? C.berry : "rgba(43,27,36,0.55)",
            color: C.ivory,
            fontFamily: "'DM Sans', sans-serif",
            backdropFilter: "blur(2px)",
          }}
        >
          {saved ? "Saved" : "Save"}
        </button>
      </div>
      <p className="mt-1.5 text-sm leading-snug" style={{ color: C.ink, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
        {pin.title}
      </p>
      <p className="text-xs" style={{ color: C.inkSoft }}>{pin.creator} · {pin.category}</p>
    </div>
  );
}

function MasonryGrid({ pins, savedIds, onOpen, onToggleSave }) {
  if (pins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
        <Sparkles size={26} color={C.dusty} />
        <p className="mt-3 text-sm" style={{ color: C.inkSoft, fontFamily: "'DM Sans', sans-serif" }}>
          Nothing here yet — try another category or search term.
        </p>
      </div>
    );
  }
  return (
    <div className="px-3" style={{ columnCount: 2, columnGap: 12 }}>
      {pins.map((p) => (
        <PinCard key={p.id} pin={p} saved={savedIds.has(p.id)} onOpen={onOpen} onToggleSave={onToggleSave} />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------------
   Screens
--------------------------------------------------------------------- */
function SplashScreen({ go }) {
  useEffect(() => {
    const t = setTimeout(() => go("onboarding"), 1400);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4" style={{ background: `linear-gradient(160deg, ${C.blush}, ${C.ivory} 60%)` }}>
      <div className="animate-pulse"><Logo size={56} /></div>
      <span style={{ fontFamily: "'Playfair Display', serif", color: C.ink, fontStyle: "italic" }} className="text-3xl">
        PinPetra
      </span>
      <span style={{ color: C.inkSoft, fontFamily: "'DM Sans', sans-serif" }} className="text-xs tracking-wide uppercase">
        Your style, your inspiration
      </span>
    </div>
  );
}

function OnboardingScreen({ go }) {
  const slides = [
    { title: "Discover your aesthetic", body: "Explore bags, braids, décor and more — all curated to your taste.", cat: "Flowers" },
    { title: "Save what you love", body: "Tap once to bookmark ideas into boards you can revisit anytime.", cat: "Makeup" },
    { title: "Build your world", body: "Organize inspiration into boards and share your favorites.", cat: "Home Décor" },
  ];
  const [i, setI] = useState(0);
  const s = slides[i];
  return (
    <div className="h-full flex flex-col" style={{ background: C.ivory }}>
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <img src={seedImg(`onb-${i}`, 260, 260)} style={{ borderRadius: PETAL, width: 200, height: 200, objectFit: "cover" }} />
        <h2 className="mt-6 text-2xl" style={{ fontFamily: "'Playfair Display', serif", color: C.ink }}>{s.title}</h2>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: C.inkSoft, fontFamily: "'DM Sans', sans-serif" }}>{s.body}</p>
      </div>
      <div className="flex items-center justify-center gap-1.5 mb-5">
        {slides.map((_, idx) => (
          <div key={idx} style={{ width: idx === i ? 18 : 6, height: 6, borderRadius: 999, background: idx === i ? C.berry : C.line, transition: "all .2s" }} />
        ))}
      </div>
      <div className="flex items-center justify-between px-6 pb-8">
        <button onClick={() => go("login")} style={{ color: C.inkSoft, fontFamily: "'DM Sans', sans-serif" }} className="text-sm">Skip</button>
        <PetalButton
          onClick={() => (i < slides.length - 1 ? setI(i + 1) : go("login"))}
          style={{ padding: "10px 22px" }}
          active
        >
          <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-sm font-semibold">
            {i < slides.length - 1 ? "Next" : "Get started"}
          </span>
        </PetalButton>
      </div>
    </div>
  );
}

function LoginScreen({ go }) {
  const [mode, setMode] = useState("login");
  return (
    <div className="h-full flex flex-col px-6" style={{ background: C.ivory }}>
      <div className="flex justify-center pt-14 pb-6"><Logo size={40} /></div>
      <h1 className="text-center text-2xl mb-1" style={{ fontFamily: "'Playfair Display', serif", color: C.ink }}>
        {mode === "login" ? "Welcome back" : "Join PinPetra"}
      </h1>
      <p className="text-center text-sm mb-6" style={{ color: C.inkSoft, fontFamily: "'DM Sans', sans-serif" }}>
        {mode === "login" ? "Sign in to see your saved inspiration" : "Create an account to start saving ideas"}
      </p>
      <div className="flex flex-col gap-3">
        {mode === "signup" && (
          <input placeholder="Full name" className="text-sm px-4 py-3 outline-none" style={{ border: `1px solid ${C.line}`, borderRadius: PETAL_SM, fontFamily: "'DM Sans', sans-serif" }} />
        )}
        <input placeholder="Email address" className="text-sm px-4 py-3 outline-none" style={{ border: `1px solid ${C.line}`, borderRadius: PETAL_SM, fontFamily: "'DM Sans', sans-serif" }} />
        <input placeholder="Password" type="password" className="text-sm px-4 py-3 outline-none" style={{ border: `1px solid ${C.line}`, borderRadius: PETAL_SM, fontFamily: "'DM Sans', sans-serif" }} />
      </div>
      <button
        onClick={() => go("interests")}
        className="mt-5 py-3 text-sm font-semibold active:scale-[0.98] transition-transform"
        style={{ background: C.berry, color: C.ivory, borderRadius: 999, fontFamily: "'DM Sans', sans-serif" }}
      >
        {mode === "login" ? "Sign in" : "Create account"}
      </button>
      <p className="text-center text-xs mt-5" style={{ color: C.inkSoft, fontFamily: "'DM Sans', sans-serif" }}>
        {mode === "login" ? "New to PinPetra? " : "Already have an account? "}
        <button onClick={() => setMode(mode === "login" ? "signup" : "login")} style={{ color: C.berry, fontWeight: 600 }}>
          {mode === "login" ? "Sign up" : "Sign in"}
        </button>
      </p>
    </div>
  );
}

function InterestsScreen({ go, selected, toggle }) {
  return (
    <div className="h-full flex flex-col" style={{ background: C.ivory }}>
      <div className="px-6 pt-14 pb-2">
        <h1 className="text-2xl" style={{ fontFamily: "'Playfair Display', serif", color: C.ink }}>What inspires you?</h1>
        <p className="text-sm mt-1" style={{ color: C.inkSoft, fontFamily: "'DM Sans', sans-serif" }}>Pick at least 3 to personalize your feed.</p>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-wrap gap-2 content-start">
        {CATEGORIES.map((c) => {
          const active = selected.has(c);
          return (
            <PetalButton key={c} onClick={() => toggle(c)} active={active} style={{ padding: "10px 16px" }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-sm font-medium">{c}</span>
            </PetalButton>
          );
        })}
      </div>
      <div className="px-6 pb-8 pt-2">
        <button
          disabled={selected.size < 3}
          onClick={() => go("home")}
          className="w-full py-3 text-sm font-semibold transition-opacity"
          style={{ background: C.berry, color: C.ivory, borderRadius: 999, opacity: selected.size < 3 ? 0.4 : 1, fontFamily: "'DM Sans', sans-serif" }}
        >
          Continue ({selected.size}/3)
        </button>
      </div>
    </div>
  );
}

function HomeScreen({ go, savedIds, toggleSave, openPin, activeCat, setActiveCat }) {
  const pins = activeCat === "All" ? ALL_PINS : ALL_PINS.filter((p) => p.category === activeCat);
  return (
    <div className="h-full flex flex-col" style={{ background: C.ivory }}>
      <Header right={<button onClick={() => go("notifications")}><Bell size={20} color={C.ink} /></button>} />
      <button onClick={() => go("search")} className="mx-4 mt-2 mb-3 flex items-center gap-2 px-4 py-2.5 text-left" style={{ background: C.cream, borderRadius: 999 }}>
        <Search size={16} color={C.inkSoft} />
        <span className="text-sm" style={{ color: C.inkSoft, fontFamily: "'DM Sans', sans-serif" }}>Search ideas…</span>
      </button>
      <div className="flex gap-2 overflow-x-auto px-4 pb-3 shrink-0" style={{ scrollbarWidth: "none" }}>
        {["All", ...CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setActiveCat(c)}
            className="shrink-0 px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-all"
            style={{
              borderRadius: 999,
              background: activeCat === c ? C.berry : C.cream,
              color: activeCat === c ? C.ivory : C.ink,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto pb-4">
        <MasonryGrid pins={pins} savedIds={savedIds} onOpen={openPin} onToggleSave={toggleSave} />
      </div>
    </div>
  );
}

function SearchScreen({ savedIds, toggleSave, openPin }) {
  const [q, setQ] = useState("");
  const results = q.trim()
    ? ALL_PINS.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase()))
    : [];
  return (
    <div className="h-full flex flex-col" style={{ background: C.ivory }}>
      <div className="px-4 pt-14 pb-3">
        <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: C.cream, borderRadius: 999 }}>
          <Search size={16} color={C.inkSoft} />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search bags, braids, décor…"
            className="bg-transparent outline-none text-sm flex-1"
            style={{ color: C.ink, fontFamily: "'DM Sans', sans-serif" }}
          />
        </div>
      </div>
      {!q.trim() ? (
        <div className="px-4">
          <p className="text-xs font-semibold mb-2" style={{ color: C.inkSoft, fontFamily: "'DM Sans', sans-serif" }}>TRENDING CATEGORIES</p>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setQ(c)} className="relative overflow-hidden text-left" style={{ borderRadius: PETAL, height: 90 }}>
                <img src={seedImg(`cat-${c}`, 200, 90)} className="w-full h-full object-cover absolute inset-0" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(43,27,36,0.55), transparent 60%)" }} />
                <span className="absolute bottom-2 left-3 text-sm font-semibold" style={{ color: C.ivory, fontFamily: "'DM Sans', sans-serif" }}>{c}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <MasonryGrid pins={results} savedIds={savedIds} onOpen={openPin} onToggleSave={toggleSave} />
        </div>
      )}
    </div>
  );
}

function PostDetailScreen({ pin, go, savedIds, toggleSave, likedIds, toggleLike, following, toggleFollow, openSavePicker }) {
  if (!pin) return null;
  const saved = savedIds.has(pin.id);
  const liked = likedIds.has(pin.id);
  const isFollowing = following.has(pin.creator);
  const [copied, setCopied] = useState(false);
  const related = ALL_PINS.filter((p) => p.category === pin.category && p.id !== pin.id).slice(0, 6);
  return (
    <div className="h-full flex flex-col" style={{ background: C.ivory }}>
      <div className="flex items-center justify-between px-4 pt-5 pb-2 shrink-0">
        <button onClick={() => go("home")}><ArrowLeft size={20} color={C.ink} /></button>
        <button><MoreHorizontal size={20} color={C.ink} /></button>
      </div>
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="px-4">
          <img src={pin.img} className="w-full object-cover" style={{ borderRadius: PETAL, maxHeight: 420 }} />
        </div>
        <div className="px-4 mt-3 flex items-center gap-2">
          <button
            onClick={() => toggleLike(pin.id)}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium"
            style={{ border: `1px solid ${C.line}`, borderRadius: 999, color: liked ? C.berry : C.ink }}
          >
            <Heart size={16} fill={liked ? C.berry : "none"} color={liked ? C.berry : C.ink} /> {pin.likes + (liked ? 1 : 0)}
          </button>
          <button
            onClick={() => { navigator.clipboard?.writeText(`https://pinpetra.app/pin/${pin.id}`); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium"
            style={{ border: `1px solid ${C.line}`, borderRadius: 999, color: C.ink }}
          >
            <Link2 size={16} /> {copied ? "Copied!" : "Copy link"}
          </button>
          <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium" style={{ border: `1px solid ${C.line}`, borderRadius: 999, color: C.ink }}>
            <Download size={16} /> Save image
          </button>
          <button className="p-2" style={{ border: `1px solid ${C.line}`, borderRadius: 999 }}>
            <Share2 size={16} color={C.ink} />
          </button>
        </div>

        <div className="px-4 mt-4">
          <h2 className="text-lg" style={{ fontFamily: "'Playfair Display', serif", color: C.ink }}>{pin.title}</h2>
          <p className="text-xs mt-1" style={{ color: C.inkSoft, fontFamily: "'DM Sans', sans-serif" }}>{pin.category} · {pin.comments} comments</p>
        </div>

        <div className="px-4 mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar name={pin.creator} />
            <span className="text-sm font-medium" style={{ color: C.ink, fontFamily: "'DM Sans', sans-serif" }}>{pin.creator}</span>
          </div>
          <button
            onClick={() => toggleFollow(pin.creator)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold"
            style={{ borderRadius: 999, background: isFollowing ? C.cream : C.berry, color: isFollowing ? C.ink : C.ivory }}
          >
            {isFollowing ? <UserCheck size={13} /> : <UserPlus size={13} />} {isFollowing ? "Following" : "Follow"}
          </button>
        </div>

        <div className="px-4 mt-4">
          <button
            onClick={() => openSavePicker(pin)}
            className="w-full py-3 text-sm font-semibold"
            style={{ background: saved ? C.cream : C.berry, color: saved ? C.ink : C.ivory, borderRadius: 999, fontFamily: "'DM Sans', sans-serif" }}
          >
            {saved ? "Saved to a board" : "Save to board"}
          </button>
        </div>

        <div className="px-4 mt-5 flex items-center gap-2 py-3" style={{ borderTop: `1px solid ${C.line}` }}>
          <MessageCircle size={16} color={C.inkSoft} />
          <span className="text-sm flex-1" style={{ color: C.inkSoft, fontFamily: "'DM Sans', sans-serif" }}>Add a comment…</span>
        </div>

        <div className="px-4 mt-2">
          <p className="text-xs font-semibold mb-2" style={{ color: C.inkSoft, fontFamily: "'DM Sans', sans-serif" }}>MORE {pin.category.toUpperCase()}</p>
        </div>
        <MasonryGrid pins={related} savedIds={savedIds} onOpen={() => {}} onToggleSave={toggleSave} />
      </div>
    </div>
  );
}

function SavePickerSheet({ pin, boards, onClose, onSaveTo, onCreateNew }) {
  if (!pin) return null;
  return (
    <div className="absolute inset-0 flex items-end z-30" style={{ background: "rgba(43,27,36,0.4)" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full px-5 pt-4 pb-8" style={{ background: C.ivory, borderRadius: "22px 22px 0 0", maxHeight: "72%", overflowY: "auto" }}>
        <div className="mx-auto mb-3" style={{ width: 36, height: 4, borderRadius: 999, background: C.line }} />
        <h3 className="text-base font-semibold mb-3" style={{ fontFamily: "'DM Sans', sans-serif", color: C.ink }}>Save to board</h3>
        <button onClick={() => onCreateNew(pin)} className="w-full flex items-center gap-3 py-2.5 mb-1">
          <div className="flex items-center justify-center" style={{ width: 44, height: 44, borderRadius: PETAL_SM, background: C.cream }}>
            <Plus size={18} color={C.berry} />
          </div>
          <span className="text-sm font-medium" style={{ color: C.ink, fontFamily: "'DM Sans', sans-serif" }}>Create new board</span>
        </button>
        {boards.map((b) => (
          <button key={b.id} onClick={() => onSaveTo(b.id, pin)} className="w-full flex items-center gap-3 py-2.5">
            <img src={b.cover} style={{ width: 44, height: 44, borderRadius: PETAL_SM, objectFit: "cover" }} />
            <div className="flex-1 text-left">
              <p className="text-sm font-medium" style={{ color: C.ink, fontFamily: "'DM Sans', sans-serif" }}>{b.name}</p>
              <p className="text-xs" style={{ color: C.inkSoft }}>{b.pinIds.length} pins</p>
            </div>
            {b.pinIds.includes(pin.id) && <Check size={16} color={C.berry} />}
          </button>
        ))}
      </div>
    </div>
  );
}

function CreateBoardScreen({ go, onCreate }) {
  const [name, setName] = useState("");
  const [priv, setPriv] = useState(false);
  return (
    <div className="h-full flex flex-col px-5" style={{ background: C.ivory }}>
      <div className="flex items-center justify-between pt-5 pb-4">
        <button onClick={() => go("boards")}><X size={20} color={C.ink} /></button>
        <span className="text-sm font-semibold" style={{ fontFamily: "'DM Sans', sans-serif", color: C.ink }}>Create board</span>
        <button
          disabled={!name.trim()}
          onClick={() => { onCreate(name.trim(), priv); go("boards"); }}
          className="text-sm font-semibold"
          style={{ color: name.trim() ? C.berry : C.line }}
        >
          Create
        </button>
      </div>
      <label className="text-xs font-semibold mb-1" style={{ color: C.inkSoft, fontFamily: "'DM Sans', sans-serif" }}>BOARD NAME</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Summer Wardrobe"
        className="text-sm px-4 py-3 outline-none mb-4"
        style={{ border: `1px solid ${C.line}`, borderRadius: PETAL_SM, fontFamily: "'DM Sans', sans-serif" }}
      />
      <button onClick={() => setPriv(!priv)} className="flex items-center justify-between py-3" style={{ borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }}>
        <div className="flex items-center gap-2">
          {priv ? <Lock size={16} color={C.ink} /> : <Globe size={16} color={C.ink} />}
          <span className="text-sm" style={{ color: C.ink, fontFamily: "'DM Sans', sans-serif" }}>{priv ? "Private board" : "Public board"}</span>
        </div>
        <div style={{ width: 38, height: 22, borderRadius: 999, background: priv ? C.berry : C.line, position: "relative", transition: "all .2s" }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.ivory, position: "absolute", top: 2, left: priv ? 18 : 2, transition: "all .2s" }} />
        </div>
      </button>
    </div>
  );
}

function BoardsScreen({ boards, go, openBoard }) {
  return (
    <div className="h-full flex flex-col" style={{ background: C.ivory }}>
      <Header title="Your boards" right={<button onClick={() => go("createBoard")}><Plus size={20} color={C.ink} /></button>} />
      <div className="flex-1 overflow-y-auto px-4 pt-2 grid grid-cols-2 gap-3">
        {boards.map((b) => (
          <button key={b.id} onClick={() => openBoard(b)} className="text-left">
            <div className="grid grid-cols-2 gap-0.5 overflow-hidden" style={{ borderRadius: PETAL, height: 120 }}>
              {(b.pinIds.length ? b.pinIds : [null, null]).slice(0, 4).map((pid, idx) => {
                const p = ALL_PINS.find((x) => x.id === pid);
                return <img key={idx} src={p ? p.img : b.cover} className="w-full h-full object-cover" />;
              })}
            </div>
            <p className="mt-1.5 text-sm font-medium" style={{ color: C.ink, fontFamily: "'DM Sans', sans-serif" }}>{b.name}</p>
            <p className="text-xs flex items-center gap-1" style={{ color: C.inkSoft }}>
              {b.priv ? <Lock size={11} /> : <Globe size={11} />} {b.pinIds.length} pins
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function BoardDetailScreen({ board, go, savedIds, toggleSave, openPin }) {
  if (!board) return null;
  const pins = ALL_PINS.filter((p) => board.pinIds.includes(p.id));
  return (
    <div className="h-full flex flex-col" style={{ background: C.ivory }}>
      <Header onBack={() => go("boards")} title={board.name} />
      <p className="text-center text-xs -mt-1 mb-2" style={{ color: C.inkSoft, fontFamily: "'DM Sans', sans-serif" }}>
        {board.priv ? "Private" : "Public"} · {pins.length} pins
      </p>
      <div className="flex-1 overflow-y-auto">
        <MasonryGrid pins={pins} savedIds={savedIds} onOpen={openPin} onToggleSave={toggleSave} />
      </div>
    </div>
  );
}

function NotificationsScreen({ go, following }) {
  const notifs = [
    { icon: Heart, name: "Sofia M.", action: "liked your pin", pin: "Woven straw tote", t: "2m" },
    { icon: UserPlus, name: "Wren", action: "started following you", t: "18m" },
    { icon: MessageCircle, name: "Isla", action: "commented: \"obsessed with this!\"", t: "1h" },
    { icon: Bookmark, name: "Maya", action: "saved your pin", pin: "Boho fishtail braid", t: "3h" },
    { icon: Heart, name: "Bea", action: "liked your pin", pin: "Dewy blush look", t: "5h" },
    { icon: UserPlus, name: "Junko", action: "started following you", t: "1d" },
  ];
  return (
    <div className="h-full flex flex-col" style={{ background: C.ivory }}>
      <Header onBack={() => go("home")} title="Notifications" />
      <div className="flex-1 overflow-y-auto px-4">
        {notifs.map((n, i) => (
          <div key={i} className="flex items-center gap-3 py-3" style={{ borderBottom: `1px solid ${C.line}` }}>
            <Avatar name={n.name} />
            <div className="flex-1">
              <p className="text-sm" style={{ color: C.ink, fontFamily: "'DM Sans', sans-serif" }}>
                <span className="font-semibold">{n.name}</span> {n.action}{n.pin ? <span className="italic"> “{n.pin}”</span> : ""}
              </p>
              <p className="text-xs mt-0.5" style={{ color: C.inkSoft }}>{n.t} ago</p>
            </div>
            <div className="p-2 rounded-full" style={{ background: C.cream }}>
              <n.icon size={13} color={C.berry} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileScreen({ go, boards, savedIds, toggleSave, openPin, following }) {
  const [tab, setTab] = useState("boards");
  const savedPins = ALL_PINS.filter((p) => savedIds.has(p.id));
  return (
    <div className="h-full flex flex-col" style={{ background: C.ivory }}>
      <div className="flex items-center justify-between px-4 pt-5">
        <Wordmark />
        <button onClick={() => go("settings")}><Settings size={20} color={C.ink} /></button>
      </div>
      <div className="flex flex-col items-center pt-3 pb-4">
        <Avatar name="You" size={64} />
        <p className="mt-2 text-base font-semibold" style={{ color: C.ink, fontFamily: "'DM Sans', sans-serif" }}>Your Name</p>
        <p className="text-xs" style={{ color: C.inkSoft }}>@yourstyle</p>
        <div className="flex items-center gap-6 mt-3">
          {[["Boards", boards.length], ["Followers", 248], ["Following", following.size]].map(([label, val]) => (
            <div key={label} className="text-center">
              <p className="text-sm font-semibold" style={{ color: C.ink, fontFamily: "'DM Sans', sans-serif" }}>{val}</p>
              <p className="text-[11px]" style={{ color: C.inkSoft }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-6 mb-2" style={{ borderBottom: `1px solid ${C.line}` }}>
        {["boards", "saved"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className="pb-2 text-sm font-medium capitalize" style={{ color: tab === t ? C.berry : C.inkSoft, borderBottom: tab === t ? `2px solid ${C.berry}` : "2px solid transparent" }}>
            {t}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        {tab === "boards" ? (
          <div className="px-4 pt-2 grid grid-cols-2 gap-3">
            {boards.map((b) => (
              <div key={b.id}>
                <img src={b.pinIds.length ? ALL_PINS.find((p) => p.id === b.pinIds[0])?.img : b.cover} className="w-full object-cover" style={{ height: 100, borderRadius: PETAL }} />
                <p className="text-xs mt-1 font-medium" style={{ color: C.ink, fontFamily: "'DM Sans', sans-serif" }}>{b.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <MasonryGrid pins={savedPins} savedIds={savedIds} onOpen={openPin} onToggleSave={toggleSave} />
        )}
      </div>
    </div>
  );
}

function SettingsScreen({ go, prefs, setPrefs }) {
  const Row = ({ label, sub, keyName }) => (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: `1px solid ${C.line}` }}>
      <div>
        <p className="text-sm" style={{ color: C.ink, fontFamily: "'DM Sans', sans-serif" }}>{label}</p>
        {sub && <p className="text-xs" style={{ color: C.inkSoft }}>{sub}</p>}
      </div>
      <button onClick={() => setPrefs((p) => ({ ...p, [keyName]: !p[keyName] }))} style={{ width: 38, height: 22, borderRadius: 999, background: prefs[keyName] ? C.berry : C.line, position: "relative" }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.ivory, position: "absolute", top: 2, left: prefs[keyName] ? 18 : 2, transition: "all .2s" }} />
      </button>
    </div>
  );
  return (
    <div className="h-full flex flex-col px-5" style={{ background: C.ivory }}>
      <Header onBack={() => go("profile")} title="Settings" />
      <div className="mt-2">
        <Row label="Push notifications" sub="Likes, follows and comments" keyName="push" />
        <Row label="Private profile" sub="Only followers see your boards" keyName="privateProfile" />
        <Row label="Email updates" sub="Weekly inspiration digest" keyName="email" />
      </div>
      <button onClick={() => go("login")} className="mt-6 flex items-center gap-2 text-sm font-medium" style={{ color: C.berry, fontFamily: "'DM Sans', sans-serif" }}>
        <LogOut size={16} /> Log out
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------------
   Root app
--------------------------------------------------------------------- */
export default function PinPetraApp() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,600&family=DM+Sans:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const [screen, setScreen] = useState("splash");
  const [interests, setInterests] = useState(new Set());
  const [activeCat, setActiveCat] = useState("All");
  const [activePin, setActivePin] = useState(null);
  const [savedIds, setSavedIds] = useState(new Set());
  const [likedIds, setLikedIds] = useState(new Set());
  const [following, setFollowing] = useState(new Set());
  const [boards, setBoards] = useState([
    { id: 1, name: "Everyday Edit", priv: false, cover: seedImg("board-1", 200, 200), pinIds: [1, 5, 9] },
    { id: 2, name: "Glam Nights", priv: true, cover: seedImg("board-2", 200, 200), pinIds: [21] },
  ]);
  const [savePicker, setSavePicker] = useState(null);
  const [board, setBoard] = useState(null);
  const [prefs, setPrefs] = useState({ push: true, privateProfile: false, email: false });
  const nextBoardId = useRef(3);

  const go = (s) => setScreen(s);
  const toggleInterest = (c) => setInterests((prev) => { const n = new Set(prev); n.has(c) ? n.delete(c) : n.add(c); return n; });
  const toggleLike = (id) => setLikedIds((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleFollow = (name) => setFollowing((prev) => { const n = new Set(prev); n.has(name) ? n.delete(name) : n.add(name); return n; });

  const openPin = (pin) => { setActivePin(pin); setScreen("post"); };

  const quickToggleSave = (pinId) => {
    setSavedIds((prev) => {
      const n = new Set(prev);
      if (n.has(pinId)) { n.delete(pinId); return n; }
      n.add(pinId);
      setBoards((bs) => bs.map((b, i) => (i === 0 ? { ...b, pinIds: [...new Set([...b.pinIds, pinId])] } : b)));
      return n;
    });
  };

  const saveToBoard = (boardId, pin) => {
    setBoards((bs) => bs.map((b) => (b.id === boardId ? { ...b, pinIds: [...new Set([...b.pinIds, pin.id])] } : b)));
    setSavedIds((prev) => new Set(prev).add(pin.id));
    setSavePicker(null);
  };

  const createBoardWithPin = (pin) => {
    const name = window.prompt("Name your new board:", "New Board");
    if (!name) return;
    const nb = { id: nextBoardId.current++, name, priv: false, cover: pin.img, pinIds: [pin.id] };
    setBoards((bs) => [...bs, nb]);
    setSavedIds((prev) => new Set(prev).add(pin.id));
    setSavePicker(null);
  };

  const createBoard = (name, priv) => {
    setBoards((bs) => [...bs, { id: nextBoardId.current++, name, priv, cover: seedImg(`new-${name}`, 200, 200), pinIds: [] }]);
  };

  const openBoard = (b) => { setBoard(b); setScreen("boardDetail"); };

  let content;
  switch (screen) {
    case "splash": content = <SplashScreen go={go} />; break;
    case "onboarding": content = <OnboardingScreen go={go} />; break;
    case "login": content = <LoginScreen go={go} />; break;
    case "interests": content = <InterestsScreen go={go} selected={interests} toggle={toggleInterest} />; break;
    case "home": content = <HomeScreen go={go} savedIds={savedIds} toggleSave={quickToggleSave} openPin={openPin} activeCat={activeCat} setActiveCat={setActiveCat} />; break;
    case "search": content = <SearchScreen savedIds={savedIds} toggleSave={quickToggleSave} openPin={openPin} />; break;
    case "post": content = <PostDetailScreen pin={activePin} go={go} savedIds={savedIds} toggleSave={quickToggleSave} likedIds={likedIds} toggleLike={toggleLike} following={following} toggleFollow={toggleFollow} openSavePicker={setSavePicker} />; break;
    case "createBoard": content = <CreateBoardScreen go={go} onCreate={createBoard} />; break;
    case "boards": content = <BoardsScreen boards={boards} go={go} openBoard={openBoard} />; break;
    case "boardDetail": content = <BoardDetailScreen board={board} go={go} savedIds={savedIds} toggleSave={quickToggleSave} openPin={openPin} />; break;
    case "notifications": content = <NotificationsScreen go={go} following={following} />; break;
    case "profile": content = <ProfileScreen go={go} boards={boards} savedIds={savedIds} toggleSave={quickToggleSave} openPin={openPin} following={following} />; break;
    case "settings": content = <SettingsScreen go={go} prefs={prefs} setPrefs={setPrefs} />; break;
    default: content = null;
  }

  const showNav = ["home", "search", "boards", "profile"].includes(screen);

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-2 py-2 sm:px-4 sm:py-4" style={{ background: "linear-gradient(160deg, #F8D7E5 0%, #FFFDFB 70%)", fontFamily: "'DM Sans', sans-serif" }}>
      <div className="relative w-full overflow-hidden" style={{ maxWidth: 430, width: "min(100%, 430px)", height: "100dvh", minHeight: "min(100dvh, 920px)", background: C.ivory, boxShadow: "0 20px 60px rgba(43,27,36,0.18)", borderRadius: 32 }}>
        <div className="absolute inset-0 overflow-hidden" style={{ paddingBottom: showNav ? 64 : 0 }}>
          {content}
        </div>
        {showNav && <BottomNav screen={screen} go={go} />}
        {savePicker && (
          <SavePickerSheet pin={savePicker} boards={boards} onClose={() => setSavePicker(null)} onSaveTo={saveToBoard} onCreateNew={createBoardWithPin} />
        )}
      </div>
    </div>
  );
}
