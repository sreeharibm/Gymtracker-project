/* ===========================================
   GymTracker - app.js
   Course: CSE326 Internet Programming | LPU
   Description: All JavaScript logic for GymTracker
   Tech: Pure Vanilla ES6+ - No jQuery / No Libraries
   =========================================== */

"use strict";

// -----------------------------------------------
// 1. DEFAULT DATA
// -----------------------------------------------
const initialRoutines = [
    { day: "Monday", split: "Push Day: Chest/Triceps", exercise: "Bench Press", sets: 4, reps: 10 },
    { day: "Tuesday", split: "Pull Day: Back/Biceps", exercise: "Lat Pulldown", sets: 4, reps: 10 },
    { day: "Wednesday", split: "Leg Day: Quads/Hamstrings", exercise: "Barbell Squat", sets: 4, reps: 8 },
    { day: "Friday", split: "Full Body", exercise: "Deadlift", sets: 3, reps: 6 }
];

const initialLogs = [
    { date: new Date().toISOString().split('T')[0], exercise: "Bench Press", sets: 4, reps: 10, weight: 60, unit: "kg" }
];

// Exercise catalog with target muscle tags and inline SVG illustrations
const exerciseCatalog = [
    {
        name: "Barbell Bench Press",
        muscle: "Chest",
        tagClass: "tag-chest",
        equipment: "Barbell & Flat Bench",
        tip: "Keep feet flat, retract shoulder blades, and touch lower chest.",
        svg: `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="30" y="65" width="140" height="10" rx="3" fill="#64748b"/>
            <rect x="50" y="75" width="10" height="20" fill="#94a3b8"/>
            <rect x="140" y="75" width="10" height="20" fill="#94a3b8"/>
            <circle cx="70" cy="55" r="9" fill="#f87171"/>
            <rect x="75" y="52" width="50" height="12" rx="4" fill="#ef4444"/>
            <line x1="40" y1="35" x2="160" y2="35" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/>
            <rect x="30" y="25" width="10" height="20" rx="2" fill="#3b82f6"/>
            <rect x="160" y="25" width="10" height="20" rx="2" fill="#3b82f6"/>
        </svg>`
    },
    {
        name: "Lat Pulldown",
        muscle: "Back",
        tagClass: "tag-back",
        equipment: "Cable Pulldown Machine",
        tip: "Grip wide, lean back slightly, pull bar down toward upper chest.",
        svg: `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="95" y="10" width="10" height="75" fill="#64748b"/>
            <line x1="30" y1="25" x2="170" y2="25" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/>
            <circle cx="100" cy="65" r="9" fill="#60a5fa"/>
            <path d="M 85 85 L 100 70 L 115 85" stroke="#2563eb" stroke-width="6" fill="none"/>
            <rect x="70" y="85" width="60" height="10" rx="3" fill="#94a3b8"/>
        </svg>`
    },
    {
        name: "Barbell Squat",
        muscle: "Legs",
        tagClass: "tag-legs",
        equipment: "Squat Rack & Barbell",
        tip: "Hips back, thighs parallel to floor, push through your heels.",
        svg: `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="30" r="9" fill="#34d399"/>
            <path d="M 100 40 L 100 65 L 85 85 M 100 65 L 115 85" stroke="#059669" stroke-width="6" stroke-linecap="round" fill="none"/>
            <line x1="40" y1="35" x2="160" y2="35" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/>
            <rect x="32" y="25" width="8" height="20" rx="2" fill="#10b981"/>
            <rect x="160" y="25" width="8" height="20" rx="2" fill="#10b981"/>
        </svg>`
    },
    {
        name: "Overhead Shoulder Press",
        muscle: "Shoulders",
        tagClass: "tag-shoulders",
        equipment: "Barbell / Dumbbells",
        tip: "Press vertically overhead, brace your core, do not hyperextend.",
        svg: `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="45" r="9" fill="#fbbf24"/>
            <line x1="100" y1="55" x2="100" y2="85" stroke="#d97706" stroke-width="6"/>
            <line x1="40" y1="18" x2="160" y2="18" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/>
            <rect x="32" y="10" width="8" height="16" rx="2" fill="#f59e0b"/>
            <rect x="160" y="10" width="8" height="16" rx="2" fill="#f59e0b"/>
            <path d="M 80 40 L 70 22 M 120 40 L 130 22" stroke="#d97706" stroke-width="5" stroke-linecap="round"/>
        </svg>`
    },
    {
        name: "Dumbbell Bicep Curl",
        muscle: "Arms",
        tagClass: "tag-arms",
        equipment: "Pair of Dumbbells",
        tip: "Keep elbows pinned to your sides, curl upward and squeeze.",
        svg: `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="30" r="9" fill="#a78bfa"/>
            <line x1="100" y1="40" x2="100" y2="80" stroke="#7c3aed" stroke-width="6"/>
            <rect x="65" y="45" width="12" height="20" rx="2" fill="#8b5cf6"/>
            <rect x="123" y="45" width="12" height="20" rx="2" fill="#8b5cf6"/>
            <path d="M 100 45 L 75 55 M 100 45 L 125 55" stroke="#7c3aed" stroke-width="4"/>
        </svg>`
    },
    {
        name: "Conventional Deadlift",
        muscle: "Full Body",
        tagClass: "tag-full",
        equipment: "Olympic Barbell & Bumper Plates",
        tip: "Neutral spine, bar close to shins, drive hips forward to lock out.",
        svg: `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
            <line x1="25" y1="75" x2="175" y2="75" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/>
            <circle cx="35" cy="75" r="14" fill="#ec4899"/>
            <circle cx="165" cy="75" r="14" fill="#ec4899"/>
            <circle cx="100" cy="35" r="9" fill="#f472b6"/>
            <path d="M 100 45 L 90 65 L 100 85 M 100 45 L 110 65 L 100 85" stroke="#db2777" stroke-width="5" fill="none"/>
        </svg>`
    }
];

