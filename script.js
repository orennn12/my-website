// ====== EDIT BAGIAN INI SAJA ======
const CONFIG = {
  name: "Orennn12",
  logo: "img/oren.jpg",   // ganti dengan file logomu, mis. "img/logo.png" (rasio kotak, min. 200x200)
  headline: "Main sampai eos, kalau kalah ngeluh.",
  tagline: "Gameplay, review jujur, dan live stream bareng komunitas.",
  status: "Live kalau moodnya bagus.",
  nowPlaying: "Nama Game",
  progress: 35,          // persen tamat
  episode: 12,
  mainChannelUrl: "https://tiktok.com/@orennn.12",
  discordId: "834852172486934539",
  games: ["Honkai Star Rail", "Genshin Impact", "Mobile Legends"],
  // thumb: isi alamat gambar (mis. "img/ep12.jpg") atau kosongkan untuk warna otomatis
  videos: [
    { title: "Judul video terbaru", game: "Nama Game", url: "#", thumb: "" },
    { title: "Judul video kedua",   game: "Nama Game", url: "#", thumb: "" },
    { title: "Judul video ketiga",  game: "Nama Game", url: "#", thumb: "" }
  ],
  schedule: [],
  socials: [
    {label: "TikTok",   url: "https://tiktok.com/@orennn.12" },
    { label: "YouTube",  url: "https://youtube.com/@orennn12" },
    { label: "Discord",  url: "https://discord.gg/VbQNxP6VR" },
    { label: "Facebook", url: "https://facebook.com/@orennn12" }
  ]
};
// ==================================

const $ = id => document.getElementById(id);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

document.querySelectorAll("[data-bind]").forEach(n => n.textContent = CONFIG[n.dataset.bind]);
document.title = CONFIG.name + "";
$("cta-main").href = CONFIG.mainChannelUrl;
$("ep").textContent = CONFIG.episode;
$("year").textContent = new Date().getFullYear();

// ticker (diduplikasi agar berputar mulus)
const items = CONFIG.games.map(g => `<span>${esc(g)}</span><span>✦</span>`).join("");
$("ticker").innerHTML = items + items;

// video
// video
const hues = [["#ff4d8d","#6a3df0"],["#3ddcff","#6a3df0"],["#ffb23d","#ff4d8d"]];

function renderVideos(list) {
  const box = $("videos");
  box.innerHTML = "";
  list.forEach((v, i) => {
    const [c1, c2] = hues[i % hues.length];
    const a = el("a", "card");
    a.href = v.url; a.target = "_blank"; a.rel = "noopener";
    a.innerHTML = `<div class="thumb" style="--c1:${c1};--c2:${c2}">${v.thumb ? `<img src="${esc(v.thumb)}" alt="" loading="lazy">` : "▶"}</div>
      <div class="card-body"><h3>${esc(v.title)}</h3><p>${esc(v.game)}</p></div>`;
    box.appendChild(a);
  });
}

renderVideos(CONFIG.videos); // tampilan awal & cadangan kalau YouTube gagal

fetch("/api/videos")
  .then(r => r.ok ? r.json() : Promise.reject())
  .then(list => {
    if (!list.length) return;
    renderVideos(list.slice(0, 3).map(v => ({
      title: v.title,
      game: new Date(v.published).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      url: `https://www.youtube.com/watch?v=${v.id}`,
      thumb: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`
    })));
  })
  .catch(() => {});

// game & jadwal
CONFIG.games.forEach(g => $("games").appendChild(el("li", "", esc(g))));
CONFIG.schedule.forEach(s => $("schedule").appendChild(el("li", "", `<b>${esc(s.day)}</b><span>${esc(s.what)}</span><span>${esc(s.time)}</span>`)));


// logo
const logo = $("logo");
if (logo) { logo.src = CONFIG.logo; logo.onerror = () => logo.remove(); }
const fav = $("favicon");
if (fav) fav.href = CONFIG.logo;

// sosmed
CONFIG.socials.forEach((s, i) => {
  const a = el("a", "btn" + (i ? " btn-ghost" : ""), esc(s.label));
  a.href = s.url; a.target = "_blank"; a.rel = "noopener";
  $("socials")?.appendChild(a);

  const f = el("a", "", esc(s.label));
  f.href = s.url; f.target = "_blank"; f.rel = "noopener";
  $("foot-socials")?.appendChild(f);
});

// progress bar
requestAnimationFrame(() => setTimeout(() => {
  $("progress").style.width = CONFIG.progress + "%";
  $("progress-text").textContent = CONFIG.progress + "%";
}, 300));

// Game otomatis dari Discord (via Lanyard)
async function updateNowPlaying() {
  if (!CONFIG.discordId) return;
  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${CONFIG.discordId}`);
    const { success, data } = await res.json();
    if (!success) return;

    const game = data.activities.find(a => a.type === 0); // type 0 = sedang main game
    const label = document.querySelector(".now-label");
    const name = document.querySelector(".now-game");

    if (game) {
      label.textContent = "Sedang dimainkan";
      name.textContent = game.name;
    } else {
      label.textContent = "Terakhir dimainkan";
      name.textContent = CONFIG.nowPlaying;
    }

    // progress & episode hanya tampil untuk game seri yang kamu isi manual
    const showSeries = !game || game.name === CONFIG.nowPlaying;
    document.querySelector(".bar").style.display = showSeries ? "" : "none";
    document.querySelector(".now-meta").style.display = showSeries ? "" : "none";
  } catch (e) { /* kalau gagal, tampilan manual tetap dipakai */ }
}
updateNowPlaying();
setInterval(updateNowPlaying, 30000);