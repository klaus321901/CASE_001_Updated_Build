/* =========================================================
   CASE 001 — THE MISSING RESUME
   Main JavaScript File
   ========================================================= */


/* =========================================================
   1. GLOBAL VARIABLES
   ========================================================= */

const $ = id => document.getElementById(id);

const scenes = ['intro', 'scan', 'corridorPreview', 'board'];

let investigator = 'Investigator';
let visited = new Set();
let currentCase = 0;
let scanTimer = null;


/* =========================================================
   2. PROJECT DATA
   ========================================================= */

const files = [
    {
        title: 'THE VANISHING EVENT',
        real: 'Campus Connect',
        icon: '◈',

        tags: [
            'FastAPI',
            'PostgreSQL',
            'Selenium',
            'PaddleOCR',
            'Whisper',
            'Gemini'
        ],

        question: 'An event was announced. Its details are scattered across a poster, a caption, and a Reel. How do you recover the missing information?',

        problem: 'A campus club posts an announcement without a clean event record. Dates, locations and registration links might live in completely different formats.',

        choices: [
            'Read only the caption',
            'Combine the poster, caption, QR code and Reel audio',
            'Wait for someone to enter everything manually'
        ],

        solution: 'Sana built a campus event platform and an Instagram ingestion pipeline that collects posts and Reels using Selenium; preprocesses posters with OpenCV and extracts text using PaddleOCR; decodes QR links; transcribes Reel audio using Whisper; and uses regex and Gemini to refine structured event information.',

        detail: 'The platform connects FastAPI, SQLAlchemy and PostgreSQL to an HTML/CSS/JavaScript frontend with event discovery, feedback, recommendations and admin management.'
    },

    {
        title: 'THE FABRICATED TRUTH',
        real: 'Fake News Detection System',
        icon: '⌁',

        tags: [
            'Angular',
            'FastAPI',
            'SerpAPI',
            'Gemini',
            'Pydantic'
        ],

        question: 'Two statements sound equally convincing. How can we determine which is supported by evidence?',

        problem: 'Language alone can make an inaccurate claim sound plausible. The investigator needs external evidence, not just a persuasive tone.',

        choices: [
            'Judge the writing style',
            'Retrieve evidence and evaluate the claim',
            'Assume the most repeated claim is true'
        ],

        solution: 'Sana developed an Angular and FastAPI fact-checking application. FastAPI preprocesses a claim, retrieves search evidence via SerpAPI, and passes relevant context to Gemini for a structured verdict, reasoning, evidence and warnings.',

        detail: 'The interface displays REAL, FAKE or UNKNOWN results, and handles uncertain or unsuccessful requests. This is evidence-assisted assessment, not an independent guarantee of factual truth.'
    },

    {
        title: 'THE RESEARCH TRAIL',
        real: 'PubMed Fetch Research Papers',
        icon: '✳',

        tags: [
            'Python',
            'PubMed API',
            'XML',
            'ElementTree',
            'CSV'
        ],

        question: 'A biomedical research trail contains thousands of records. Which papers might be connected to industry research?',

        problem: 'Research metadata is spread across many publications. Manually reviewing titles and author details is repetitive.',

        choices: [
            'Search by topic and filter retrieved metadata',
            'Guess from article titles alone',
            'Download every paper by hand'
        ],

        solution: 'Sana wrote a Python research-retrieval workflow using PubMed ESearch to obtain identifiers and ESummary to retrieve publication metadata, parsing XML with ElementTree and exporting filtered results to CSV.',

        detail: 'The project uses keyword-based heuristics to identify potentially pharmaceutical- or biotechnology-associated records; this is an initial filter, not definitive affiliation verification.'
    },

    {
        title: 'THE FLIGHT ANOMALY',
        real: 'European Flight Monitoring System',
        icon: '⌁',

        tags: [
            'Python',
            'AviationStack',
            'SQLite',
            'SQL',
            'Analytics'
        ],

        question: 'A flight status changes after arrival, but the database already has an earlier record. What should happen?',

        problem: 'Flight API updates must not create duplicates or damage relationships between airports and flights.',

        choices: [
            'Append duplicates forever',
            'Normalize, upsert, then analyze delays',
            'Ignore any subsequent update'
        ],

        solution: 'Sana built a Python flight-data processing pipeline using the AviationStack API, JSON normalization, SQLite tables for airports and flights, foreign keys, uniqueness constraints and upsert operations.',

        detail: 'SQL aggregation calculates departure delays and airline-level statistics. The project includes transaction management, indexes and automated persistence tests.'
    },

    {
        title: 'THE ALTERED CANVAS',
        real: 'Swift Style — Neural Style Transfer',
        icon: '▧',

        tags: [
            'Deep Learning',
            'CNN',
            'PyTorch',
            'Perceptual Loss',
            'Computer Vision'
        ],

        question: 'Can a photograph adopt the visual texture of a painting without losing its recognizable content?',

        problem: 'Iterative neural style transfer can be computationally expensive for every image.',

        choices: [
            'Train a feed-forward style transformation network',
            'Randomly recolor all pixels',
            'Blur the image'
        ],

        solution: 'Sana implemented and adapted a fast neural style transfer approach based on Johnson et al. The design uses a feed-forward convolutional transformation network and perceptual content/style losses from pretrained visual features.',

        detail: 'Her documented work includes adapting the workflow to a Windows development environment. This exhibit explains the architecture; it does not pretend to run the original trained model in the browser.'
    },

    {
        title: 'THE IDENTITY PROTOCOL',
        real: 'Face Recognition & Authentication System — ReadyPod Technologies Internship',
        icon: '◎',

        tags: [
            'ReadyPod Internship',
            'RetinaFace',
            'FaceNet',
            'DeepFace',
            'FastAPI'
        ],

        question: 'A photo contains several faces. Which people are registered, and who should remain unknown?',

        problem: 'A reliable demonstration must detect multiple faces, derive comparable features, and avoid treating a weak similarity as an authenticated identity.',

        choices: [
            'Recognize every face unconditionally',
            'Compare embeddings and apply a threshold',
            'Compare only image filenames'
        ],

        solution: 'During her software engineering internship at ReadyPod Technologies, Sana built a FastAPI-based facial recognition application integrating RetinaFace detection, FaceNet embeddings, cosine-distance comparisons and threshold-based recognition decisions.',

        detail: 'The application supports multiple faces in uploaded images, employee reference photographs, bounding-box annotations and access-granted or access-denied results. This is her internship project.'
    }
];


