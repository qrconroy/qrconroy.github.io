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
const tbody            = document.getElementById('courses-list');
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
   COURSE ROWS
   ================================================================ */
function createCourseRow(dept='', num='', name='', reason='') {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td class="row-num"></td>
        <td><input type="text" value="${dept}"   placeholder="e.g., CS"></td>
        <td><input type="text" value="${num}"    placeholder="e.g.,"></td>
        <td><input type="text" value="${name}"   placeholder="Course title"></td>
        <td><input type="text" value="${reason}" placeholder="Reason for taking"></td>
        <td>
            <button type="button" class="btn-up">↑</button>
            <button type="button" class="btn-add">+</button>
            <button type="button" class="btn-remove">×</button>
        </td>
    `;

    tr.querySelector('.btn-up').addEventListener('click', () => {
        const prev = tr.previousElementSibling;
        if (prev) tbody.insertBefore(tr, prev);
        renumberRows();
    });

    tr.querySelector('.btn-add').addEventListener('click', () => {
        tr.insertAdjacentElement('afterend', createCourseRow());
        renumberRows();
    });

    tr.querySelector('.btn-remove').addEventListener('click', () => {
        tr.remove();
        renumberRows();
    });

    return tr;
}

function renumberRows() {
    tbody.querySelectorAll('tr').forEach((tr, i) => {
        tr.querySelector('.row-num').textContent = i + 1;
    });
}

/* ================================================================
   EVENT LISTENERS
   ================================================================ */
form.addEventListener('submit', function(e) {
    e.preventDefault();
    handleGenerate();
});

document.getElementById('add-course-link').addEventListener('click', (e) => {
    e.preventDefault();
    tbody.appendChild(createCourseRow());
    renumberRows();
});

clearBtn.addEventListener('click', handleClear);
clearBtn2.addEventListener('click', handleClear);
loadSampleBtn.addEventListener('click', loadSample);
loadSampleBtn2.addEventListener('click', loadSample);
clearImageBtn.addEventListener('click', handleClearImage);

pictureInput.addEventListener('change', function() {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        imageDataURL = e.target.result;
        imagePreview.src = imageDataURL;
        imagePreviewWrap.classList.remove('hidden');
        imageUrlInput.value = '';
    };
    reader.readAsDataURL(file);
});

imageUrlInput.addEventListener('input', function() {
    if (this.value.trim()) {
        pictureInput.value = '';
        imageDataURL = null;
        imagePreviewWrap.classList.add('hidden');
    }
});

/* ================================================================
   GATHER DATA
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
    tbody.querySelectorAll('tr').forEach(tr => {
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
   GENERATE
   ================================================================ */
function handleGenerate() {
    const data = gatherData();
    document.getElementById('json-output').textContent = JSON.stringify(data, null, 2);
    document.getElementById('html-output').innerHTML = buildProfileHTML(data);
    previewPanel.classList.remove('hidden');
    previewPanel.scrollIntoView({ behavior: 'smooth' });
}

/* ================================================================
   BUILD PROFILE HTML
   ================================================================ */
function buildProfileHTML(d) {
    const divider     = d.divider || '|';
    const displayName = d.name.nickname
        ? `${d.name.nickname} ${d.name.last}`
        : `${d.name.first} ${d.name.last}`;

    const photoHTML = d.image
        ? `<img class="profile-img" src="${d.image}" alt="${d.imageCaption || ''}">`
        : '';

    const courseRows = d.courses.length
        ? d.courses.map((c, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${c.dept}</td>
                <td>${c.number}</td>
                <td>${c.name}</td>
                <td>${c.reason}</td>
            </tr>`).join('')
        : `<tr><td colspan="5" style="color:#999;">No courses added.</td></tr>`;

    const additionalHTML = d.backgrounds.additional
        ? `<h2>Also</h2><p>${d.backgrounds.additional}</p>`
        : '';

    return `
        <div class="clearfix">
            ${photoHTML}
            <h1>${displayName}</h1>
            <p><strong>${d.mascotDescriptor} ${d.mascot}</strong> ${divider} ${displayName}
            ${d.displayHeading ? divider + ' ' + d.displayHeading : ''}</p>
            <p style="color:#888; font-size:12px;">${d.initialsDate}
            ${d.email ? '| <a href="mailto:' + d.email + '">' + d.email + '</a>' : ''}</p>
        </div>

        <h2>Personal Statement</h2>
        <p>${d.personalStatement}</p>
        ${d.imageCaption ? `<p><em>${d.imageCaption}</em></p>` : ''}

        <h2>Favorite Quote</h2>
        <blockquote>&ldquo;${d.quote}&rdquo;<br><cite>&mdash; ${d.quoteAuthor}</cite></blockquote>

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
        <p><strong>Platform:</strong> ${d.platform.join(', ') || '—'}
           &nbsp;&nbsp;<strong>OS:</strong> ${d.os.join(', ') || '—'}</p>
        <p><strong>Work Location:</strong> ${d.workLocation}</p>
        <p><strong>Backup Plan:</strong> ${d.backupPlan}</p>

        <h2>Courses</h2>
        <table>
            <thead>
                <tr><th>#</th><th>Dept</th><th>#</th><th>Course Name</th><th>Reason</th></tr>
            </thead>
            <tbody>${courseRows}</tbody>
        </table>
    `;
}

