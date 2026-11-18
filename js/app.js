// 1. Default Pre-loaded Athletes Database
const DEFAULT_ATHLETES = [
  {
    id: 1,
    name: "Aarav Sharma",
    sport: "Football",
    position: "Attacking Midfielder",
    age: 18,
    height: "5'10\"",
    weight: "68 kg",
    club: "Regional Youth Academy",
    rating: 9.1,
    speed: 89,
    skill: 93,
    tactical: 90,
    stamina: 88,
    highlightStat: "Passing: 93/100"
  },
  {
    id: 2,
    name: "Marcus Vance",
    sport: "Basketball",
    position: "Point Guard",
    age: 19,
    height: "6'3\"",
    weight: "82 kg",
    club: "Metro Hoops Elite",
    rating: 8.8,
    speed: 94,
    skill: 87,
    tactical: 89,
    stamina: 91,
    highlightStat: "Vertical: 38 in"
  },
  {
    id: 3,
    name: "Rohan Deshmukh",
    sport: "Cricket",
    position: "Right-Arm Fast Bowler",
    age: 19,
    height: "6'2\"",
    weight: "79 kg",
    club: "State U-19 Pace Academy",
    rating: 9.4,
    speed: 95,
    skill: 88,
    tactical: 86,
    stamina: 90,
    highlightStat: "Top Speed: 144 km/h"
  },
  {
    id: 4,
    name: "Simranjeet Kaur",
    sport: "Athletics",
    position: "100m / 200m Sprinter",
    age: 18,
    height: "5'7\"",
    weight: "58 kg",
    club: "Punjab Track Club",
    rating: 9.0,
    speed: 96,
    skill: 85,
    tactical: 84,
    stamina: 92,
    highlightStat: "100m PB: 11.42s"
  }
];

// Default Scouting Reports
const DEFAULT_REPORTS = [
  {
    athleteId: 1,
    scout: "Coach Vikram",
    date: "2026-10-14",
    tech: 9.2,
    phys: 8.8,
    notes: "Exceptional first touch and spatial awareness in the final third. Operates smoothly under high press."
  },
  {
    athleteId: 2,
    scout: "Scout Rhea",
    date: "2026-10-18",
    tech: 8.9,
    phys: 9.1,
    notes: "Explosive first step and court vision. Needs slight improvement in contested perimeter shooting."
  },
  {
    athleteId: 3,
    scout: "Coach Manpreet",
    date: "2026-10-21",
    tech: 9.0,
    phys: 9.5,
    notes: "Consistently hits 142+ km/h with late swing. Strong yorker execution in death overs."
  }
];

// Helpers to read/write LocalStorage
function getAthletes() {
  const stored = localStorage.getItem("scouthub_athletes");
  if (!stored) {
    localStorage.setItem("scouthub_athletes", JSON.stringify(DEFAULT_ATHLETES));
    return DEFAULT_ATHLETES;
  }
  return JSON.parse(stored);
}

function getReports() {
  const stored = localStorage.getItem("scouthub_reports");
  if (!stored) {
    localStorage.setItem("scouthub_reports", JSON.stringify(DEFAULT_REPORTS));
    return DEFAULT_REPORTS;
  }
  return JSON.parse(stored);
}

function getShortlist() {
  return JSON.parse(localStorage.getItem("scouthub_shortlist") || "[1, 3]");
}

function toggleShortlist(id) {
  let list = getShortlist();
  if (list.includes(id)) {
    alert("Athlete is already in your Shortlist!");
  } else {
    list.push(id);
    localStorage.setItem("scouthub_shortlist", JSON.stringify(list));
    alert("Athlete added to Shortlist!");
    updateHomeStats();
  }
}

// 2. HOME PAGE: Live Counters & Featured Cards
function updateHomeStats() {
  const athletes = getAthletes();
  const reports = getReports();
  const shortlist = getShortlist();

  const elTotal = document.getElementById("stat-total");
  const elReports = document.getElementById("stat-reports");
  const elShortlist = document.getElementById("stat-shortlist");

  if (elTotal) elTotal.innerText = athletes.length;
  if (elReports) elReports.innerText = reports.length;
  if (elShortlist) elShortlist.innerText = shortlist.length;

  const homeGrid = document.getElementById("home-featured-grid");
  if (homeGrid) {
    homeGrid.innerHTML = athletes.slice(0, 3).map(a => `
      <article class="athlete-card">
        <div class="card-header">
          <span class="sport-badge ${a.sport.toLowerCase()}">${a.sport}</span>
          <span class="rating-badge">${a.rating} / 10</span>
        </div>
        <h3>${a.name}</h3>
        <p class="position">${a.position}</p>
        <ul class="card-stats">
          <li><strong>Age:</strong> ${a.age}</li>
          <li><strong>Speed:</strong> ${a.speed}/100</li>
          <li><strong>Key Metric:</strong> ${a.highlightStat}</li>
        </ul>
        <a href="profile.html?id=${a.id}" class="card-link">View Full Profile &rarr;</a>
      </article>
    `).join("");
  }
}

