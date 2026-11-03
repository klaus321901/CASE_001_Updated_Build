/* =========================================================
   CASE 001 — THE MISSING RESUME
   Main JavaScript File
   ========================================================= */


/* =========================================================
   1. GLOBAL VARIABLES
   ========================================================= */

const $ = id => document.getElementById(id);

const scenes = ['intro', 'scan', 'corridorPreview', 'board', 'verdict'];

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
        context: 'FULL-STACK CAMPUS EVENTS PLATFORM · JULY 2026',
        
        sources: [
            { label: 'MONDAY POST', text: 'AI Workshop · 21 Oct · Seminar Hall' },
            { label: 'WEDNESDAY REEL', text: '"Quick update, we have moved to Lab 3!"' }
        ],

        event: { title: 'AI WORKSHOP', when: '21 OCT · 10 AM', oldVenue: 'Seminar Hall', newVenue: 'Lab 3' },

         outcomes: ['updated', 'duplicate', 'outdated'],
        icon: '◈',

        tags: [
            'FastAPI',
            'PostgreSQL',
            'Selenium',
            'PaddleOCR',
            'Whisper',
            'Gemini'
        ],

        question: '40 students showed up for a workshop. Nobody was there.',

        problem: 'On Thursday morning, Priya checked Campus Connect: AI Workshop, 21 Oct, Seminar Hall. She brought her friends. The hall was empty. The workshop was happening, just somewhere else. Somewhere between Instagram and the website, the update vanished.',

        clues: [
            'MONDAY POST · AI Workshop · 21 Oct · 10 AM · Seminar Hall',
            'WEDNESDAY REEL · "Quick update, we have moved to Lab 3!"',
            'CAMPUS CONNECT · still shows Seminar Hall'
        ],

        prompt: 'THE SCRAPER JUST FOUND THE WEDNESDAY REEL. WHAT SHOULD THE SYSTEM DO?',

            choices: [
            'UPDATE THE EXISTING EVENT',
            'SAVE AS A NEW EVENT',
            'SKIP IT'
        ],

        correct: 0,

        feedback: [
            'Venue updated to Lab 3. Priya and her friends find the workshop. Case solved.',
            "Now there are two AI Workshops on the site. Students don't know which one is real.",
            'The site keeps saying Seminar Hall. 40 students walk into an empty room.'
        ],

        reveal: {
            built: 'Campus Connect is a campus events platform built with FastAPI, PostgreSQL and JavaScript. Behind it, an ingestion pipeline uses Selenium to collect club posts and Reels from Instagram, OpenCV and PaddleOCR to read posters, pyzbar to decode QR codes, Whisper to transcribe Reel audio, and regex plus Gemini to turn it all into clean event records.',
            wrong: 'No scraper gives you clean data. Captions were full of emojis and hashtags, dates came in every format, posters used decorative fonts, and every run brought back posts I had already saved. Clubs also kept posting updates, so the site either duplicated events or kept old details. Reel audio was its own problem: background music and noise made transcription unreliable, and I tried several approaches before it worked.',
                        fixed: 'Before anything is saved, a cleaning step filters out irrelevant posts, removes duplicate links, preprocesses posters with OpenCV so OCR can read them, and converts dates and times into one standard format. Then each post is matched to existing events, so new details update the record instead of creating a duplicate. For audio, Whisper finally gave reliable transcripts, so updates spoken only in a Reel get picked up too. Gemini fills the gaps regex misses.',
            learned: 'Collecting data is the easy part. Cleaning it and keeping it correct as it changes is the real work.'
        },

        solution: 'Sana built a campus event platform and an Instagram ingestion pipeline that collects posts and Reels using Selenium; preprocesses posters with OpenCV and extracts text using PaddleOCR; decodes QR links; transcribes Reel audio using Whisper; and uses regex and Gemini to refine structured event information.',

        detail: 'The platform connects FastAPI, SQLAlchemy and PostgreSQL to an HTML/CSS/JavaScript frontend with event discovery, feedback, recommendations and admin management.'
    },

    {
                title: 'THE FABRICATED TRUTH',
        real: 'Fake News Detection System',
        context: 'FULL-STACK FACT-CHECKING APP · JULY 2025',
        
        chat: {
            group: 'CLASS GROUP · 11:02 PM',
            text: 'OFFICIAL: College closed tomorrow due to heavy rain. Forward to everyone.',
            sources: [
                { name: 'College website', found: 'No closure notice' },
                { name: 'Local news', found: 'No report' },
                { name: 'Weather update', found: 'Rain, no closure announced' }
            ]
        },

        outcomes: ['shares', 'tone', 'search'],
        icon: '⌁',

        tags: [
            'Angular',
            'FastAPI',
            'SerpAPI',
            'Gemini',
            'Pydantic'
        ],

        question: 'Half the class is staying home tomorrow. Should they?',

        problem: "At 11 PM, a message lands in Rahul's class group: \"OFFICIAL: College closed tomorrow due to heavy rain. Forward to everyone.\" Within an hour, it has been forwarded everywhere and half the class has decided to sleep in. Rahul has an exam in the morning. He needs to know if it is real.",

        clues: [
            'Forwarded 2,000+ times',
            'Written in capital letters and sounds official',
            'The college website and local news say nothing about a closure'
        ],

        prompt: 'HOW DO YOU CHECK IT?',

        choices: [
            'TRUST IT · EVERYONE IS SHARING IT',
            'TRUST IT · IT SOUNDS OFFICIAL',
            'SEARCH FOR OUTSIDE SOURCES AND COMPARE'
        ],

        correct: 2,

        feedback: [
            'Popular is not the same as true. Rahul skips his exam for nothing.',
            'Anyone can type in capital letters. Rahul skips his exam for nothing.',
            'No source backs it up. Likely FAKE. Rahul goes to his exam. Case solved.'
        ],

        reveal: {
            built: 'I built a fact-checking app with Angular and FastAPI. You type in a claim, the backend searches the web for evidence using SerpAPI, then Gemini compares the claim with that evidence and returns five fields: verdict (REAL, FAKE or UNKNOWN), score, reasoning, evidence and warnings.',
            wrong: 'My first goal was a model that could give the right verdict on its own. I tested classifiers like BERT and DeBERTa, but they only learned how fake news sounds. They could not check whether a claim was actually true, and they had no way to verify sources or handle news newer than their training data.',
            fixed: 'So I switched to evidence first. The app searches for live sources, keeps only the useful snippets, and gives them to Gemini with a structured prompt. A parser turns the answer into the same five fields every time, and if anything fails or the evidence is unclear, it answers UNKNOWN instead of guessing.',
            learned: 'Sounding true and being true are different problems. A good fact-checker needs evidence, and it needs to know when to say "I am not sure."'
        },

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
        title: 'THE IDENTITY CHAMBER',
        real: 'Face Recognition & Authentication System',
        context: 'SOFTWARE ENGINEER INTERN · READYPOD TECHNOLOGIES · SEP–OCT 2025',

        scan: [
            { name: 'ARJUN', d: 0.49 },
            { name: 'STRANGER', d: 0.68 }
        ],

        thresholds: [0.35, 0.55, 0.75],
        icon: '◎',

        tags: [
            'RetinaFace',
            'FaceNet',
            'DeepFace',
            'FastAPI'
        ],

               question: 'Arjun is back from the weekend with a new haircut.',

        problem: 'It is early, the hallway lights are dim, and Arjun walks up to the restricted server room. Right behind him, a stranger in a company hoodie tries to slip in too. The scanner checks both faces against the employee records.',

        clues: [
            'ARJUN · match distance 0.49',
            'STRANGER · closest match 0.68',
            'Lower number = closer match'
        ],

        prompt: 'WHERE DO YOU SET THE THRESHOLD? ANYONE BELOW IT GETS IN.',

            choices: [
            '0.35 · STRICT',
            '0.55 · BALANCED',
            '0.75 · LOOSE'
        ],

        correct: 1,

        feedback: [
            'The stranger is stopped. So is Arjun, locked out of his own office.',
            'Arjun walks in. The stranger is turned away. Case solved.',
            'Arjun gets in. So does the stranger.'
        ],

        reveal: {
            built: 'During my internship at ReadyPod Technologies, I built a face authentication system for restricted areas. RetinaFace finds each face, FaceNet turns it into an embedding, and cosine distance compares it with registered employees. FastAPI serves it, and it handles several faces in one photo.',
            wrong: 'Finding the right threshold was hard. Too loose, and strangers were accepted as employees. Too strict, and real employees were rejected. People also looked different from day to day: low light, a new hairstyle, makeup, a whole new look.',
            fixed: 'I tested different values until 0.55 balanced both errors. I also stored several reference photos for each employee, in different lighting and looks, so one bad photo day would not lock anyone out.',
            learned: 'In authentication there is no perfect number. There is only a tradeoff you choose on purpose and keep testing.'
        },

        solution: 'During her software engineering internship at ReadyPod Technologies, Sana built a FastAPI-based facial recognition application integrating RetinaFace detection, FaceNet embeddings, cosine-distance comparisons and threshold-based recognition decisions.',

        detail: 'The application supports multiple faces in uploaded images, employee reference photographs, bounding-box annotations and access-granted or access-denied results. This is her internship project.'
    }
    
];



