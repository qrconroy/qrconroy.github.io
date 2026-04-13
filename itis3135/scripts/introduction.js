/**
 * introduction.js
 * Matches functionality of https://divonbriesen.github.io/introductions/
 */

/* ================================================================
   STATE
   ================================================================ */
let courseCount = 0;
let imageDataURL = null;  // stores uploaded image as base64

/* ================================================================
   ELEMENT REFERENCES
   (script is at bottom of body — DOM is ready)
   ================================================================ */
const form            = document.getElementById('intro-form');
const previewPanel    = document.getElementById('preview-panel');
const addCourseBtn    = document.getElementById('add-course-btn');
const clearBtn        = document.getElementById('clear-btn');
const clearBtn2       = document.getElementById('clear-btn-2');
const loadSampleBtn   = document.getElementById('load-sample-btn');
const loadSampleBtn2  = document.getElementById('load-sample-btn-2');
const resetBtn        = document.getElementById('reset-btn');
const clearImageBtn   = document.getElementById('clear-image-btn');
const pictureInput    = document.getElementById('picture');
const imagePreview    = document.getElementById('image-preview');
const imagePreviewWrap = document.getElementById('image-preview-wrap');
const imageUrlInput   = document.getElementById('image-url');

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
resetBtn.addEventListener('click', handleReset);
clearImageBtn.addEventListener('click', handleClearImage);

// File upload → show preview
pictureInput.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        imageDataURL = e.target.result;
        imagePreview.src = imageDataURL;
        imagePreviewWrap.style.display = 'block';
        imageUrlInput.value = '';  // clear URL field since we have a file
    };
    reader.readAsDataURL(file);
});

// Image URL → clear file input
imageUrlInput.addEventListener('input', function () {
    if (this.value.trim()) {
        pictureInput.value = '';
        imageDataURL = null;
        imagePreviewWrap.style.display = 'none';
    }
});

/* ================================================================
   ADD COURSE ROW
   ================================================================ */
function addCourseRow() {
    courseCount++;
    const tbody = document.getElementById('courses-list');
    const tr = document.createElement('tr');
    tr.dataset.courseId = courseCount;

    tr.innerHTML = `
        <td><input type="text" placeholder="CS" name="course-dept-${courseCount}"></td>
        <td><input type="text" placeholder="101" name="course-num-${courseCount}"></td>
        <td><input type="text" placeholder="Intro to Programming" name="course-name-${courseCount}"></td>
        <td><input type="text" placeholder="Required for major" name="course-reason-${courseCount}"></td>
        <td><button type="button" class="delete-course-btn">✕ Remove</button></td>
    `;

    tr.querySelector('.delete-course-btn').addEventListener('click', function () {
        tr.remove();
    });

    tbody.appendChild(tr);
}

/* ================================================================
   GATHER DATA
   Falls back to placeholder if field is empty.
   ================================================================ */