/* ================================================================
   LOAD SAMPLE
   ================================================================ */
function loadSample() {
    setVal('f-name',                  'Jane');
    setVal('m-name',                  'A');
    setVal('l-name',                  'Doe');
    setVal('p-name',                  'Jay');
    setVal('divider',                 '|');
    setVal('mascot-adj',              'Quizzical');
    setVal('mascot-noun',             'Cat');
    setVal('display-heading',         'CS Student | Developer');
    setVal('email',                   'jane@example.com');
    setVal('initials-date',           'JD - 04/10/2026');
    setVal('picture-caption',         'Smiling in front of a whiteboard');
    setVal('personal-statement',      "I'm a developer and educator who loves teaching people how to reason with code.");
    setVal('quote',                   'Simplicity is the soul of efficiency.');
    setVal('quote-author',            'Austin Freeman');
    setVal('pers-background',         'Grew up near the Andes; enjoys trekking and photography.');
    setVal('professional-background', '5 years as a software engineer.');
    setVal('academic-background',     'BSc in Computer Science.');
    setVal('funny-thing',             'Once taught a class of llamas to debug a loop');
    setVal('additional',              'Composes multilingual commit messages');
    setVal('work-location',           'Home office');
    setVal('backup-plan',             'Campus lab machine and phone hotspot.');
    setCheckboxes('platform', ['Laptop']);
    setCheckboxes('os',       ['macOS']);

    tbody.innerHTML = '';
    courseCount = 0;
    [
        ['ITIS',  '3135', 'Web Application Development',  'I need this to graduate.'],
        ['',      '',     '',                              ''],
        ['WEB',   '115',  'Advanced Markup and Scripting', "I'm majoring in full stack development."],
        ['ITSC',  '1110', 'Computer Science Principles',   "I'm a CS 3rd year and need an easy A."],
        ['SCUBA', '1111', 'Underwater Basket Weaving',     "Doesn't everyone take this?"],
    ].forEach(([dept, num, name, reason]) => {
        tbody.appendChild(createCourseRow(dept, num, name, reason));
    });
    renumberRows();
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

/* ================================================================
   CLEAR
   ================================================================ */
function handleClear() {
    form.querySelectorAll('input[type="text"]').forEach(el => el.value = '');
    form.querySelectorAll('textarea').forEach(el => el.value = '');
    form.querySelectorAll('input[type="checkbox"]').forEach(el => el.checked = false);
    handleClearImage();
    tbody.innerHTML = '';
    courseCount = 0;
    previewPanel.classList.add('hidden');
}

function handleClearImage() {
    imageDataURL = null;
    if (pictureInput) pictureInput.value = '';
    if (imageUrlInput) imageUrlInput.value = '';
    if (imagePreview) imagePreview.src = '';
    if (imagePreviewWrap) imagePreviewWrap.classList.add('hidden');
}

/* ================================================================
   SEED DEFAULT ROWS ON PAGE LOAD
   ================================================================ */
[
    ['ITIS',  '3135', 'Web Application Development',  'I need this to graduate.'],
    ['',      '',     '',                              ''],
    ['WEB',   '115',  'Advanced Markup and Scripting', "I'm majoring in full stack development."],
    ['ITSC',  '1110', 'Computer Science Principles',   "I'm a CS 3rd year and need an easy A."],
    ['SCUBA', '1111', 'Underwater Basket Weaving',     "Doesn't everyone take this?"],
].forEach(([dept, num, name, reason]) => {
    tbody.appendChild(createCourseRow(dept, num, name, reason));
});

renumberRows();

form.addEventListener('submit', function(e) {
    e.preventDefault();  // this stops the URL thing
    handleGenerate();
});