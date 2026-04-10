/**
 * introduction.js
 * Handles all form logic for the Introduction Profile page.
 * Located at: Scripts/introduction.js
 */

/* ================================================================
   CONSTANTS & STATE
   ================================================================ */
let courseCount = 0;

const form         = document.getElementById('intro-form');
const profileCard  = document.getElementById('profile-card');
const addCourseBtn = document.getElementById('add-course-btn');
const clearBtn     = document.getElementById('clear-btn');

/* ================================================================
   EVENT LISTENERS
   Script is at the bottom of <body> so the DOM is already ready.
   ================================================================ */
form.addEventListener('submit', function (e) {
    e.preventDefault();
    handleSubmit();
});

form.addEventListener('reset', function () {
    handleReset();
});

clearBtn.addEventListener('click', handleClear);

addCourseBtn.addEventListener('click', addCourse);


/* ================================================================
   VALIDATION
   Validates all required fields; marks invalid ones and returns
   false when the form should NOT submit.
   ================================================================ */
function validateForm() {
    let valid = true;

    // Remove previous invalid state & error banner
    document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
    const oldBanner = document.querySelector('.error-banner');
    if (oldBanner) oldBanner.remove();

    // Check every required field
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (field.type === 'checkbox') {
            if (!field.checked) {
                field.closest('.checkbox-label')
                    .querySelector('.checkbox-custom')
                    .style.borderColor = '#c0392b';
                valid = false;
            }
        } else if (!field.value.trim()) {
            field.classList.add('invalid');
            valid = false;
        }
    });

    if (!valid) {
        // Show a banner at the top of the form
        const banner = document.createElement('div');
        banner.className = 'error-banner';
        banner.textContent = 'Please fill in all required fields (marked with *) before submitting.';
        form.insertBefore(banner, form.firstChild);
        form.scrollIntoView({ behavior: 'smooth' });
    }

    return valid;
}


/* ================================================================
   SUBMIT HANDLER
   Validates, gathers data, renders profile card, hides form.
   ================================================================ */
function handleSubmit() {
    const data = gatherFormData();
    renderProfileCard(data);

    // Hide the form
    form.classList.add('hidden');
    profileCard.classList.remove('hidden');
    profileCard.scrollIntoView({ behavior: 'smooth' });
}


/* ================================================================
   RESET HANDLER
   Clears courses, error banners, and invalid styles.
   Called by both type="reset" button and the profile "start over" link.
   ================================================================ */
function handleReset() {
    // The native reset event resets native inputs automatically.
    // We handle extras:
    clearCourses();

    document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
    document.querySelectorAll('.checkbox-custom').forEach(el => el.style.borderColor = '');
    const banner = document.querySelector('.error-banner');
    if (banner) banner.remove();

    // Show form, hide profile card
    form.classList.remove('hidden');
    profileCard.classList.add('hidden');
    profileCard.innerHTML = '';

    form.scrollIntoView({ behavior: 'smooth' });
}


/* ================================================================
   CLEAR HANDLER
   Clears every single field (including optional ones), courses,
   file inputs, checkboxes, and error state.
   ================================================================ */
function handleClear() {
    // Clear text / date / textarea inputs
    form.querySelectorAll('input[type="text"], input[type="date"], textarea')
        .forEach(el => { el.value = ''; el.classList.remove('invalid'); });

    // Clear file inputs
    form.querySelectorAll('input[type="file"]')
        .forEach(el => { el.value = ''; });

    // Uncheck checkboxes
    form.querySelectorAll('input[type="checkbox"]')
        .forEach(el => { el.checked = false; });

    // Reset checkbox custom style
    document.querySelectorAll('.checkbox-custom').forEach(el => el.style.borderColor = '');

    // Remove course entries
    clearCourses();

    // Remove any error banner
    const banner = document.querySelector('.error-banner');
    if (banner) banner.remove();
}


/* ================================================================
   COURSE MANAGEMENT
   ================================================================ */

/**
 * addCourse()
 * Creates a new course entry row with Department, Course #, and Reason fields.
 */