/* =========================================================
   3. SCENE NAVIGATION
   ========================================================= */


function showScene(id) {
    scenes.forEach(s => $('' + s).classList.toggle('active', s === id));

    window.scrollTo({
        top: 0,
        behavior: 'instant'
    });
}


/* =========================================================
   4. NOTIFICATION SYSTEM
   ========================================================= */

function toast(message) {
    const t = $('toast');

    t.textContent = message;
    t.classList.add('visible');

    // Keep notifications visible for 5 seconds.
setTimeout(() => t.classList.remove('visible'), 4000);
}


/* =========================================================
   5. INVESTIGATION PROGRESS
   ========================================================= */

function updateProgress() {
    const count = visited.size;

    $('completionText').textContent = `${count} / 6 FILES EXAMINED`;

    $('verdictCount').textContent = count;

    $('boardMessage').textContent = count === 6
        ? 'ALL EVIDENCE RECOVERED. THE BUREAU AWAITS YOUR VERDICT.'
        : `${count} FILE${count === 1 ? '' : 'S'} REVIEWED. ${6 - count} REMAIN.`;

    document.querySelectorAll('.evidence').forEach(el =>
        el.classList.toggle('visited', visited.has(Number(el.dataset.case)))
    );
}


/* =========================================================
   6. ENTER THE EVIDENCE BOARD
   ========================================================= */


function enterBoard() {
    clearTimeout(scanTimer);

    $('assignedName').textContent = investigator.toUpperCase();

    showScene('corridorPreview');

    updateProgress();
}



/* =========================================================
   7. INVESTIGATOR IDENTITY SCAN
   ========================================================= */

function startScan(name) {
    investigator = (name || 'Investigator').trim().slice(0, 34);

    $('scanName').textContent = investigator.toUpperCase();
    $('badgeName').textContent = investigator;
        // Never let two scans run at once (e.g. when starting again from Home).
    clearTimeout(scanTimer);

    // Restart the progress bar from 0%. Reading offsetWidth forces the
    // browser to register 0% first, so the bar animates again.
    $('scanProgress').style.width = '0%';
    void $('scanProgress').offsetWidth;

    $('scanLog').textContent = '';

    $('clearanceBadge').classList.remove('visible');

    // Hide the Proceed button until clearance is granted again.
    $('proceedScan').hidden = true;

    showScene('scan');

    requestAnimationFrame(() => {
        $('scanProgress').style.width = '100%';
    });

    const lines = [
        'SCANNING BUREAU RECORDS...',
        'NO PREVIOUS INVESTIGATIONS FOUND. SUSPICIOUS.',
        'CLEARANCE GRANTED. WELCOME, INVESTIGATOR.'
    ];

    let i = 0;

    const step = () => {
        if (i < lines.length) {
            const p = document.createElement('div');

            p.textContent = '> ' + lines[i++];

            $('scanLog').appendChild(p);

            scanTimer = setTimeout(step, 1800);
        } else {
            $('clearanceBadge').classList.add('visible');

            // Keep the clearance badge visible until the investigator continues.
            $('proceedScan').hidden = false;
        }
    };

    scanTimer = setTimeout(step, 300);
}


