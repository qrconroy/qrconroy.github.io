// 1. Wait for the DOM to load so the elements actually exist
document.addEventListener("DOMContentLoaded", function() {

    // 2. Define the button and the form
    const addBtn = document.getElementById("add-row");
    const introForm = document.querySelector("form");

    // 3. Attach the click event to the button
    addBtn.addEventListener("click", function() {
        const tableBody = document.getElementById("course-body");
        const rowCount = tableBody.rows.length + 1;
        const row = tableBody.insertRow();

        row.innerHTML = `
            <td>${rowCount}</td>
            <td><input type="text" name="dept[]" placeholder="itis" required></td>
            <td><input type="text" name="num[]" placeholder="3135" required></td>
            <td><input type="text" name="name[]" placeholder="Course Name" required></td>
            <td><input type="text" name="reason[]" placeholder="Reason" required></td>
            <td><button type="button" onclick="this.closest('tr').remove()">Delete</button></td>
        `;
    });

    // 4. Handle the form submission
    introForm.addEventListener('submit', function(e) {
        e.preventDefault(); 
        console.log("Form Submitted!");
        if (typeof handleGenerate === "function") {
            handleGenerate();
        } else {
            alert("The handleGenerate function isn't defined yet!");
        }
    });
});