// -----------------------------------------------
// 2. LOCALSTORAGE HELPERS (CO5 - Browser Storage)
// -----------------------------------------------
const getRoutines = () => {
    try {
        return JSON.parse(localStorage.getItem("routines")) || [...initialRoutines];
    } catch (e) {
        console.error("Failed to load routines:", e.message);
        return [...initialRoutines];
    }
};
const saveRoutines = (data) => {
    try {
        localStorage.setItem("routines", JSON.stringify(data));
    } catch (e) {
        console.error("Failed to save routines:", e.message);
    }
};
const getLogs = () => {
    try {
        return JSON.parse(localStorage.getItem("logs")) || [...initialLogs];
    } catch (e) {
        console.error("Failed to load logs:", e.message);
        return [...initialLogs];
    }
};
const saveLogs = (data) => {
    try {
        localStorage.setItem("logs", JSON.stringify(data));
    } catch (e) {
        console.error("Failed to save logs:", e.message);
    }
};

// -----------------------------------------------
// 3. TAB NAVIGATION (CO4 - DOM Manipulation)
// -----------------------------------------------
const switchTab = (tabId) => {
    document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
    document.querySelectorAll("nav button").forEach(btn => btn.classList.remove("active"));
    const target = document.getElementById(`tab-${tabId}`);
    if (target) target.classList.add("active");
    if (event && event.target && event.target.tagName === "BUTTON") {
        event.target.classList.add("active");
    }
};

// -----------------------------------------------
// 4. REGEX FORM VALIDATION (CO2, CO4)
// -----------------------------------------------
const validateInput = (input, regex) => {
    if (input.value.trim() === "") {
        input.className = "";
    } else if (regex.test(input.value.trim())) {
        input.className = "is-valid";
    } else {
        input.className = "is-invalid";
    }
};

// -----------------------------------------------
// 5. HTML5 DRAG & DROP — Routine Reordering (CO5)
// -----------------------------------------------
let dragSrcIndex = null;

const dragStart = (index) => {
    dragSrcIndex = index;
};

const dragOver = (e) => {
    e.preventDefault(); // Required to enable dropping
};