/* =========================================================
   8. HOMEPAGE BUTTON EVENTS
   ========================================================= */

// Begin investigation
$('nameForm').addEventListener('submit', e => {
    e.preventDefault();

    startScan($('investigatorName').value);
});

// Skip introduction
$('skipBtn').addEventListener('click', () => {
    investigator = $('investigatorName').value.trim() || 'Anonymous';

    enterBoard();

    toast('The Bureau acknowledges your suffering. Reluctantly.');
});

// Skip verification animation
// Open the detective corridor when the investigator chooses to continue.
$('proceedScan').addEventListener('click', enterBoard);

// Return to homepage
$('homeBtn').addEventListener('click', () => showScene('intro'));
// Toggle ambient motion
$('motionBtn').addEventListener('click', () => {
    let off = document.body.classList.toggle('motion-off');

    $('motionBtn').textContent = off
        ? 'MOTION: OFF'
        : 'MOTION: ON';

    document.querySelector('.rain').style.animationPlayState = off
        ? 'paused'
        : 'running';
});


/* =========================================================
   9. THREE IMPOSSIBLE ROOMS — PROJECT MAPPING
   =========================================================
   
   Room 01 → Face Recognition      → files[5]
   Room 02 → Campus Connect        → files[0]
   Room 03 → Fake News Detection   → files[1]

   We preserve the original six-project data.
   This mapping will be used when connecting the rooms.
   ========================================================= */

const mainRoomProjects = [5, 0, 1];


/* =========================================================
   10. OPEN PROJECT CASE
   ========================================================= */

function openCase(i) {
    currentCase = i;

    const f = files[i];

    $('modalNumber').textContent =
        `EVIDENCE FILE ${String(i + 1).padStart(2, '0')} / 06`;

    $('modalTitle').textContent = f.title;
    $('modalReal').textContent = f.real;
    $('modalVisual').textContent = f.icon;
    $('modalQuestion').textContent = f.question;
    $('modalProblem').textContent = f.problem;
    $('modalSolution').textContent = f.solution;
    $('modalDetail').textContent = f.detail;

    // Create technology tags
    $('modalTags').replaceChildren(
        ...f.tags.map(tag => {
            let e = document.createElement('span');
            e.textContent = tag;
            return e;
        })
    );

    // Clear previous interaction
    $('modalInteraction').replaceChildren();

    const instruction = document.createElement('div');

    instruction.textContent = 'WHAT WOULD YOU INVESTIGATE FIRST?';
    instruction.style.marginBottom = '10px';

    $('modalInteraction').appendChild(instruction);

    // Create mystery choices
    f.choices.forEach((choice, choiceIndex) => {
        const b = document.createElement('button');

        b.textContent = choice;

        b.addEventListener('click', () => {
            document.querySelectorAll('#modalInteraction button')
                .forEach(n => n.classList.remove('chosen'));

            b.classList.add('chosen');

            toast(
                choiceIndex === 1 ||
                (i === 2 && choiceIndex === 0) ||
                (i === 4 && choiceIndex === 0)
                    ? 'ANALYSIS RECORDED // OPEN THE TECHNICAL FILE'
                    : 'HYPOTHESIS RECORDED // REVIEW THE EVIDENCE'
            );
        });

        $('modalInteraction').appendChild(b);
    });

    // Reset technical reveal
    $('modalReveal').hidden = true;
    $('revealBtn').hidden = false;

    // Display case modal
    $('caseModal').hidden = false;
    document.body.style.overflow = 'hidden';

    $('closeModal').focus();
}


/* =========================================================
   11. CLOSE PROJECT CASE
   ========================================================= */

function closeCase() {
    $('caseModal').hidden = true;

    document.body.style.overflow = '';
}


/* =========================================================
   12. CASE FILE BUTTON EVENTS
   ========================================================= */

document.querySelectorAll('.evidence').forEach(b =>
    b.addEventListener('click', () =>
        openCase(Number(b.dataset.case))
    )
);

