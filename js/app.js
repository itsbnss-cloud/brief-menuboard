/* ============================================================
   Jeune Designer Studio — Brief Menu Board v2
   js/app.js
   ============================================================ */

/* ---- Config ---- */
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyoCAuq0Vpu2CW-XxOWCPkSX4hlMutW1AxJB17DWPfSWI71mHyUKpikx_HU3KLvooo/exec";

/* ---- State ---- */
let cur = 0;
const D = {};

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  buildDots();
  render();
});

/* ============================================================
   DOTS
   ============================================================ */
function buildDots() {
  document.getElementById("pdots").innerHTML = STEPS.map(
    (s, i) => `
    <div class="sdot" id="d${i}" onclick="jumpTo(${i})">
      <div class="sdot-ring">${i + 1}</div>
      <div class="sdot-label">${s.label}</div>
    </div>
  `
  ).join("");
}

function updateDots() {
  const pct = cur >= STEPS.length ? 100 : (cur / (STEPS.length - 1)) * 100;
  document.getElementById("pfill").style.width = pct + "%";
  STEPS.forEach((_, i) => {
    const d = document.getElementById("d" + i);
    d.className = "sdot" + (i === cur ? " active" : i < cur ? " done" : "");
  });
}

function jumpTo(i) {
  if (i < cur) {
    cur = i;
    render();
  }
}

/* ============================================================
   RENDER
   ============================================================ */
function render() {
  updateDots();
  if (cur >= STEPS.length) {
    submitAll();
    return;
  }

  const s = STEPS[cur];
  const card = document.getElementById("card");

  let html = `<div class="step-title">${s.title}</div><div class="step-sub">${s.sub}</div>`;
  s.fields.forEach((f) => {
    html += buildField(f);
  });

  const isLast = cur === STEPS.length - 1;
  html += `
    <div class="nav">
      <button class="btn" onclick="prevStep()" ${
        cur === 0 ? "disabled" : ""
      }>← Retour</button>
      <span class="counter">${cur + 1} / ${STEPS.length}</span>
      <button class="btn btn-cta" onclick="nextStep()">${
        isLast ? "Envoyer ✓" : "Suivant →"
      }</button>
    </div>
  `;

  /* Animate out/in */
  card.style.opacity = "0";
  card.style.transform = "translateY(10px)";
  card.innerHTML = html;
  requestAnimationFrame(() => {
    card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    card.style.opacity = "1";
    card.style.transform = "translateY(0)";
  });

  restoreValues(s);
  bindAll();
}

/* ============================================================
   FIELD BUILDER
   ============================================================ */
function buildField(f) {
  const req = f.req
    ? '<span class="req"> *</span>'
    : '<span class="opt-tag">(optionnel)</span>';
  const hint = f.hint ? `<div class="hint">${f.hint}</div>` : "";

  let inp = "";

  if (f.type === "text") {
    inp = `<input type="text" id="i${f.id}" placeholder="${
      f.ph || ""
    }" autocomplete="off">`;
  } else if (f.type === "area") {
    inp = `<textarea id="i${f.id}" placeholder="${f.ph || ""}"></textarea>`;
  } else if (f.type === "chips" || f.type === "chips1") {
    const chipsHTML = f.opts
      .map(
        (o) =>
          `<div class="chip" data-c="${f.id}" data-v="${o}"><span>${o}</span></div>`
      )
      .join("");
    const autreChip = f.autre
      ? `<div class="chip chip-autre" data-c="${f.id}" data-v="__autre__"><span>✏️ Autre</span></div>`
      : "";
    const autreInput = f.autre
      ? `<div class="autre-wrap" id="aw-${f.id}">
           <input type="text" class="autre-input" id="ai-${f.id}" placeholder="Précisez…">
         </div>`
      : "";
    inp = `<div class="chips">${chipsHTML}${autreChip}</div>${autreInput}`;
  } else if (f.type === "upload") {
    inp = `
      <label class="upload">
        <input type="file" style="display:none" multiple data-fid="${f.id}"
          accept=".pdf,.png,.jpg,.jpeg,.ai,.eps,.svg,.docx,.xlsx">
        <span class="upload-icon">📎</span>
        <span class="upload-txt">Cliquez pour choisir un fichier</span>
      </label>
    `;
  }

  return `<div class="field">
    <label class="field-label">${f.label}${req}</label>
    ${inp}${hint}
  </div>`;
}

/* ============================================================
   RESTORE VALUES
   ============================================================ */
function restoreValues(step) {
  step.fields.forEach((f) => {
    if ((f.type === "chips" || f.type === "chips1") && D[f.id]) {
      const sel = Array.isArray(D[f.id]) ? D[f.id] : [D[f.id]];
      sel.forEach((v) => {
        const el = document.querySelector(`[data-c="${f.id}"][data-v="${v}"]`);
        if (el) el.classList.add("on");
      });
      /* Restaure champ autre si besoin */
      if (f.autre && D["autre_" + f.id]) {
        const aw = document.getElementById("aw-" + f.id);
        const ai = document.getElementById("ai-" + f.id);
        if (aw) aw.classList.add("visible");
        if (ai) ai.value = D["autre_" + f.id];
      }
    }
    if ((f.type === "text" || f.type === "area") && D[f.id]) {
      const el = document.getElementById("i" + f.id);
      if (el) el.value = D[f.id];
    }
  });
}