const dropOn = (targetIndex) => {
    if (dragSrcIndex === null || dragSrcIndex === targetIndex) return;
    try {
        const routines = getRoutines();
        const dragged = routines.splice(dragSrcIndex, 1)[0]; // Remove from old position
        routines.splice(targetIndex, 0, dragged);            // Insert at new position
        saveRoutines(routines);
        renderRoutines();
    } catch (err) {
        console.error("Drag & Drop reorder failed:", err.message);
    }
    dragSrcIndex = null;
};

// -----------------------------------------------
// 6. ROUTINE PLANNER (CO4 - ES6 filter, map)
// -----------------------------------------------
const renderRoutines = () => {
    const routines = getRoutines();
    const filter = document.getElementById("filterDay").value;

    // ES6 Array.prototype.filter()
    const filtered = (filter === "ALL") ? routines : routines.filter(r => r.day === filter);

    // ES6 Array.prototype.map() + Template Literals
    document.getElementById("routineTableBody").innerHTML = filtered.map((r, i) => `
        <tr draggable="true"
            ondragstart="dragStart(${routines.indexOf(r)})"
            ondragover="dragOver(event)"
            ondrop="dropOn(${routines.indexOf(r)})"
            style="cursor:grab;">
            <td>${i + 1}</td><td><b>${r.day}</b></td><td>${r.split}</td>
            <td>${r.exercise}</td><td>${r.sets}</td><td>${r.reps}</td>
            <td class="no-print"><button class="btn-danger" onclick="deleteRoutine(${routines.indexOf(r)})">Delete</button></td>
        </tr>
    `).join("");

    document.getElementById("statPlanned").textContent = routines.length;
    renderTodayPreview(routines);
};

const addRoutine = (e) => {
    e.preventDefault();
    const exercise = document.getElementById("planExercise").value.trim();

    // RegEx validation check
    if (!/^[A-Za-z0-9\s\-]{3,30}$/.test(exercise)) return alert("Invalid exercise name!");

    const routines = getRoutines();
    routines.push({
        day: document.getElementById("planDay").value,
        split: document.getElementById("planSplit").value,
        exercise,
        sets: parseInt(document.getElementById("planSets").value),
        reps: parseInt(document.getElementById("planReps").value)
    });
    saveRoutines(routines);
    renderRoutines();
    document.getElementById("routineForm").reset();
};

const deleteRoutine = (index) => {
    const routines = getRoutines();
    routines.splice(index, 1);
    saveRoutines(routines);
    renderRoutines();
};

// -----------------------------------------------
// 7. EXERCISE LOG (CO4 - ES6 map, reduce | CO5 - Storage)
// -----------------------------------------------
const renderLogs = () => {
    const logs = getLogs();

    // ES6 Array.prototype.map()
    document.getElementById("logTableBody").innerHTML = logs.map((l, i) => {
        const unit = l.unit || "kg";
        const vol = l.sets * l.reps * l.weight;
        return `
            <tr>
                <td>${i + 1}</td><td>${l.date}</td><td><b>${l.exercise}</b></td>
                <td>${l.sets}</td><td>${l.reps}</td><td>${l.weight} ${unit}</td>
                <td><b>${vol.toLocaleString()} ${unit}</b></td>
                <td class="no-print"><button class="btn-danger" onclick="deleteLog(${i})">Delete</button></td>
            </tr>
        `;
    }).join("");

    // ES6 Array.prototype.reduce() — Compute totals (normalizing to kg for summary)
    const totalVol = logs.reduce((sum, item) => {
        const wt = (item.unit === "lbs") ? (item.weight * 0.453592) : item.weight;
        return sum + (item.sets * item.reps * wt);
    }, 0);
    const totalSets = logs.reduce((sum, item) => sum + parseInt(item.sets), 0);

    document.getElementById("footTotalVolume").textContent = `~${Math.round(totalVol).toLocaleString()} kg`;
    document.getElementById("footSetsReps").textContent = `${totalSets} sets`;
    document.getElementById("statLogged").textContent = logs.length;
    document.getElementById("statVolume").textContent = `${Math.round(totalVol).toLocaleString()} kg`;
};