/* =========================================================
   3. SCENE NAVIGATION
   ========================================================= */


function showScene(id) {
    document.body.dataset.scene = id;
    // Display the requested section.
    scenes.forEach(s => $(s).classList.toggle('active', s === id));

    // Remove temporary notifications when entering Beyond the Case Files.
    if (id === 'board') {
        $('toast').classList.remove('visible');
    }

    // Return to the top of the section.
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

    


    document.querySelectorAll('.evidence').forEach(el =>
        el.classList.toggle('visited', visited.has(Number(el.dataset.case)))
    );
}


/* =========================================================
   6. ENTER THE EVIDENCE BOARD
   ========================================================= */


function enterBoard() {
    clearTimeout(scanTimer);


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

    const name = $('investigatorName').value.trim();

    // Same investigator coming back: keep progress, skip verification
    if (visited.size && name.toLowerCase() === investigator.toLowerCase()) {
        enterBoard();
        toast(`WELCOME BACK, ${name.toUpperCase()}. YOUR PROGRESS IS SAVED.`);
        return;
    }

    // New investigator: start a fresh case
    visited.clear();
    startScan(name);
});

// Skip introduction
$('skipBtn').addEventListener('click', () => {
        if (($('investigatorName').value.trim() || 'Anonymous').toLowerCase() !== investigator.toLowerCase()) visited.clear();
    investigator = $('investigatorName').value.trim() || 'Anonymous';

    enterBoard();

    toast('The Bureau acknowledges your suffering. Reluctantly.');
});

