// This ensures the script waits for the HTML to load
window.onload = function() {
    
    // 1. Link the button by its ID: "add-row"
    const addButton = document.getElementById("add-row");
    
    // 2. Add the click event
    addButton.onclick = function() {
        const tableBody = document.getElementById("course-body");
        
        // Create the new row
        const row = tableBody.insertRow();
        const rowCount = tableBody.rows.length;

        // Insert the cells with the inputs you need
        row.innerHTML = `
            <td>${rowCount}</td>
            <td><input type="text" name="dept[]" placeholder="itis" required></td>
            <td><input type="number" name="num[]" placeholder="3135" required></td>
            <td><input type="text" name="name[]" placeholder="Course Name" required></td>
            <td><input type="text" name="reason[]" placeholder="Reason" required></td>
            <td><button type="button" onclick="this.closest('tr').remove()">Delete</button></td>
        `;
    };

    // 3. Handle the form submission
    const form = document.querySelector("form");
    form.onsubmit = function(e) {
        e.preventDefault();
        console.log("Form submitted successfully!");
        // If you have a handleGenerate function, call it here:
        // handleGenerate();
    };
};