function addCourse() {
    courseCount++;
    const id = courseCount;

    const entry = document.createElement('div');
    entry.className = 'course-entry';
    entry.dataset.courseId = id;

    entry.innerHTML = `
        <div class="course-label">Course ${id}</div>
        <div class="field-row">
            <div class="field">
                <label for="course-dept-${id}">Department</label>
                <input type="text" id="course-dept-${id}" name="course-dept-${id}"
                       placeholder="e.g. CS">
            </div>
            <div class="field">
                <label for="course-num-${id}">Course #</label>
                <input type="text" id="course-num-${id}" name="course-num-${id}"
                       placeholder="e.g. 101">
            </div>
            <div class="field">
                <label for="course-reason-${id}">Reason for Taking</label>
                <input type="text" id="course-reason-${id}" name="course-reason-${id}"
                       placeholder="e.g. Required for major">
            </div>
        </div>
    `;

    // Delete button
    const deleteBtn = createDeleteButton(entry);
    entry.appendChild(deleteBtn);

    document.getElementById('courses-list').appendChild(entry);
}

/**
 * createDeleteButton(entryEl)
 * Creates and returns a delete button that removes its parent course entry.
 * @param {HTMLElement} entryEl – the course entry element to delete
 * @returns {HTMLButtonElement}
 */
function createDeleteButton(entryEl) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'delete-course-btn';
    btn.textContent = '✕ Remove';
    btn.setAttribute('aria-label', 'Remove this course');

    btn.addEventListener('click', function () {
        entryEl.remove();
    });

    return btn;
}

/**
 * clearCourses()
 * Removes all course entries and resets the counter.
 */
function clearCourses() {
    const list = document.getElementById('courses-list');
    if (list) list.innerHTML = '';
    courseCount = 0;
}


/* ================================================================
   GATHER FORM DATA
   Collects values from every field into a plain object.
   ================================================================ */
function gatherFormData() {
    const data = {};

    // Returns the field's value, or its placeholder if the field is empty
    const val = id => {
        const el = document.getElementById(id);
        if (!el) return '';
        return el.value.trim() || el.placeholder || '';
    };

    // Name
    data.firstName    = val('f-name');
    data.lastName     = val('l-name');
    data.prefName     = val('p-name');
    data.middleName   = val('m-name');

    // Acknowledgement
    data.ackChecked   = document.getElementById('acknowledgement').checked;
    data.ackDate      = val('ack-date');

    // Personalization
    data.mascotAdj    = val('mascot-adj');
    data.mascotNoun   = val('mascot-noun');
    data.divider      = val('divider');
    data.pictureCaption = val('picture-caption');
    data.personalStatement = val('personal-statement');

    // Portrait — create an object URL if a file was selected
    const fileInput = document.getElementById('picture');
    if (fileInput.files && fileInput.files[0]) {
        data.pictureURL = URL.createObjectURL(fileInput.files[0]);
    } else {
        data.pictureURL = null;
    }

    // Background
    data.persBackground     = val('pers-background');
    data.academicBackground = val('academic-background');
    data.professionalBackground = val('professional-background');
    data.subjectBackground  = val('subject-background');

    // Computer
    data.primaryComputer   = val('primary-computer');
    data.secondaryComputer = val('secondary-computer');

    // Courses
    data.courses = [];
    document.querySelectorAll('.course-entry').forEach(entry => {
        const cid = entry.dataset.courseId;
        const cval = id => {
            const el = document.getElementById(id);
            return el ? (el.value.trim() || el.placeholder || '') : '';
        };
        data.courses.push({
            dept:   cval(`course-dept-${cid}`),
            number: cval(`course-num-${cid}`),
            reason: cval(`course-reason-${cid}`),
        });
    });

    // Quote
    data.quote       = val('quote');
    data.quoteAuthor = val('quote-author');

    // Misc
    data.funnyThing = val('funny-thing');

    return data;
}


/* ================================================================
   RENDER PROFILE CARD
   Builds the HTML for the profile display and injects it.
   ================================================================ */