// Skip verification animation
// Open the detective corridor when the investigator chooses to continue.
$('proceedScan').addEventListener('click', enterBoard);

// Return to homepage
$('homeBtn').addEventListener('click', () => {
    clearTimeout(scanTimer);
    showScene('intro');
    $('investigatorName').focus();
});
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

/* Room visual: ID badges + distance meter (rooms with f.scan) */
function renderScan(f) {
    const box = $('modalVisual');

    box.classList.add('has-scan');
    box.innerHTML = `
        <div class="scan-badges">
            ${f.scan.map((p, n) => `
                <div class="scan-badge" data-n="${n}">
                    <span class="badge-face"></span>
                    <strong>${p.name}</strong>
                    <small>DISTANCE ${p.d.toFixed(2)}</small>
                    <em class="badge-stamp">WAITING</em>
                </div>`).join('')}
        </div>
        <div class="scan-meter">
            <div class="meter-zone"></div>
            <div class="meter-line"><span></span></div>
            ${f.scan.map(p => `<i class="meter-dot" style="left:${p.d * 100}%"><b>${p.name}</b></i>`).join('')}
        </div>
        <div class="meter-scale"><span>0.0 · SAME FACE</span><span>1.0 · DIFFERENT FACE</span></div>`;
}

function updateScan(f, t) {
    const box = $('modalVisual');
    const line = box.querySelector('.meter-line');

    box.querySelector('.meter-zone').style.width = t * 100 + '%';
    line.style.left = t * 100 + '%';
    line.classList.add('set');
    line.querySelector('span').textContent = 'THRESHOLD ' + t.toFixed(2);

    f.scan.forEach((p, n) => {
        const badge = box.querySelector(`.scan-badge[data-n="${n}"]`);
        const gotIn = p.d < t;

        badge.dataset.result = gotIn ? 'in' : 'out';
        badge.querySelector('.badge-stamp').textContent = gotIn ? 'ACCESS GRANTED' : 'DENIED';
    });
}
/* Room visual: source cards + event card (rooms with f.event) */
function eventCard(e, venue, extra = '') {
    return `
        <div class="event-card ${extra}">
            <strong>${e.title}</strong>
            <small>${e.when}</small>
            <span class="event-venue">VENUE: ${venue}</span>
            <em class="badge-stamp">LIVE ON SITE</em>
        </div>`;
}

