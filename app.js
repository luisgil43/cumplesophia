// ======= Datos del evento (YA ADAPTADO) =======
const EVENT = {
  nombre: "Sophia Gil",
  edad: 6,

  // ✅ 07-02-2026 15:00 (Chile UTC-03 normalmente en verano)
  inicioISO: "2026-02-07T15:00:00-03:00",

  fechaTxt: "Sábado 07 de Febrero 2026",
  horaTxt: "15:00",
  lugarTxt: "Lord Cochrane 347",
  direccionMaps: "Lord Cochrane 347, Santiago, Chile",

  // WhatsApp (formato internacional sin +)
  wspNumero: "56993183420",
  wspMensaje: "Hola! Confirmo asistencia al cumpleaños de Sophia 🦋💜",

  // ✅ Reseña (reemplaza “Tema mariposas...”)
  nota:
    "Hola, soy Sophia Daniela Gil González ✨ Nací en Santiago de Chile el 03 de febrero de 2020 y me encantaría invitarte a celebrar conmigo mi cumpleaños número 6. ¡Te esperamos! 🦋💜"
};

// Helpers
const $ = (id) => document.getElementById(id);

// ======= Pintar datos =======
const fechaEl = $("fechaTxt");
const horaEl = $("horaTxt");
const lugarEl = $("lugarTxt");
const notaEl = $("notaTxt");

if (fechaEl) fechaEl.textContent = EVENT.fechaTxt;
if (horaEl) horaEl.textContent = EVENT.horaTxt;
if (lugarEl) lugarEl.textContent = EVENT.lugarTxt;
if (notaEl) notaEl.textContent = EVENT.nota;

const btnMaps = $("btnMaps");
if (btnMaps) {
  btnMaps.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(EVENT.direccionMaps)}`;
}

const btnWsp = $("btnWsp");
if (btnWsp) {
  btnWsp.href = `https://wa.me/${EVENT.wspNumero}?text=${encodeURIComponent(EVENT.wspMensaje)}`;
}

// ======= Countdown =======
const elCd = $("countdown");
const target = new Date(EVENT.inicioISO).getTime();

function tick(){
  if (!elCd) return;

  const now = Date.now();
  let diff = Math.max(0, target - now);

  const d = Math.floor(diff / (1000*60*60*24));
  diff -= d * (1000*60*60*24);
  const h = Math.floor(diff / (1000*60*60));
  diff -= h * (1000*60*60);
  const m = Math.floor(diff / (1000*60));
  diff -= m * (1000*60);
  const s = Math.floor(diff / 1000);

  if (target - now <= 0) {
    elCd.textContent = "¡Hoy es el cumple! 🎉🦋";
    return;
  }
  elCd.textContent = `${d}d ${h}h ${m}m ${s}s`;
}
tick();
setInterval(tick, 1000);

// ======= Confetti (canvas arriba de todo) =======
const canvas = $("fx");
const ctx = canvas ? canvas.getContext("2d") : null;

let W = 0, H = 0;
function resize(){
  if (!canvas) return;
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

let parts = [];

function burst(n = 220){
  if (!ctx || !canvas) return;

  // desde arriba-centro para que caiga sobre el card/foto
  const x = W / 2;
  const y = Math.max(120, H * 0.12);

  for (let i = 0; i < n; i++){
    const baseVx = (Math.random() - 0.5) * 12;
    const baseVy = (Math.random() * -10) - 4;

    parts.push({
      x, y,
      vx: baseVx,
      vy: baseVy,
      g: 0.26 + Math.random() * 0.16,
      r: 3 + Math.random() * 4,
      a: 1,
      t: Math.random() * Math.PI * 2,
      hue: 260 + Math.floor(Math.random() * 35)
    });
  }
}

function draw(){
  if (!ctx || !canvas) return;

  ctx.clearRect(0, 0, W, H);

  for (const p of parts){
    p.t += 0.10;
    const flutter = Math.sin(p.t) * 0.55;

    p.vy += p.g;
    p.x += (p.vx + flutter);
    p.y += p.vy;
    p.a *= 0.992;

    ctx.globalAlpha = p.a;
    ctx.fillStyle = `hsl(${p.hue} 92% 72%)`;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
  parts = parts.filter(p => p.a > 0.05 && p.y < H + 50);
  requestAnimationFrame(draw);
}
draw();

// ✅ Confetti SOLO al abrir (una vez)
window.addEventListener("load", () => {
  burst(240);
  setTimeout(() => burst(170), 250);
});