const addLog = (e) => {
    e.preventDefault();
    const exercise = document.getElementById("logExercise").value.trim();

    // RegEx validation check
    if (!/^[A-Za-z0-9\s\-]{3,30}$/.test(exercise)) return alert("Invalid exercise name!");

    const logs = getLogs();
    logs.unshift({
        date: document.getElementById("logDate").value,
        exercise,
        sets: parseInt(document.getElementById("logSets").value),
        reps: parseInt(document.getElementById("logReps").value),
        weight: parseFloat(document.getElementById("logWeight").value),
        unit: document.getElementById("logUnit").value
    });
    saveLogs(logs);
    renderLogs();
    document.getElementById("logExercise").value = "";
};

const deleteLog = (index) => {
    const logs = getLogs();
    logs.splice(index, 1);
    saveLogs(logs);
    renderLogs();
};

const clearLogs = () => {
    if (confirm("Clear all logs?")) {
        saveLogs([]);
        renderLogs();
    }
};

// -----------------------------------------------
// 8. REST TIMER BETWEEN SETS (with Web Audio chime)
// -----------------------------------------------
let restTimerId = null;
let restTimeRemaining = 0;

// Web Audio API synthesized audible chime (zero external audio files needed)
const playChimeSound = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        // 3-tone harmonic chime: 523Hz (C5), 659Hz (E5), 784Hz (G5)
        const notes = [523.25, 659.25, 783.99];
        notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.15);

            gain.gain.setValueAtTime(0.3, ctx.currentTime + idx * 0.15);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.15 + 0.4);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(ctx.currentTime + idx * 0.15);
            osc.stop(ctx.currentTime + idx * 0.15 + 0.45);
        });
    } catch (e) {
        console.log("Audio not supported or blocked by user gesture:", e);
    }
};

const updateRestTimerDisplay = () => {
    const display = document.getElementById("restTimerDisplay");
    const m = String(Math.floor(restTimeRemaining / 60)).padStart(2, "0");
    const s = String(restTimeRemaining % 60).padStart(2, "0");
    display.textContent = `${m}:${s}`;
};

const startRestTimer = (seconds) => {
    stopRestTimer();
    restTimeRemaining = seconds;
    const display = document.getElementById("restTimerDisplay");
    display.className = "timer-display timer-active";
    updateRestTimerDisplay();

    restTimerId = setInterval(() => {
        restTimeRemaining--;
        updateRestTimerDisplay();
        if (restTimeRemaining <= 0) {
            clearInterval(restTimerId);
            restTimerId = null;
            display.className = "timer-display timer-finished";
            playChimeSound();
        }
    }, 1000);
};

const stopRestTimer = () => {
    if (restTimerId) {
        clearInterval(restTimerId);
        restTimerId = null;
    }
    const display = document.getElementById("restTimerDisplay");
    display.className = "timer-display";
};

// -----------------------------------------------
// 9. WORKOUT STOPWATCH (setInterval & Date.now)
// -----------------------------------------------
let swElapsed = 0;
let swStartTime = null;
let swTimerId = null;
let swRunning = false;
let swLaps = [];

const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const s = String(totalSeconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
};

const getStopwatchTime = () => swRunning
    ? swElapsed + (Date.now() - swStartTime)
    : swElapsed;

const updateStopwatchDisplay = () => {
    document.getElementById("swDisplay").textContent = formatTime(getStopwatchTime());
};

const toggleStopwatch = () => {
    const btn = document.getElementById("swStartBtn");
    if (swRunning) {
        swElapsed += Date.now() - swStartTime;
        clearInterval(swTimerId);
        swTimerId = null;
        swRunning = false;
        btn.textContent = "▶ Resume";
    } else {
        swStartTime = Date.now();
        swTimerId = setInterval(updateStopwatchDisplay, 1000);
        swRunning = true;
        btn.textContent = "⏸ Pause";
    }
};

const recordLap = () => {
    const now = getStopwatchTime();
    if (now === 0) return alert("Start the stopwatch first!");
    const previous = swLaps.length > 0 ? swLaps[swLaps.length - 1].total : 0;
    swLaps.push({ split: now - previous, total: now });
    renderLaps();
};

