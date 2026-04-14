function addRow() {
    const tbody = document.getElementById('course-body');
    const rowCount = tbody.rows.length + 1;
    const row = `
        <tr>
            <td>${rowCount}</td>
            <td><input type="text" name="dept[]"></td>
            <td><input type="text" name="num[]"></td>
            <td><input type="text" name="name[]"></td>
            <td><input type="text" name="reason[]"></td>
            <td><button class="delete-btn">X</button></td>
        </tr>`;
    tbody.insertAdjacentHTML('beforeend', row);
}

form.addEventListener('submit', function(e) {
    e.preventDefault();  // this stops the URL thing
    handleGenerate();
});