/* ============================================================
   BIND EVENTS
   ============================================================ */
function bindAll() {
  /* Chips */
  document.querySelectorAll("[data-c]").forEach((chip) => {
    chip.addEventListener("click", () => {
      const id = chip.dataset.c;
      const val = chip.dataset.v;
      const f = STEPS[cur].fields.find((x) => x.id === id);

      if (val === "__autre__") {
        chip.classList.toggle("on");
        const aw = document.getElementById("aw-" + id);
        if (aw) aw.classList.toggle("visible", chip.classList.contains("on"));
        return;
      }

      if (f.type === "chips1") {
        document
          .querySelectorAll(`[data-c="${id}"]`)
          .forEach((c) => c.classList.remove("on"));
        chip.classList.add("on");
        D[id] = val;
      } else {
        chip.classList.toggle("on");
        if (!D[id]) D[id] = [];
        if (chip.classList.contains("on")) {
          if (!D[id].includes(val)) D[id].push(val);
        } else {
          D[id] = D[id].filter((v) => v !== val);
        }
      }
    });
  });

  /* Champs "Autre" libres */
  document.querySelectorAll(".autre-input").forEach((el) => {
    const fid = el.id.replace("ai-", "");
    el.addEventListener("input", () => {
      D["autre_" + fid] = el.value;
    });
  });

  /* Texte / textarea */
  document
    .querySelectorAll('input[type="text"]:not(.autre-input), textarea')
    .forEach((el) => {
      el.addEventListener("input", () => {
        D[el.id.replace("i", "")] = el.value;
      });
    });

  /* Upload */
  document.querySelectorAll('input[type="file"]').forEach((el) => {
    el.addEventListener("change", (e) => {
      const files = Array.from(e.target.files).map((f) => f.name);
      const zone = el.closest(".upload");
      if (files.length) {
        zone.classList.add("got");
        zone.querySelector(".upload-txt").textContent = files.join(", ");
        D[el.dataset.fid] = files;
      }
    });
  });
}

/* ============================================================
   NAVIGATION
   ============================================================ */
function nextStep() {
  if (!validate()) return;
  cur++;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function prevStep() {
  if (cur > 0) {
    cur--;
    render();
  }
}

function validate() {
  for (const f of STEPS[cur].fields.filter((f) => f.req)) {
    if (f.type === "chips" || f.type === "chips1") {
      const v = D[f.id];
      if (!v || (Array.isArray(v) && !v.length)) {
        shake();
        alert(`Merci de renseigner : "${f.label}"`);
        return false;
      }
    }
    if (f.type === "text") {
      const el = document.getElementById("i" + f.id);
      if (!el || !el.value.trim()) {
        shake();
        alert(`Merci de renseigner : "${f.label}"`);
        return false;
      }
    }
  }
  return true;
}

function shake() {
  const card = document.getElementById("card");
  card.style.animation = "none";
  card.offsetHeight;
  card.style.animation = "shake 0.4s ease";
}

/* Ajouter keyframe shake dynamiquement */
const shakeStyle = document.createElement("style");
shakeStyle.textContent = `@keyframes shake {
  0%,100%{transform:translateX(0)}
  20%{transform:translateX(-6px)}
  40%{transform:translateX(6px)}
  60%{transform:translateX(-4px)}
  80%{transform:translateX(4px)}
}`;
document.head.appendChild(shakeStyle);

/* ============================================================
   SUBMIT — Sheet + Email + PDF
   ============================================================ */
async function submitAll() {
  updateDots();
  document.getElementById("card").innerHTML = `
    <div style="text-align:center;padding:3rem 1rem">
      <div style="width:50px;height:50px;border:3px solid #222;border-top-color:var(--y);
        border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 1.5rem"></div>
      <p style="color:var(--muted2);font-size:13px;font-weight:600">Envoi en cours…</p>
    </div>
  `;

  const spinStyle = document.createElement("style");
  spinStyle.textContent = `@keyframes spin{to{transform:rotate(360deg)}}`;
  document.head.appendChild(spinStyle);

  const payload = buildPayload();

  /* Envoi Sheet + Email */
  let ok = true;
  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    ok = false;
  }

  renderSuccess(ok);
}

function buildPayload() {
  /* Fusionne les valeurs "Autre" dans les champs chips */
  const merge = (id) => {
    let vals = D[id] ? (Array.isArray(D[id]) ? [...D[id]] : [D[id]]) : [];
    if (D["autre_" + id]) vals.push(D["autre_" + id]);
    return vals.join(", ");
  };

  return {
    date: new Date().toLocaleString("fr-FR"),
    nom: D.nom || "",
    type: merge("type"),
    support: merge("support"),
    nb: D.nb || "",
    logo: D.logo || "",
    charte: D.charte || "",
    couleurs: D.couleurs || "",
    menu_txt: D.menu_txt || "",
    nb_cat: D.nb_cat || "",
    ambiance: merge("ambiance"),
    priorite: merge("priorite"),
    ref: D.ref || "",
    couleurs_board: D.couleurs_board || "",
    extras: merge("extras"),
    delai: D.delai || "",
    budget: D.budget || "",
    notes: D.notes || "",
  };
}