function renderEvent(f) {
    const box = $('modalVisual');

    box.classList.add('has-scan');
    box.innerHTML = `
        <div class="scan-badges">
            ${f.sources.map(s => `
                <div class="scan-badge source-card">
                    <small>${s.label}</small>
                    <span>${s.text}</span>
                </div>`).join('')}
        </div>
        <p class="event-label">CAMPUS CONNECT · WHAT STUDENTS SEE</p>
        <div class="event-row">${eventCard(f.event, f.event.oldVenue)}</div>`;
}

function updateEvent(f, idx) {
    const e = f.event;
    const row = $('modalVisual').querySelector('.event-row');
    const outcome = f.outcomes[idx];

    if (outcome === 'duplicate') {
        row.innerHTML = eventCard(e, e.oldVenue, 'is-bad') + eventCard(e, e.newVenue, 'is-bad');
        row.querySelectorAll('.badge-stamp').forEach(s => s.textContent = 'DUPLICATE');
    } else if (outcome === 'outdated') {
        row.innerHTML = eventCard(e, e.oldVenue, 'is-bad');
        row.querySelector('.badge-stamp').textContent = 'OUTDATED · WRONG ROOM';
    } else {
        row.innerHTML = eventCard(e, `<s>${e.oldVenue}</s> ${e.newVenue}`, 'is-good');
        row.querySelector('.badge-stamp').textContent = 'UPDATED';
    }
}
/* Room visual: forwarded message + evidence check (rooms with f.chat) */
function renderChat(f) {
    const box = $('modalVisual');

    box.classList.add('has-scan');
    box.innerHTML = `
        <div class="chat-bubble">
            <small>${f.chat.group}</small>
            <span class="chat-text">${f.chat.text}</span>
            <em class="chat-fwd">↪ Forwarded many times</em>
        </div>
        <p class="event-label">FACT CHECK</p>
        <div class="verdict-box">
            <div class="evidence-rows"><p class="ev-note">Waiting for your decision...</p></div>
            <em class="badge-stamp">VERDICT: PENDING</em>
        </div>`;
}

function updateChat(f, idx) {
    const box = $('modalVisual');
    const bubble = box.querySelector('.chat-bubble');
    const vbox = box.querySelector('.verdict-box');
    const rows = box.querySelector('.evidence-rows');
    const stamp = vbox.querySelector('.badge-stamp');
    const outcome = f.outcomes[idx];

    bubble.classList.remove('loud');
    vbox.classList.remove('is-bad', 'is-good');
    box.querySelector('.chat-fwd').textContent = '↪ Forwarded many times';

    if (outcome === 'shares') {
        box.querySelector('.chat-fwd').textContent = '↪ Forwarded 2,000+ times';
        rows.innerHTML = '<p class="ev-note">2,000 shares. 0 sources.</p>';
        stamp.textContent = 'NOT EVIDENCE';
        vbox.classList.add('is-bad');
    } else if (outcome === 'tone') {
        bubble.classList.add('loud');
        rows.innerHTML = '<p class="ev-note">Capital letters are not a source.</p>';
        stamp.textContent = 'NOT EVIDENCE';
        vbox.classList.add('is-bad');
    } else {
        rows.innerHTML = f.chat.sources.map(s =>
            `<div class="ev-row"><b>${s.name}</b><span>${s.found}</span></div>`
        ).join('');
        stamp.textContent = 'VERDICT: LIKELY FAKE';
        vbox.classList.add('is-good');
    }
}
/* =========================================================
   10. OPEN PROJECT CASE
   ========================================================= */