// 3. ATHLETES DIRECTORY: Filter + Add New Athlete
function initDirectoryPage() {
  const grid = document.getElementById("directory-grid");
  if (!grid) return;

  function render() {
    const search = document.getElementById("search").value.toLowerCase();
    const sport = document.getElementById("sport").value.toLowerCase();
    const minRating = parseFloat(document.getElementById("min-rating").value);
    document.getElementById("rating-label").innerText = minRating.toFixed(1) + "+";

    const filtered = getAthletes().filter(a => {
      const matchName = a.name.toLowerCase().includes(search) || a.position.toLowerCase().includes(search);
      const matchSport = sport === "all" || a.sport.toLowerCase() === sport;
      const matchRating = a.rating >= minRating;
      return matchName && matchSport && matchRating;
    });

    document.getElementById("directory-count").innerText = `Prospect Directory (${filtered.length} Available)`;

    grid.innerHTML = filtered.map(a => `
      <article class="athlete-card">
        <div class="card-header">
          <span class="sport-badge ${a.sport.toLowerCase()}">${a.sport}</span>
          <span class="rating-badge">${a.rating} / 10</span>
        </div>
        <h3>${a.name}</h3>
        <p class="position">${a.position}</p>
        <ul class="card-stats">
          <li><strong>Age:</strong> ${a.age} | <strong>Height:</strong> ${a.height}</li>
          <li><strong>Speed:</strong> ${a.speed}/100 | <strong>Skill:</strong> ${a.skill}/100</li>
          <li><strong>Highlight:</strong> ${a.highlightStat}</li>
        </ul>
        <div class="card-actions">
          <a href="profile.html?id=${a.id}" class="card-link">Full Dossier</a>
          <button type="button" class="bookmark-btn" onclick="toggleShortlist(${a.id})">+ Shortlist</button>
        </div>
      </article>
    `).join("");
  }

  document.getElementById("search").addEventListener("input", render);
  document.getElementById("sport").addEventListener("change", render);
  document.getElementById("min-rating").addEventListener("input", render);

  // Add New Athlete Form Handler
  const addForm = document.getElementById("add-athlete-form");
  if (addForm) {
    addForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const athletes = getAthletes();
      const newAthlete = {
        id: Date.now(),
        name: document.getElementById("new-name").value,
        sport: document.getElementById("new-sport").value,
        position: document.getElementById("new-pos").value,
        age: parseInt(document.getElementById("new-age").value),
        height: document.getElementById("new-height").value || "5'11\"",
        weight: "72 kg",
        club: document.getElementById("new-club").value || "Independent Prospect",
        rating: parseFloat(document.getElementById("new-rating").value),
        speed: parseInt(document.getElementById("new-speed").value),
        skill: parseInt(document.getElementById("new-skill").value),
        tactical: 85,
        stamina: 86,
        highlightStat: `Skill Score: ${document.getElementById("new-skill").value}/100`
      };
      athletes.push(newAthlete);
      localStorage.setItem("scouthub_athletes", JSON.stringify(athletes));
      addForm.reset();
      render();
      alert(`${newAthlete.name} added to the scouting database!`);
    });
  }

  render();
}