function gatherData() {
    const val = id => {
        const el = document.getElementById(id);
        if (!el) return '';
        return el.value.trim() || el.placeholder || '';
    };

    const textareaVal = id => {
        const el = document.getElementById(id);
        if (!el) return '';
        return el.value.trim() || el.placeholder || '';
    };

    // Checkboxes — gather all checked values by name
    const checked = name =>
        [...document.querySelectorAll(`input[name="${name}"]:checked`)]
            .map(el => el.value);

    // Resolve image: uploaded file takes priority over URL
    let imageSource = imageDataURL || imageUrlInput.value.trim() || null;

    // Courses
    const courses = [];
    document.querySelectorAll('#courses-list tr').forEach(tr => {
        const inputs = tr.querySelectorAll('input');
        courses.push({
            dept:   inputs[0]?.value.trim() || inputs[0]?.placeholder || '',
            number: inputs[1]?.value.trim() || inputs[1]?.placeholder || '',
            name:   inputs[2]?.value.trim() || inputs[2]?.placeholder || '',
            reason: inputs[3]?.value.trim() || inputs[3]?.placeholder || '',
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
        image:            imageSource,
        imageCaption:     val('picture-caption'),
        personalStatement: textareaVal('personal-statement'),
        quote:            val('quote'),
        quoteAuthor:      val('quote-author'),
        backgrounds: {
            personal:     textareaVal('pers-background'),
            professional: textareaVal('professional-background'),
            academic:     textareaVal('academic-background'),
            funny:        textareaVal('funny-thing'),
            additional:   textareaVal('additional'),
        },
        platform:      checked('platform'),
        os:            checked('os'),
        workLocation:  val('work-location'),
        backupPlan:    textareaVal('backup-plan'),
        courses,
    };
}

/* ================================================================
   GENERATE — build JSON + HTML preview
   ================================================================ */
function handleGenerate() {
    const data = gatherData();

    // Show JSON
    document.getElementById('json-output').textContent = JSON.stringify(data, null, 2);

    // Build rendered HTML output
    document.getElementById('html-output').innerHTML = buildProfileHTML(data);

    // Hide form, show preview
    form.classList.add('hidden');
    previewPanel.classList.remove('hidden');
    previewPanel.scrollIntoView({ behavior: 'smooth' });
}

/* ================================================================
   BUILD PROFILE HTML
   ================================================================ */
function buildProfileHTML(d) {
    const divider = d.divider || '|';
    const displayName = d.name.nickname
        ? `${d.name.nickname} ${d.name.last}`
        : `${d.name.first} ${d.name.last}`;
    const fullName = [d.name.first, d.name.middle, d.name.last].filter(Boolean).join(' ');

    const photoHTML = d.image
        ? `<img class="profile-photo" src="${d.image}" alt="${d.imageCaption || ''}">`
        : '';

    const coursesRowsHTML = d.courses.length
        ? d.courses.map(c => `
            <tr>
                <td>${c.dept}</td>
                <td>${c.number}</td>
                <td>${c.name}</td>
                <td>${c.reason}</td>
            </tr>`).join('')
        : '<tr><td colspan="4" style="color:var(--ink-light);">No courses added.</td></tr>';

    const platformStr = d.platform.length ? d.platform.join(', ') : '—';
    const osStr = d.os.length ? d.os.join(', ') : '—';

    return `
        ${photoHTML}
        <div class="profile-name-line">${displayName}</div>
        <div class="profile-sub">
            ${d.mascotDescriptor} ${d.mascot} ${divider} ${displayName}
            ${d.displayHeading ? ' &nbsp;|&nbsp; ' + d.displayHeading : ''}
        </div>
        <div class="profile-sub">${d.initialsDate}${d.email ? ' &nbsp;|&nbsp; ' + d.email : ''}</div>

        <h3>Personal Statement</h3>
        <p>${d.personalStatement}</p>
        ${d.imageCaption ? `<p><em>${d.imageCaption}</em></p>` : ''}

        <h3>Favorite Quote</h3>
        <blockquote>${d.quote}<br><cite>— ${d.quoteAuthor}</cite></blockquote>

        <h3>Personal Background</h3>
        <p>${d.backgrounds.personal}</p>

        <h3>Professional Background</h3>
        <p>${d.backgrounds.professional}</p>

        <h3>Academic Background</h3>
        <p>${d.backgrounds.academic}</p>

        <h3>Something to Remember Me</h3>
        <p>${d.backgrounds.funny}</p>

        ${d.backgrounds.additional ? `<h3>Also</h3><p>${d.backgrounds.additional}</p>` : ''}

        <h3>Setup</h3>
        <p><strong>Platform:</strong> ${platformStr} &nbsp;|&nbsp; <strong>OS:</strong> ${osStr}</p>
        <p><strong>Work Location:</strong> ${d.workLocation}</p>
        <p><strong>Backup Plan:</strong> ${d.backupPlan}</p>

        <h3>Courses</h3>
        <table>
            <thead>
                <tr><th>Dept</th><th>#</th><th>Course Name</th><th>Reason</th></tr>
            </thead>
            <tbody>${coursesRowsHTML}</tbody>
        </table>
    `;
}

/* ================================================================
   LOAD SAMPLE
   ================================================================ */
function loadSample() {
    setField('f-name',               'Jane');
    setField('m-name',               'A');
    setField('l-name',               'Doe');
    setField('p-name',               'Jay');
    setField('divider',              '|');
    setField('mascot-adj',           'Quizzical');
    setField('mascot-noun',          'Cat');
    setField('display-heading',      'CS Student | Developer');
    setField('email',                'jane@example.com');
    setField('initials-date',        'JD - 04/10/2026');
    setField('image-url',            '');
    setField('picture-caption',      'Smiling at the camera in front of a whiteboard');
    setTextarea('personal-statement','I\'m a developer and educator who loves teaching people how to reason with code and algorithms. I enjoy hands-on projects, open-source collaboration, and coffee while debugging.');
    setField('quote',                'Simplicity is the soul of efficiency.');
    setField('quote-author',         'Austin Freeman');
    setTextarea('pers-background',   'Grew up near the Andes; enjoys trekking, photography, and local cuisine.');
    setTextarea('professional-background', '5 years as a software engineer, 3 years as a curriculum developer for introductory CS courses.');
    setTextarea('academic-background', 'BSc in Computer Science; ongoing study in human-centered computing.');
    setTextarea('funny-thing',       'Once taught a class of llamas to debug a loop');
    setTextarea('additional',        'Prefers quinoa snacks and composes multilingual commit messages (12 languages)');
    setField('work-location',        'Home office');
    setTextarea('backup-plan',       'Use campus lab machine; phone hotspot and basic editor; keep code in cloud repo.');

    // Platform & OS checkboxes
    setCheckboxes('platform', ['Laptop']);
    setCheckboxes('os', ['macOS']);

    // Clear existing courses and add sample rows
    document.getElementById('courses-list').innerHTML = '';
    courseCount = 0;
    addCourseRow();
    fillLastCourseRow('CS', '101', 'Intro to Programming', 'Required for major');
    addCourseRow();
    fillLastCourseRow('MATH', '201', 'Calculus II', 'Core requirement');
}

function setField(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value;
}

function setTextarea(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value;
}

function setCheckboxes(name, values) {
    document.querySelectorAll(`input[name="${name}"]`).forEach(cb => {
        cb.checked = values.includes(cb.value);
    });
}

function fillLastCourseRow(dept, num, name, reason) {
    const rows = document.querySelectorAll('#courses-list tr');
    const last = rows[rows.length - 1];
    if (!last) return;
    const inputs = last.querySelectorAll('input');
    if (inputs[0]) inputs[0].value = dept;
    if (inputs[1]) inputs[1].value = num;
    if (inputs[2]) inputs[2].value = name;
    if (inputs[3]) inputs[3].value = reason;
}

/* ================================================================
   CLEAR
   ================================================================ */
function handleClear() {
    form.querySelectorAll('input[type="text"], input[type="date"]')
        .forEach(el => { el.value = ''; });
    form.querySelectorAll('textarea')
        .forEach(el => { el.value = ''; });
    form.querySelectorAll('input[type="checkbox"]')
        .forEach(el => { el.checked = false; });
    form.querySelectorAll('input[type="file"]')
        .forEach(el => { el.value = ''; });
    handleClearImage();
    document.getElementById('courses-list').innerHTML = '';
    courseCount = 0;
}

function handleClearImage() {
    imageDataURL = null;
    pictureInput.value = '';
    imageUrlInput.value = '';
    imagePreview.src = '';
    imagePreviewWrap.style.display = 'none';
}

/* ================================================================
   RESET (from preview back to form)
   ================================================================ */
function handleReset() {
    previewPanel.classList.add('hidden');
    form.classList.remove('hidden');
    form.scrollIntoView({ behavior: 'smooth' });
}