const renderLaps = () => {
    document.getElementById("lapTableBody").innerHTML = swLaps.length === 0
        ? `<tr><td colspan="3" style="text-align:center; color:var(--text-muted);">No sets recorded yet.</td></tr>`
        : swLaps.map((lap, i) => `
            <tr>
                <td>${i + 1}</td>
                <td><b>${formatTime(lap.split)}</b></td>
                <td>${formatTime(lap.total)}</td>
            </tr>
        `).reverse().join("");
};

const resetStopwatch = () => {
    const finalTime = getStopwatchTime();
    if (finalTime > 0) {
        const totalSeconds = (parseInt(localStorage.getItem("workoutTime")) || 0) + Math.floor(finalTime / 1000);
        localStorage.setItem("workoutTime", totalSeconds);
        updateStatTime();
    }
    clearInterval(swTimerId);
    swTimerId = null;
    swRunning = false;
    swElapsed = 0;
    swStartTime = null;
    swLaps = [];
    document.getElementById("swStartBtn").textContent = "▶ Start";
    updateStopwatchDisplay();
    renderLaps();
};

const updateStatTime = () => {
    const totalSeconds = parseInt(localStorage.getItem("workoutTime")) || 0;
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    document.getElementById("statTime").textContent =
        h > 0 ? `${h}h ${m}m` : `${m}m`;
};

// -----------------------------------------------
// 10. EXERCISE CATALOG RENDERING & FILTERING
// -----------------------------------------------
const renderCatalog = (items = exerciseCatalog) => {
    const grid = document.getElementById("catalogGrid");
    grid.innerHTML = items.map(ex => `
        <article class="catalog-card">
            <div class="catalog-illustration">${ex.svg}</div>
            <div style="display:flex; justify-content:space-between; align-items:center; gap:6px;">
                <span class="catalog-title">${ex.name}</span>
                <span class="muscle-tag ${ex.tagClass}">${ex.muscle}</span>
            </div>
            <p class="catalog-desc"><strong>Equipment:</strong> ${ex.equipment}</p>
            <p class="catalog-desc"><strong>Form Tip:</strong> ${ex.tip}</p>
        </article>
    `).join("");
};

const filterCatalog = () => {
    const selected = document.getElementById("catalogFilter").value;
    const filtered = (selected === "ALL")
        ? exerciseCatalog
        : exerciseCatalog.filter(ex => ex.muscle === selected);
    renderCatalog(filtered);
};

// -----------------------------------------------
// 11. TODAY'S PREVIEW & DARK THEME TOGGLE
// -----------------------------------------------
const renderTodayPreview = (routines) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = days[new Date().getDay()];
    document.getElementById("currentDay").textContent = today;

    const todayRoutines = routines.filter(r => r.day === today);
    document.getElementById("todayRoutineBody").innerHTML = todayRoutines.length === 0
        ? `<tr><td colspan="6" style="text-align:center; color:var(--text-muted);">Rest day or no routines for ${today}.</td></tr>`
        : todayRoutines.map((r, i) => `<tr><td>${i+1}</td><td>${r.day}</td><td>${r.split}</td><td>${r.exercise}</td><td>${r.sets}</td><td>${r.reps}</td></tr>`).join("");
};

const toggleTheme = () => {
    const isDark = document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
};

// -----------------------------------------------
// 12. JSON EXPORT (CO5 - Blob API)
// -----------------------------------------------
const exportJSON = () => {
    const blob = new Blob(
        [JSON.stringify({ routines: getRoutines(), logs: getLogs(), workoutTime: localStorage.getItem("workoutTime") }, null, 2)],
        { type: "application/json" }
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "gym_data.json";
    a.click();
};

// -----------------------------------------------
// 13. PAGE INITIALIZATION
// -----------------------------------------------
window.onload = () => {
    if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark-mode");
    document.getElementById("logDate").value = new Date().toISOString().split('T')[0];
    renderRoutines();
    renderLogs();
    renderCatalog();
    updateStatTime();
    updateStopwatchDisplay();
    renderLaps();
};