// 4. PLAYER PROFILE PAGE: Dynamic Dossier + Switcher
function initProfilePage() {
  const selector = document.getElementById("profile-switcher");
  if (!selector) return;

  const athletes = getAthletes();
  const params = new URLSearchParams(window.location.search);
  let currentId = parseInt(params.get("id")) || athletes[0].id;

  selector.innerHTML = athletes.map(a =>
    `<option value="${a.id}" ${a.id === currentId ? "selected" : ""}>${a.name} (${a.sport})</option>`
  ).join("");

  function loadAthlete(id) {
    const a = athletes.find(item => item.id === id) || athletes[0];
    document.getElementById("prof-sport").innerText = a.sport;
    document.getElementById("prof-sport").className = `sport-badge ${a.sport.toLowerCase()}`;
    document.getElementById("prof-name").innerText = a.name;
    document.getElementById("prof-pos").innerText = a.position;
    document.getElementById("prof-age").innerText = a.age;
    document.getElementById("prof-height").innerText = a.height;
    document.getElementById("prof-weight").innerText = a.weight;
    document.getElementById("prof-club").innerText = a.club;
    document.getElementById("prof-rating").innerText = `${a.rating} / 10`;

    document.getElementById("bar-speed-lbl").innerText = `Speed & Explosiveness (${a.speed}%)`;
    document.getElementById("bar-speed").style.width = `${a.speed}%`;

    document.getElementById("bar-skill-lbl").innerText = `Technical Skill (${a.skill}%)`;
    document.getElementById("bar-skill").style.width = `${a.skill}%`;

    document.getElementById("bar-tactical-lbl").innerText = `Tactical Awareness (${a.tactical}%)`;
    document.getElementById("bar-tactical").style.width = `${a.tactical}%`;

    document.getElementById("bar-stamina-lbl").innerText = `Stamina & Conditioning (${a.stamina}%)`;
    document.getElementById("bar-stamina").style.width = `${a.stamina}%`;

    document.getElementById("prof-shortlist-btn").onclick = () => toggleShortlist(a.id);

    // Load Reports for this Athlete
    const reports = getReports().filter(r => r.athleteId === a.id);
    const repContainer = document.getElementById("prof-reports-list");
    if (reports.length === 0) {
      repContainer.innerHTML = `<p style="color:#94a3b8;">No scouting reports logged yet. <a href="report.html" style="color:#38bdf8;">Add one now &rarr;</a></p>`;
    } else {
      repContainer.innerHTML = reports.map((r, idx) => `
        <details ${idx === 0 ? "open" : ""} style="margin-bottom: 1rem; background: #0f172a; padding: 1rem; border-radius: 6px; border-left: 3px solid #38bdf8;">
          <summary style="cursor: pointer; font-weight: bold; color: #38bdf8;">
            ${r.date} — Evaluated by ${r.scout} (Tech: ${r.tech}/10 | Phys: ${r.phys}/10)
          </summary>
          <p style="margin-top: 0.6rem; color: #cbd5e1;">${r.notes}</p>
        </details>
      `).join("");
    }
  }

  selector.addEventListener("change", (e) => loadAthlete(parseInt(e.target.value)));
  loadAthlete(currentId);
}

// 5. SCOUTING REPORT PAGE: Save New Report
function initReportPage() {
  const form = document.getElementById("scouting-report-form");
  if (!form) return;

  const athletes = getAthletes();
  const select = document.getElementById("player-select");
  select.innerHTML = athletes.map(a =>
    `<option value="${a.id}">${a.name} (${a.sport} - ${a.position})</option>`
  ).join("");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const athleteId = parseInt(select.value);
    const reports = getReports();

    reports.unshift({
      athleteId: athleteId,
      scout: document.getElementById("scout-name").value,
      date: document.getElementById("match-date").value || new Date().toISOString().split("T")[0],
      tech: parseFloat(document.getElementById("tech-score").value),
      phys: parseFloat(document.getElementById("phys-score").value),
      notes: document.getElementById("observations").value
    });

    localStorage.setItem("scouthub_reports", JSON.stringify(reports));
    alert("Scouting report saved! Redirecting to Player Profile...");
    window.location.href = `profile.html?id=${athleteId}`;
  });
}