// Reveal technical details
$('revealBtn').addEventListener('click', () => {
    visited.add(currentCase);

    updateProgress();

    $('modalReveal').hidden = false;
    $('revealBtn').hidden = true;
});

// Close case
$('closeModal').addEventListener('click', closeCase);

// Open next file
// Return to the detective corridor after finishing a case.
// The corridor will show which room is unlocked next.
$('nextFile').addEventListener('click', () => {
  closeCase();
  showScene('corridorPreview');
});
// Close case when backdrop is clicked
$('caseModal').addEventListener('click', e => {
    if (e.target === $('caseModal')) {
        closeCase();
    }
});


/* =========================================================
   13. FINAL VERDICT
   ========================================================= */

function openVerdict() {
    $('verdictInvestigator').textContent = investigator;

    $('verdictModal').hidden = false;

    document.body.style.overflow = 'hidden';
}

function closeVerdict() {
    $('verdictModal').hidden = true;

    document.body.style.overflow = '';
}


/* =========================================================
   14. FINAL VERDICT BUTTON EVENTS
   ========================================================= */

$('verdictBtn').addEventListener('click', openVerdict);

$('closeVerdict').addEventListener('click', closeVerdict);

$('backToBoard').addEventListener('click', closeVerdict);

$('verdictModal').addEventListener('click', e => {
    if (e.target === $('verdictModal')) {
        closeVerdict();
    }
});


/* =========================================================
   15. DOWNLOAD INVESTIGATION REPORT
   ========================================================= */

$('downloadReport').addEventListener('click', () => {
    let text = `BUREAU OF UNEXPLAINED APPLICATIONS\nCASE 001: THE MISSING RESUME\nInvestigator: ${investigator}\nSubject: Sana Tasneem\nEvidence examined: ${visited.size}/6\n\n${files.map((f, i) => `FILE ${i + 1}: ${f.title}\n${f.real}\n${f.solution}\n`).join('\n')}\nVERDICT: The resume was never missing. You were looking for my qualifications. I wanted to show you how I think.\n`;

    const blob = new Blob([text], {
        type: 'text/plain'
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');

    a.href = url;
    a.download = 'Case-001-Investigation-Report.txt';

    a.click();

    URL.revokeObjectURL(url);
});


/* =========================================================
   16. KEYBOARD EVENTS
   ========================================================= */

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeCase();
        closeVerdict();
    }
});


/* =========================================================
   17. THREE IMPOSSIBLE ROOMS — CORRIDOR (SEQUENTIAL DOORS)
   =========================================================

   Door order:  01 Face Recognition → 02 Campus Connect → 03 Fake News

   There is no extra "progress" variable. A door counts as
   solved when its project (mainRoomProjects[room]) is in the
   existing `visited` set, i.e. the investigator has pressed
   "UNSEAL THE TECHNICAL FILE" in that project's modal.
   The first unsolved door is available; later ones are sealed.

   This block only reads existing globals (visited, mainRoomProjects,
   openCase, showScene, updateProgress, toast, $) and never edits
   the existing functions.
   ========================================================= */

