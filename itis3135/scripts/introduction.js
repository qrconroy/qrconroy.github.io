/**
 * introduction.js
 * Matches functionality of https://divonbriesen.github.io/introductions/
 * Script is at bottom of <body> — DOM is ready, no DOMContentLoaded needed.
 */

/* ================================================================
   STATE
   ================================================================ */
let courseCount = 0;
let imageDataURL = null;

/* ================================================================
   ELEMENT REFERENCES
   ================================================================ */
const form             = document.getElementById('intro-form');
const previewPanel     = document.getElementById('preview-panel');
const addCourseBtn     = document.getElementById('add-course-btn');
const clearBtn         = document.getElementById('clear-btn');
const clearBtn2        = document.getElementById('clear-btn-2');
const loadSampleBtn    = document.getElementById('load-sample-btn');
const loadSampleBtn2   = document.getElementById('load-sample-btn-2');
const clearImageBtn    = document.getElementById('clear-image-btn');
const pictureInput     = document.getElementById('picture');
const imagePreview     = document.getElementById('image-preview');
const imagePreviewWrap = document.getElementById('image-preview-wrap');
const imageUrlInput    = document.getElementById('image-url');

/* ================================================================
   EVENT LISTENERS
   ================================================================ */
form.addEventListener('submit', function (e) {
    e.preventDefault();
    handleGenerate();
});

addCourseBtn.addEventListener('click', addCourseRow);
clearBtn.addEventListener('click', handleClear);
clearBtn2.addEventListener('click', handleClear);
loadSampleBtn.addEventListener('click', loadSample);
loadSampleBtn2.addEventListener('click', loadSample);
clearImageBtn.addEventListener('click', handleClearImage);

// File upload → store as base64 and show preview
pictureInput.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        imageDataURL = e.target.result;
        imagePreview.src = imageDataURL;
        imagePreviewWrap.classList.remove('hidden');
        imageUrlInput.value = '';
    };
    reader.readAsDataURL(file);
});

// Typing a URL clears the file upload
imageUrlInput.addEventListener('input', function () {
    if (this.value.trim()) {
        pictureInput.value = '';
        imageDataURL = null;
        imagePreviewWrap.classList.add('hidden');
    }
});

/* ================================================================
   ADD / REMOVE COURSE ROWS
   ================================================================ */
function addCourseRow() {
    courseCount++;
    const id = courseCount;
    const tbody = document.getElementById('courses-list');

    const tr = document.createElement('tr');
    tr.dataset.courseId = id;
    tr.innerHTML = `
        <td><input type="text" placeholder="CS"                    name="course-dept-${id}"></td>
        <td><input type="text" placeholder="101"                   name="course-num-${id}"></td>
        <td><input type="text" placeholder="Intro to Programming"  name="course-name-${id}"></td>
        <td><input type="text" placeholder="Required for major"    name="course-reason-${id}"></td>
        <td><button type="button" class="delete-course-btn">✕ Remove</button></td>
    `;

    tr.querySelector('.delete-course-btn').addEventListener('click', () => tr.remove());
    tbody.appendChild(tr);
}

/* ================================================================
   GATHER DATA
   Value → falls back to placeholder if empty.
   ================================================================ */
