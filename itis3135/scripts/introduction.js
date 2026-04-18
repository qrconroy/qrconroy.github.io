window.onload = function() {
    const addButton = document.getElementById("add-row");
    const tableBody = document.getElementById("course-body");

    // Function to create a row (Reusable for pre-filling and the button)
    function createRow(dept = "", num = "", name = "", reason = "") {
        const row = tableBody.insertRow();
        const rowCount = tableBody.rows.length;

        row.innerHTML = `
            <td>${rowCount}</td>
            <td><input type="text" name="dept[]" value="${dept}" placeholder="itis" required></td>
            <td><input type="number" name="num[]" value="${num}" placeholder="3135" required></td>
            <td><input type="text" name="name[]" value="${name}" placeholder="Course Name" required></td>
            <td><input type="text" name="reason[]" value="${reason}" placeholder="Reason" required></td>
            <td><button type="button" onclick="this.closest('tr').remove(); updateRowNumbers();">Delete</button></td>
        `;
    }

    // Helper to keep row numbers (#) accurate after a deletion
    window.updateRowNumbers = function() {
        const rows = tableBody.querySelectorAll("tr");
        rows.forEach((row, index) => {
            row.cells[0].innerText = index + 1;
        });
    };

    // 1. Pre-fill with 4 courses on load
    const initialCourses = [
        { dept: "ITIS", num: "3135", name: "Front-End Web App Development", reason: "Required. Also something I'm very interested in." },
        { dept: "ITIS", num: "3310", name: "Software Architecture & Design", reason: "Required" },
        { dept: "ITSC", num: "3146", name: "Introduction to Operating Systems & Networking", reason: "Required; 2181 got me interested in learning more about operating systems and how my software actually interacts with the hardware of the computer." },
        { dept: "ITSC", num: "3155", name: "Software Engineering", reason: "Required; good to learn more about what my job will probably look like once I graduate." },
        { dept: "STAT", num: "2122", name: "Introduction to Probability & Statistics", reason: "Required." }
    ];

    initialCourses.forEach(course => {
        createRow(course.dept, course.num, course.name, course.reason);
    });

    // 2. Add button functionality
    addButton.onclick = function() {
        createRow();
    };

    // 3. Form Submission
    const form = document.querySelector("form");
    form.onsubmit = function(e) {
        e.preventDefault();
        console.log("Form submitted successfully!");
    };
};