(function initCorridor() {
    const section = $('corridorPreview');
    const stage = $('corridorStage');
    const world = $('corridorWorld');
    const statusEl = $('corridorStatus');
    const actionBtn = $('corridorAction');
    const doors = Array.from(document.querySelectorAll('.mystery-door'));

    const roomNames = [
        'THE IDENTITY CHAMBER',
        'THE VANISHING EVENT',
        'THE FABRICATED TRUTH'
    ];

    let activeRoom = -1;   // room whose case modal is currently open
    let lastNext = null;   // previously available room (for unlock effect)

    const pad = n => String(n + 1).padStart(2, '0');
    const solved = room => visited.has(mainRoomProjects[room]);
    const nextRoom = () => doors.findIndex((_, room) => !solved(room));

    const motionOn = () =>
        !document.body.classList.contains('motion-off') &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches;


    /* ---------- Draw current door states ---------- */

    function render() {
        const next = nextRoom();

        doors.forEach((door, room) => {
            const state = solved(room)
                ? 'solved'
                : (room === next ? 'available' : 'locked');

            door.dataset.state = state;
            door.setAttribute('aria-disabled', state === 'locked' ? 'true' : 'false');

            door.querySelector('.door-status').textContent =
                state === 'solved' ? '✓ FILE RECOVERED'
                : state === 'available' ? `ENTER ROOM ${pad(room)} →`
                : 'SEALED';

            door.setAttribute(
                'aria-label',
                `Room ${pad(room)}: ${roomNames[room]}. ` +
                (state === 'locked' ? 'Sealed.' : state === 'solved' ? 'File recovered. Open again.' : 'Unsealed. Enter.')
            );
        });

        // Light-sweep on the door that has just become available
        if (next !== -1 && lastNext !== null && next !== lastNext) {
            const door = doors[next];

            door.classList.add('just-unlocked');
            setTimeout(() => door.classList.remove('just-unlocked'), 1800);
        }

        lastNext = next;

        // HUD
        if (next === -1) {
            statusEl.textContent = '◉ ALL THREE ROOMS OPENED — THE ARCHIVE IS UNSEALED';
            actionBtn.textContent = 'ENTER THE FULL ARCHIVE →';
            actionBtn.classList.add('ready');
        } else {
            statusEl.textContent = `◉ ROOM ${pad(next)} IS UNSEALED — ${roomNames[next]}`;
            actionBtn.textContent = `OPEN DOOR ${pad(next)} →`;
            actionBtn.classList.remove('ready');
        }
    }


    /* ---------- Open a room ---------- */

    function openRoom(room) {
        if (activeRoom !== -1) return;

        const door = doors[room];

        // Sealed door: shake + explain
        if (door.dataset.state === 'locked') {
            door.classList.remove('shake');
            void door.offsetWidth;                 // restart animation
            door.classList.add('shake');

            toast(`ROOM ${pad(room)} IS SEALED // EXAMINE ${roomNames[nextRoom()]} FIRST`);
            return;
        }

        activeRoom = room;

        const open = () => {
            // Player left the corridor during the zoom
            if (!section.classList.contains('active')) {
                activeRoom = -1;
                stage.classList.remove('entering');
                return;
            }

            openCase(mainRoomProjects[room]);
        };

        if (motionOn()) {
            const s = stage.getBoundingClientRect();
            const d = door.getBoundingClientRect();

            stage.style.setProperty('--zx', ((d.left + d.width / 2 - s.left) / s.width * 100).toFixed(1) + '%');
            stage.style.setProperty('--zy', ((d.top + d.height / 2 - s.top) / s.height * 100).toFixed(1) + '%');

            stage.classList.add('entering');
            setTimeout(open, 700);
        } else {
            open();
        }
    }

    function goToBoard() {
        showScene('board');
        updateProgress();
    }


    /* ---------- Events ---------- */

    doors.forEach(door =>
        door.addEventListener('click', () => openRoom(Number(door.dataset.room)))
    );

    actionBtn.addEventListener('click', () => {
        const next = nextRoom();

        if (next === -1) {
            goToBoard();
        } else {
            openRoom(next);
        }
    });
    // Back to Home: returns to the opening page where the investigator
    // enters their name.
    const homeBtn = $('corridorHome');

    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            clearTimeout(scanTimer);
            showScene('intro');
            $('investigatorName').focus();
        });
    }

    // Re-draw whenever the corridor becomes the active scene
    new MutationObserver(() => {
        if (section.classList.contains('active')) render();
    }).observe(section, { attributes: true, attributeFilter: ['class'] });

    // When the case modal closes: zoom back out and update the doors
    new MutationObserver(() => {
        if (!$('caseModal').hidden || activeRoom === -1) return;

        const room = activeRoom;
        activeRoom = -1;

        stage.classList.remove('entering');
        render();

        if (solved(room)) {
            const next = nextRoom();

            toast(next === -1
                ? 'ALL THREE ROOMS OPENED // THE ARCHIVE IS UNSEALED'
                : `ROOM ${pad(room)} RECOVERED // ROOM ${pad(next)} UNSEALED`);
        } else {
    // Room 03 is the final mystery, so don't mention another door.
    toast(
        room === 2
            ? 'UNSEAL THE TECHNICAL FILE TO COMPLETE THE FINAL INVESTIGATION'
            : 'UNSEAL THE TECHNICAL FILE TO OPEN THE NEXT DOOR'
    );
}
    }).observe($('caseModal'), { attributes: true, attributeFilter: ['hidden'] });

    // Gentle parallax (mouse only; respects the MOTION toggle)
    stage.addEventListener('pointermove', e => {
        if (e.pointerType === 'touch' || !motionOn()) return;

        const r = stage.getBoundingClientRect();

        world.style.setProperty('--px', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
        world.style.setProperty('--py', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
    });

    stage.addEventListener('pointerleave', () => {
        world.style.setProperty('--px', 0);
        world.style.setProperty('--py', 0);
    });

    render();
})();