function openCase(i) {
    currentCase = i;

    const f = files[i];

    // Use a different navigation label for the final investigation.
    $('nextFile').textContent =
        i === mainRoomProjects[2]
            ? 'RETURN TO CORRIDOR →'
            : 'NEXT FILE →';

    $('modalNumber').textContent =
            $('modalNumber').textContent = '';

    $('modalTitle').textContent = f.title;
       $('modalReal').textContent = f.real;

    // Small second line under the project name (e.g. internship)
    if (f.context) {
        const c = document.createElement('small');
        c.className = 'modal-context';
        c.textContent = f.context;
        $('modalReal').appendChild(c);
    }

    // Room visual: badges + meter for redesigned rooms, icon otherwise
    $('modalVisual').classList.remove('has-scan');

    if (f.scan) {
        renderScan(f);
        } else if (f.event) {
        renderEvent(f);
        } else if (f.chat) {
        renderChat(f);
    } else {
        $('modalVisual').textContent = f.icon;
    }
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

    // Clues (only rooms that have them)
    if (f.clues) {
        const list = document.createElement('ul');
        list.className = 'clue-list';

        f.clues.forEach(c => {
            const li = document.createElement('li');
            li.textContent = c;
            list.appendChild(li);
        });

        $('modalInteraction').appendChild(list);
    }

    const instruction = document.createElement('div');

    instruction.textContent = f.prompt || 'WHAT WOULD YOU INVESTIGATE FIRST?';
    instruction.style.marginBottom = '10px';

    $('modalInteraction').appendChild(instruction);

    // Result line shown after a choice (redesigned rooms only)
    const feedback = document.createElement('p');
    feedback.className = 'choice-feedback';
    feedback.hidden = true;

    // Create mystery choices
    f.choices.forEach((choice, choiceIndex) => {
        const b = document.createElement('button');

        b.textContent = choice;

        b.addEventListener('click', () => {
            document.querySelectorAll('#modalInteraction button')
                .forEach(n => n.classList.remove('chosen', 'wrong'));

            // Redesigned rooms: show the result, unlock the file only when correct
                    if (f.feedback) {
                const right = choiceIndex === f.correct;

                b.classList.add(right ? 'chosen' : 'wrong');
                feedback.textContent = (right ? '✓ ' : '✕ ') + f.feedback[choiceIndex];
                feedback.classList.toggle('is-right', right);
                feedback.hidden = false;

                if (f.scan) updateScan(f, f.thresholds[choiceIndex]);
                if (f.event) updateEvent(f, choiceIndex);
                if (f.chat) updateChat(f, choiceIndex);

                $('revealBtn').hidden = !right;
                return;
            }

            // Rooms not redesigned yet: original behaviour
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

    $('modalInteraction').appendChild(feedback);

    // Technical file: four sections for redesigned rooms
    if (f.reveal) {
        $('modalSolution').innerHTML = [
            ['WHAT I BUILT', f.reveal.built],
            ['WHAT WENT WRONG', f.reveal.wrong],
            ['HOW I FIXED IT', f.reveal.fixed],
            ['WHAT I LEARNED', f.reveal.learned]
        ].map(([h, t]) =>
            `<span class="reveal-step"><strong>${h}</strong>${t}</span>`
        ).join('');
    }

    $('modalDetail').hidden = !!f.reveal;

    // Reset technical reveal (redesigned rooms wait for the right answer)
    $('modalReveal').hidden = true;
    $('revealBtn').hidden = !!f.feedback;


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
// The Final Verdict is a full page, not a popup.
function openVerdict() {
    // Use the visitor's name. If they skipped or left it generic, say "Investigator".
    const name = investigator.trim();
    const generic = !name || ['investigator', 'anonymous'].includes(name.toLowerCase());

    $('verdictInvestigator').textContent = generic ? 'Investigator' : name.charAt(0).toUpperCase() + name.slice(1);

    showScene('verdict');
}

// X on the verdict page goes back to Beyond the Case Files.
function closeVerdict() {
    showScene('board');
}

$('verdictBtn').addEventListener('click', openVerdict);

$('closeVerdict').addEventListener('click', closeVerdict);

$('returnCorridor').addEventListener('click', () => showScene('corridorPreview'));

// Copy Sana's email instead of opening a mail app
$('copyEmail').addEventListener('click', e => {
    e.preventDefault();
    navigator.clipboard.writeText('sanatasneem33@gmail.com');
    toast('EMAIL COPIED · sanatasneem33@gmail.com');
});


/* =========================================================
   16. KEYBOARD EVENTS
   ========================================================= */

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeCase();
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
            statusEl.textContent = 'ALL THREE INVESTIGATIONS RECOVERED. BUT THE CASE ISN\'T CLOSED YET.'
            actionBtn.textContent = 'BEYOND THE CASE FILES →';
            actionBtn.classList.add('ready');
        } else {
            statusEl.textContent = `◉ ROOM ${pad(next)} IS UNSEALED · ${roomNames[next]}`;
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

                toast(`ROOM ${pad(room)} IS SEALED. EXAMINE ${roomNames[nextRoom()]} FIRST.`);
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

            // Show unlock notifications only for Rooms 01 and 02.
            // Room 03's completion message will appear in the corridor.
            if (next !== -1) {
                toast(`ROOM ${pad(room)} RECOVERED. ROOM ${pad(next)} UNSEALED`);
            }
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

