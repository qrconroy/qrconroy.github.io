let courseCount = 0;

function createCourseRow(dept='', num='', name='', reason='') {
    courseCount++;
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td class="row-num"></td>
        <td><input type="text" value="${dept}" placeholder="e.g., CS"></td>
        <td><input type="text" value="${num}"  placeholder="e.g.,"></td>
        <td><input type="text" value="${name}" placeholder="Course title"></td>
        <td><input type="text" value="${reason}" placeholder="Reason for taking"></td>
        <td>
            <button type="button" class="btn-up">↑</button>
            <button type="button" class="btn-add">+</button>
            <button type="button" class="btn-remove">×</button>
        </td>
    `;

    // Move up: swap this row with the one above it
    tr.querySelector('.btn-up').addEventListener('click', () => {
        const prev = tr.previousElementSibling;
        if (prev) tbody.insertBefore(tr, prev);
        renumberRows();
    });

    // Insert a new blank row directly below this one
    tr.querySelector('.btn-add').addEventListener('click', () => {
        const newRow = createCourseRow();
        tr.insertAdjacentElement('afterend', newRow);
        renumberRows();
    });

    // Remove this row
    tr.querySelector('.btn-remove').addEventListener('click', () => {
        tr.remove();
        renumberRows();
    });

    return tr;
}

// Walk all rows and update the number in the first cell
function renumberRows() {
    document.querySelectorAll('#courses-list tr').forEach((tr, i) => {
        tr.querySelector('.row-num').textContent = i + 1;
    });
}
const tbody = document.getElementById('courses-list');

const defaults = [
    ['ITIS', '3135', 'Front-End Web App Development', 'Required; Something I’m very interested in as well.'],
    ['ITIS', '3310', 'Architecture & Design', 'Required.'],
    ['ITSC', '3146', 'Introduction to Operating Systems & Networking', "Required; 2181 got me interested in learning more about operating systems and how my software actually interacts with the hardware of the computer."],
    ['ITSC', '3155', 'Software Engineering', "Required; good to learn more about what my job will probably look like once I graduate."],
    ['STAT', '2122', 'Introduction to Probability & Statistics', "Required."],
];

defaults.forEach(([dept, num, name, reason]) => {
    tbody.appendChild(createCourseRow(dept, num, name, reason));
});
renumberRows();