function gatherData() {
    const val = id => {
        const el = document.getElementById(id);
        if (!el) return '';
        return el.value.trim() || el.placeholder || '';
    };

    const checked = name =>
        [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(el => el.value);

    const imgSrc = imageDataURL || imageUrlInput.value.trim() || null;

    const courses = [];
    document.querySelectorAll('#courses-list tr').forEach(tr => {
        const inputs = tr.querySelectorAll('input[type="text"]');
        courses.push({
            dept:   inputs[0] ? (inputs[0].value.trim() || inputs[0].placeholder) : '',
            number: inputs[1] ? (inputs[1].value.trim() || inputs[1].placeholder) : '',
            name:   inputs[2] ? (inputs[2].value.trim() || inputs[2].placeholder) : '',
            reason: inputs[3] ? (inputs[3].value.trim() || inputs[3].placeholder) : '',
        });
    });

    return {
        name: {
            first:    val('f-name'),
            middle:   val('m-name'),
            last:     val('l-name'),
            nickname: val('p-name'),
        },
        divider:          val('divider'),
        mascotDescriptor: val('mascot-adj'),
        mascot:           val('mascot-noun'),
        displayHeading:   val('display-heading'),
        email:            val('email'),
        initialsDate:     val('initials-date'),
        image:            imgSrc,
        imageCaption:     val('picture-caption'),
        personalStatement: val('personal-statement'),
        quote:            val('quote'),
        quoteAuthor:      val('quote-author'),
        backgrounds: {
            personal:     val('pers-background'),
            professional: val('professional-background'),
            academic:     val('academic-background'),
            funny:        val('funny-thing'),
            additional:   val('additional'),
        },
        platform:     checked('platform'),
        os:           checked('os'),
        workLocation: val('work-location'),
        backupPlan:   val('backup-plan'),
        courses,
    };
}

/* ================================================================
   GENERATE — populate JSON + HTML preview below the form
   ================================================================ */
function handleGenerate() {
    const data = gatherData();

    // JSON panel
    document.getElementById('json-output').textContent = JSON.stringify(data, null, 2);

    // HTML panel
    document.getElementById('html-output').innerHTML = buildProfileHTML(data);

    // Reveal preview (form stays visible above it)
    previewPanel.classList.remove('hidden');
    previewPanel.scrollIntoView({ behavior: 'smooth' });
}

/* ================================================================
   BUILD RENDERED PROFILE HTML
   ================================================================ */
function buildProfileHTML(d) {
    const divider     = d.divider || '|';
    const displayName = d.name.nickname
        ? `${d.name.nickname} ${d.name.last}`
        : `${d.name.first} ${d.name.last}`;
    const fullName    = [d.name.first, d.name.middle, d.name.last].filter(Boolean).join(' ');

    const photoHTML = d.image
        ? `<img class="profile-img" src="${d.image}" alt="${d.imageCaption || 'Profile photo'}">`
        : '';

    const courseRows = d.courses.length
        ? d.courses.map(c => `
            <tr>
                <td>${c.dept}</td>
                <td>${c.number}</td>
                <td>${c.name}</td>
                <td>${c.reason}</td>
            </tr>`).join('')
        : `<tr><td colspan="4" style="color:#999;">No courses added.</td></tr>`;

    const platformStr = d.platform.length ? d.platform.join(', ') : '—';
    const osStr       = d.os.length       ? d.os.join(', ')       : '—';

    const additionalHTML = d.backgrounds.additional
        ? `<h2>Also</h2><p>${d.backgrounds.additional}</p>`
        : '';

    return `
        <div class="clearfix">
            ${photoHTML}
            <h1>${displayName}</h1>
            <p>
                <strong>${d.mascotDescriptor} ${d.mascot}</strong> ${divider} ${displayName}
                ${d.displayHeading ? ' &nbsp;' + divider + '&nbsp; ' + d.displayHeading : ''}
            </p>
            <p style="color:#888; font-size:12px;">
                ${d.initialsDate}
                ${d.email ? ' &nbsp;|&nbsp; <a href="mailto:' + d.email + '">' + d.email + '</a>' : ''}
            </p>
        </div>

        <h2>Personal Statement</h2>
        <p>${d.personalStatement}</p>
        ${d.imageCaption ? `<p><em>${d.imageCaption}</em></p>` : ''}

        <h2>Favorite Quote</h2>
        <blockquote>
            &ldquo;${d.quote}&rdquo;<br>
            <cite>&mdash; ${d.quoteAuthor}</cite>
        </blockquote>

        <h2>Personal Background</h2>
        <p>${d.backgrounds.personal}</p>

        <h2>Professional Background</h2>
        <p>${d.backgrounds.professional}</p>

        <h2>Academic Background</h2>
        <p>${d.backgrounds.academic}</p>

        <h2>Something to Remember Me</h2>
        <p>${d.backgrounds.funny}</p>

        ${additionalHTML}

        <h2>Setup</h2>
        <p>
            <strong>Platform:</strong> ${platformStr} &nbsp;&nbsp;
            <strong>OS:</strong> ${osStr}
        </p>
        <p><strong>Work Location:</strong> ${d.workLocation}</p>
        <p><strong>Backup Plan:</strong> ${d.backupPlan}</p>

        <h2>Courses</h2>
        <table>
            <thead>
                <tr>
                    <th>Dept</th>
                    <th>#</th>
                    <th>Course Name</th>
                    <th>Reason for Taking</th>
                </tr>
            </thead>
            <tbody>${courseRows}</tbody>
        </table>
    `;
}

/* ================================================================
   LOAD SAMPLE DATA
   ================================================================ */
function loadSample() {
    setVal('f-name',              'Jane');
    setVal('m-name',              'A');
    setVal('l-name',              'Doe');
    setVal('p-name',              'Jay');
    setVal('divider',             '|');
    setVal('mascot-adj',          'Quizzical');
    setVal('mascot-noun',         'Cat');
    setVal('display-heading',     'CS Student | Developer');
    setVal('email',               'jane@example.com');
    setVal('initials-date',       'JD - 04/10/2026');
    setVal('image-url',           '');
    setVal('picture-caption',     'Smiling in front of a whiteboard');
    setVal('personal-statement',  "I'm a developer and educator who loves teaching people how to reason with code and algorithms. I enjoy hands-on projects, open-source collaboration, and coffee while debugging.");
    setVal('quote',               'Simplicity is the soul of efficiency.');
    setVal('quote-author',        'Austin Freeman');
    setVal('pers-background',     'Grew up near the Andes; enjoys trekking, photography, and local cuisine.');
    setVal('professional-background', '5 years as a software engineer, 3 years as a curriculum developer for introductory CS courses.');
    setVal('academic-background', 'BSc in Computer Science; ongoing study in human-centered computing.');
    setVal('funny-thing',         'Once taught a class of llamas to debug a loop');
    setVal('additional',          'Prefers quinoa snacks and composes multilingual commit messages (12 languages)');
    setVal('work-location',       'Home office');
    setVal('backup-plan',         'Use campus lab machine; phone hotspot and basic editor; keep code in cloud repo.');

    setCheckboxes('platform', ['Laptop']);
    setCheckboxes('os',       ['macOS']);

    // Clear existing courses then add sample rows
    document.getElementById('courses-list').innerHTML = '';
    courseCount = 0;

    addCourseRow();
    fillLastRow('CS',   '101',  'Intro to Programming', 'Required for major');
    addCourseRow();
    fillLastRow('MATH', '201',  'Calculus II',           'Core requirement');
    addCourseRow();
    fillLastRow('ENG',  '110',  'Technical Writing',     'Elective');
}

function setVal(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value;
}

function setCheckboxes(name, values) {
    document.querySelectorAll(`input[name="${name}"]`).forEach(cb => {
        cb.checked = values.includes(cb.value);
    });
}

function fillLastRow(dept, num, name, reason) {
    const rows   = document.querySelectorAll('#courses-list tr');
    const last   = rows[rows.length - 1];
    if (!last) return;
    const inputs = last.querySelectorAll('input[type="text"]');
    if (inputs[0]) inputs[0].value = dept;
    if (inputs[1]) inputs[1].value = num;
    if (inputs[2]) inputs[2].value = name;
    if (inputs[3]) inputs[3].value = reason;
}

/* ================================================================
   CLEAR
   ================================================================ */
function handleClear() {
    form.querySelectorAll('input[type="text"]').forEach(el => el.value = '');
    form.querySelectorAll('textarea').forEach(el => el.value = '');
    form.querySelectorAll('input[type="checkbox"]').forEach(el => el.checked = false);
    handleClearImage();
    document.getElementById('courses-list').innerHTML = '';
    courseCount = 0;
    previewPanel.classList.add('hidden');
}

function handleClearImage() {
    imageDataURL = null;
    pictureInput.value = '';
    imageUrlInput.value = '';
    imagePreview.src = '';
    imagePreviewWrap.classList.add('hidden');
}