function renderProfileCard(data) {
    const displayName = data.prefName
        ? `${data.prefName} ${data.lastName}`
        : `${data.firstName} ${data.lastName}`;

    const fullName = [data.firstName, data.middleName, data.lastName]
        .filter(Boolean).join(' ');

    const mascot = `${data.mascotAdj} ${data.mascotNoun}`;
    const divider = data.divider || '|';

    // Portrait image or placeholder
    const photoHTML = data.pictureURL
        ? `<img class="profile-photo" src="${data.pictureURL}" alt="${data.pictureCaption}">`
        : `<div class="profile-photo-placeholder">No photo</div>`;

    // Courses
    let coursesHTML = '<p class="profile-text" style="color:var(--ink-light);">No courses added.</p>';
    if (data.courses.length > 0) {
        coursesHTML = data.courses.map(c => `
            <div class="course-card">
                <div class="course-card-code">${c.dept} ${c.number}</div>
                ${c.reason ? `<div class="course-card-reason">${c.reason}</div>` : ''}
            </div>
        `).join('');
    }

    // Computers
    const computers = [data.primaryComputer, data.secondaryComputer].filter(Boolean);
    const computersHTML = computers.map(c => `<span class="profile-tag">${c}</span>`).join('');

    // Funny thing
    const funnyHTML = data.funnyThing
        ? `<div class="profile-section">
               <h3 class="profile-section-title">Something Funny</h3>
               <p class="profile-text">${data.funnyThing}</p>
           </div>`
        : '';

    profileCard.innerHTML = `
        <div class="profile-wrapper">

            <!-- BANNER -->
            <div class="profile-banner">
                ${photoHTML}
                <div class="profile-header-text">
                    <div class="profile-name">${displayName}</div>
                    ${data.prefName ? `<div class="profile-mascot" style="font-size:12px; color:var(--ink-light); margin-top:.1rem;">Legal: ${fullName}</div>` : ''}
                    <div class="profile-mascot">${mascot} ${divider} ${displayName}</div>
                    <div class="profile-date">Acknowledged: ${data.ackDate}</div>
                </div>
            </div>

            <!-- BODY -->
            <div class="profile-body">

                <!-- PERSONAL STATEMENT -->
                <div class="profile-section">
                    <h3 class="profile-section-title">Personal Statement</h3>
                    <p class="profile-text">${data.personalStatement}</p>
                    ${data.pictureCaption ? `<p class="profile-text" style="font-size:11px; color:var(--ink-light); margin-top:.4rem;"><em>${data.pictureCaption}</em></p>` : ''}
                </div>

                <!-- BACKGROUND -->
                <div class="profile-section">
                    <h3 class="profile-section-title">Personal Background</h3>
                    <p class="profile-text">${data.persBackground}</p>
                </div>

                <div class="profile-section">
                    <h3 class="profile-section-title">Academic Background</h3>
                    <p class="profile-text">${data.academicBackground}</p>
                </div>

                <div class="profile-section">
                    <h3 class="profile-section-title">Professional Background</h3>
                    <p class="profile-text">${data.professionalBackground}</p>
                </div>

                <div class="profile-section">
                    <h3 class="profile-section-title">Subject Background</h3>
                    <p class="profile-text">${data.subjectBackground}</p>
                </div>

                <!-- COMPUTER -->
                <div class="profile-section">
                    <h3 class="profile-section-title">Computer(s)</h3>
                    <div>${computersHTML}</div>
                </div>

                <!-- COURSES -->
                <div class="profile-section">
                    <h3 class="profile-section-title">Courses</h3>
                    ${coursesHTML}
                </div>

                <!-- QUOTE -->
                <div class="profile-section">
                    <h3 class="profile-section-title">Favorite Quote</h3>
                    <blockquote class="profile-quote">
                        ${data.quote}
                        <cite>— ${data.quoteAuthor}</cite>
                    </blockquote>
                </div>

                <!-- MISC -->
                ${funnyHTML}

            </div>
        </div>

        <!-- RESET LINK -->
        <div class="profile-reset-link">
            <a id="profile-reset-link" role="button" tabindex="0">↩ Start over</a>
        </div>
    `;

    // Wire up the "Start over" link
    document.getElementById('profile-reset-link').addEventListener('click', function () {
        // Trigger native reset to clear all inputs
        form.dispatchEvent(new Event('reset'));
    });
    document.getElementById('profile-reset-link').addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            form.dispatchEvent(new Event('reset'));
        }
    });
}