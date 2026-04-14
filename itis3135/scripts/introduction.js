function addCourse() {
    const table = document.getElementById("course-table").getElementsByTagName('tbody')[0];
    const rowCount = table.rows.length + 1;
    const row = table.insertRow();

    row.innerHTML = `
        <td>${rowCount}</td>
        <td><input type="text" name="dept[]" placeholder="itis" required></td>
        <td><input type="number" name="num[]" placeholder="3135" required></td>
        <td><input type="text" name="name[]" placeholder="Course Name" required></td>
        <td><input type="text" name="reason[]" placeholder="Reason" required></td>
        <td><button type="button" onclick="this.parentElement.parentElement.remove()">Delete</button></td>
    `;
}


form.addEventListener('submit', function(e) {
    e.preventDefault();  // this stops the URL thing
    handleGenerate();
});