/* ============================================================
   SUCCESS SCREEN
   ============================================================ */
function renderSuccess(ok) {
  const p = buildPayload();
  const chips = [];
  ["type", "ambiance", "delai"].forEach((k) => {
    if (p[k]) p[k].split(", ").forEach((v) => chips.push(v));
  });

  document.getElementById("card").innerHTML = `
    <div class="success">
      <div class="s-ring">${ok ? "✓" : "⚠️"}</div>
      <h2>Brief <em>${ok ? "envoyé !" : "reçu"}</em></h2>
      <p>Merci <strong style="color:var(--text)">${p.nom || ""}</strong>${
    ok
      ? " — je reviens vers vous très rapidement."
      : " — une erreur réseau est survenue, contactez-moi directement."
  }</p>
      <div>${chips.map((c) => `<span class="pill">${c}</span>`).join("")}</div>
      <div class="success-btns">
        <button class="btn btn-cta" onclick="downloadPDF()">⬇ Télécharger mon brief PDF</button>
        <button class="btn" onclick="restart()">Nouveau brief</button>
      </div>
    </div>
  `;
}

/* ============================================================
   PDF
   ============================================================ */
function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const p = buildPayload();
  const W = 210,
    H = 297;

  /* Fond */
  doc.setFillColor(8, 8, 8);
  doc.rect(0, 0, W, H, "F");

  /* Header */
  doc.setFillColor(245, 166, 35);
  doc.rect(0, 0, W, 30, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(0, 0, 0);
  doc.text("BRIEF MENU BOARD", 14, 13);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Jeune Designer Studio", 14, 21);
  doc.text(p.date, W - 14, 21, { align: "right" });

  /* Nom établissement */
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(245, 166, 35);
  doc.text(p.nom || "Sans nom", 14, 46);

  doc.setDrawColor(245, 166, 35);
  doc.setLineWidth(0.4);
  doc.line(14, 50, W - 14, 50);

  const sections = [
    {
      title: "01 — ÉTABLISSEMENT",
      rows: [
        ["Type", p.type],
        ["Support", p.support],
        ["Nb supports", p.nb],
      ],
    },
    {
      title: "02 — IDENTITÉ VISUELLE",
      rows: [
        ["Logo", p.logo],
        ["Charte", p.charte],
        ["Couleurs", p.couleurs],
      ],
    },
    {
      title: "03 — MENU",
      rows: [
        ["Nb catégories", p.nb_cat],
        ["Détail", p.menu_txt],
      ],
    },
    {
      title: "04 — DIRECTION ARTISTIQUE",
      rows: [
        ["Ambiance", p.ambiance],
        ["Priorité", p.priorite],
        ["Références", p.ref],
        ["Couleurs board", p.couleurs_board],
      ],
    },
    {
      title: "05 — DÉTAILS",
      rows: [
        ["Infos affichées", p.extras],
        ["Délai", p.delai],
        ["Budget", p.budget],
        ["Remarques", p.notes],
      ],
    },
  ];

  let y = 58;
  const colL = 14,
    colV = 72,
    maxW = W - colV - 14;

  sections.forEach((sec) => {
    doc.setFillColor(22, 22, 22);
    doc.roundedRect(12, y - 4, W - 24, 9, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(245, 166, 35);
    doc.text(sec.title, colL, y + 2);
    y += 11;

    sec.rows.forEach(([lbl, val]) => {
      if (!val) return;
      const lines = doc.splitTextToSize(val, maxW);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(lbl, colL, y);
      doc.setTextColor(240, 230, 204);
      doc.text(lines, colV, y);
      y += Math.max(7, lines.length * 5);
      doc.setDrawColor(30, 30, 30);
      doc.setLineWidth(0.2);
      doc.line(colL, y - 1, W - 14, y - 1);
    });
    y += 4;

    if (y > H - 20) {
      doc.addPage();
      doc.setFillColor(8, 8, 8);
      doc.rect(0, 0, W, H, "F");
      y = 20;
    }
  });

  /* Footer */
  doc.setFillColor(245, 166, 35);
  doc.rect(0, H - 12, W, 12, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text("JEUNE DESIGNER STUDIO", 14, H - 5);
  doc.text("Brief généré automatiquement", W - 14, H - 5, { align: "right" });

  doc.save(
    `brief-${(p.nom || "client").toLowerCase().replace(/\s+/g, "-")}.pdf`
  );
}

/* ============================================================
   RESTART
   ============================================================ */
function restart() {
  cur = 0;
  Object.keys(D).forEach((k) => delete D[k]);
  render();
}