// 6. COMPARE PAGE: Dynamic Head-to-Head Matrix
function initComparePage() {
  const sel1 = document.getElementById("compare-p1");
  const sel2 = document.getElementById("compare-p2");
  if (!sel1 || !sel2) return;

  const athletes = getAthletes();
  const optionsHtml = athletes.map(a => `<option value="${a.id}">${a.name} (${a.sport})</option>`).join("");
  sel1.innerHTML = optionsHtml;
  sel2.innerHTML = optionsHtml;
  if (athletes.length > 1) sel2.selectedIndex = 1;

  function renderComparison() {
    const p1 = athletes.find(a => a.id === parseInt(sel1.value));
    const p2 = athletes.find(a => a.id === parseInt(sel2.value));

    document.getElementById("th-p1").innerText = p1.name;
    document.getElementById("th-p2").innerText = p2.name;

    const badge = (v1, v2) => v1 > v2 ? `style="color:#86efac; font-weight:bold;"` : "";

    document.getElementById("compare-tbody").innerHTML = `
      <tr style="border-bottom: 1px solid #1e293b;">
        <td style="padding: 0.9rem;"><strong>Sport / Position</strong></td>
        <td style="padding: 0.9rem;">${p1.sport} (${p1.position})</td>
        <td style="padding: 0.9rem;">${p2.sport} (${p2.position})</td>
      </tr>
      <tr style="border-bottom: 1px solid #1e293b; background: rgba(255,255,255,0.02);">
        <td style="padding: 0.9rem;"><strong>Age / Height</strong></td>
        <td style="padding: 0.9rem;">${p1.age} yrs / ${p1.height}</td>
        <td style="padding: 0.9rem;">${p2.age} yrs / ${p2.height}</td>
      </tr>
      <tr style="border-bottom: 1px solid #1e293b;">
        <td style="padding: 0.9rem;"><strong>Speed & Explosiveness</strong></td>
        <td style="padding: 0.9rem;" ${badge(p1.speed, p2.speed)}>${p1.speed} / 100</td>
        <td style="padding: 0.9rem;" ${badge(p2.speed, p1.speed)}>${p2.speed} / 100</td>
      </tr>
      <tr style="border-bottom: 1px solid #1e293b; background: rgba(255,255,255,0.02);">
        <td style="padding: 0.9rem;"><strong>Technical Skill</strong></td>
        <td style="padding: 0.9rem;" ${badge(p1.skill, p2.skill)}>${p1.skill} / 100</td>
        <td style="padding: 0.9rem;" ${badge(p2.skill, p1.skill)}>${p2.skill} / 100</td>
      </tr>
      <tr style="border-bottom: 1px solid #1e293b;">
        <td style="padding: 0.9rem;"><strong>Tactical Awareness</strong></td>
        <td style="padding: 0.9rem;" ${badge(p1.tactical, p2.tactical)}>${p1.tactical} / 100</td>
        <td style="padding: 0.9rem;" ${badge(p2.tactical, p1.tactical)}>${p2.tactical} / 100</td>
      </tr>
      <tr style="border-bottom: 1px solid #1e293b; background: rgba(255,255,255,0.02);">
        <td style="padding: 0.9rem;"><strong>Stamina & Conditioning</strong></td>
        <td style="padding: 0.9rem;" ${badge(p1.stamina, p2.stamina)}>${p1.stamina} / 100</td>
        <td style="padding: 0.9rem;" ${badge(p2.stamina, p1.stamina)}>${p2.stamina} / 100</td>
      </tr>
      <tr>
        <td style="padding: 0.9rem;"><strong>Overall Scout Rating</strong></td>
        <td style="padding: 0.9rem;"><span class="rating-badge">${p1.rating} / 10</span></td>
        <td style="padding: 0.9rem;"><span class="rating-badge">${p2.rating} / 10</span></td>
      </tr>
    `;
  }

  sel1.addEventListener("change", renderComparison);
  sel2.addEventListener("change", renderComparison);
  renderComparison();
}

// 7. SHORTLIST PAGE: Dynamic Table
function initShortlistPage() {
  const tbody = document.getElementById("shortlist-tbody");
  if (!tbody) return;

  const athletes = getAthletes();
  const ids = getShortlist();
  const shortlisted = athletes.filter(a => ids.includes(a.id));

  if (shortlisted.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="padding:1rem; color:#94a3b8;">No athletes shortlisted yet. Go to Athletes Directory to add prospects.</td></tr>`;
    return;
  }

  tbody.innerHTML = shortlisted.map(a => `
    <tr style="border-bottom: 1px solid #1e293b;">
      <td style="padding: 0.9rem;"><strong>${a.name}</strong></td>
      <td style="padding: 0.9rem;"><span class="sport-badge ${a.sport.toLowerCase()}">${a.sport}</span></td>
      <td style="padding: 0.9rem;">${a.position}</td>
      <td style="padding: 0.9rem;"><strong>${a.rating} / 10</strong></td>
      <td style="padding: 0.9rem; color: #86efac; font-weight: bold;">Trial Ready</td>
      <td style="padding: 0.9rem;">
        <a href="profile.html?id=${a.id}" class="card-link" style="margin-right:10px;">Profile</a>
        <button onclick="removeFromShortlist(${a.id})" style="background:#ef4444; color:#fff; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">Remove</button>
      </td>
    </tr>
  `).join("");
}

function removeFromShortlist(id) {
  const updated = getShortlist().filter(item => item !== id);
  localStorage.setItem("scouthub_shortlist", JSON.stringify(updated));
  initShortlistPage();
}

// Initialize active page
document.addEventListener("DOMContentLoaded", () => {
  updateHomeStats();
  initDirectoryPage();
  initProfilePage();
  initReportPage();
  initComparePage();
  initShortlistPage();
});