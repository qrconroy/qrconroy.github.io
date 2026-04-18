window.onload = function() {
    const addButton = document.getElementById("add-row");
    const tableBody = document.getElementById("course-body");

    // Helper to create rows (as established before)
    function createRow(dept = "", num = "", name = "", reason = "") {
        const row = tableBody.insertRow();
        const rowCount = tableBody.rows.length;
        row.innerHTML = `
            <td>${rowCount}</td>
            <td><input type="text" name="dept[]" value="${dept}" required></td>
            <td><input type="number" name="num[]" value="${num}" required></td>
            <td><input type="text" name="name[]" value="${name}" required></td>
            <td><input type="text" name="reason[]" value="${reason}" required></td>
            <td><button type="button" onclick="this.closest('tr').remove(); updateRowNumbers();">Delete</button></td>
        `;
    }

    window.updateRowNumbers = function() {
        const rows = tableBody.querySelectorAll("tr");
        rows.forEach((row, index) => { row.cells[0].innerText = index + 1; });
    };

    // Pre-fill 4 courses
    const initialCourses = [
        { dept: "ITIS", num: "3135", name: "Front-End Web App Development", reason: "Required. Also something I'm very interested in." },
        { dept: "ITIS", num: "3310", name: "Software Architecture & Design", reason: "Required" },
        { dept: "ITSC", num: "3146", name: "Introduction to Operating Systems & Networking", reason: "Required; 2181 got me interested in learning more about operating systems and how my software actually interacts with the hardware of the computer." },
        { dept: "ITSC", num: "3155", name: "Software Engineering", reason: "Required; good to learn more about what my job will probably look like once I graduate." },
        { dept: "STAT", num: "2122", name: "Introduction to Probability & Statistics", reason: "Required." }
    ];
    initialCourses.forEach(c => createRow(c.dept, c.num, c.name, c.reason));

    addButton.onclick = () => createRow();

    // --- NEW: Handle Submission and Generate Output ---
    // --- Handle Submission and Generate Output ---
    const form = document.querySelector("form");
    
    form.onsubmit = function(e) {
        e.preventDefault();
        
        // 1. Collect Personal Data
        const firstName = document.getElementById("f-name").value;
        const middleName = document.getElementById("m-name").value;
        const lastName = document.getElementById("l-name").value;
        const nickname = document.getElementById("n-name").value;
        const divider = document.getElementById("divider").value;
        const mascotDesc = document.getElementById("mascot-desc").value;
        const mascotAnimal = document.getElementById("mascot").value;
        const personalStatement = document.getElementById("personal-statement").value;
        const ackDate = document.getElementById("acknowledge-date").value;
        
        // Photo logic: Check the URL field first
        const photoUrl = document.getElementById("photo-url").value;
        const photoCaption = document.getElementById("photo-caption").value;

        // 2. Format the Header
        const fullName = `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`;
        const displayTitle = `${fullName}${nickname ? ` "${nickname}"` : ''} ${divider} ${mascotDesc} ${mascotAnimal}`;

        // 3. Build Course List HTML safely
        let courseHtml = "<ul>";
        const rows = tableBody.querySelectorAll("tr");
        rows.forEach(row => {
            const inputs = row.querySelectorAll("input");
            // Ensure we have the expected number of inputs before accessing
            if (inputs.length >= 4) {
                courseHtml += `<li><strong>${inputs[0].value} ${inputs[1].value} - ${inputs[2].value}:</strong> ${inputs[3].value}</li>`;
            }
        });
        courseHtml += "</ul>";

        // 4. Generate Output
        const outputArea = document.getElementById("output-area");
        outputArea.innerHTML = `
            <hr>
            <h2>${displayTitle}</h2>
            ${photoUrl ? `<figure><img src="${photoUrl}" alt="${photoCaption}" style="max-width:100%; height:auto;"><figcaption>${photoCaption}</figcaption></figure>` : ''}
            
            <p><strong>Personal Statement:</strong> ${personalStatement}</p>
            
            <p><strong>Background:</strong></p>
            <ul>
                <li><strong>Personal:</strong> ${document.getElementById("personal-background").value}</li>
                <li><strong>Professional:</strong> ${document.getElementById("professional-background").value}</li>
                <li><strong>Academic:</strong> ${document.getElementById("academic-background").value}</li>
                <li><strong>Subject:</strong> ${document.getElementById("subject-background").value}</li>
            </ul>

            <p><strong>Workstations:</strong></p>
            <ul>
                <li><strong>Primary:</strong> ${document.getElementById("primary-workstation").value}</li>
                <li><strong>Backup:</strong> ${document.getElementById("backup-workstation").value}</li>
            </ul>
            
            <p><strong>Courses I'm Taking:</strong></p>
            ${courseHtml}

            <p><em>I certified this information on ${ackDate}.</em></p>
            <button type="button" onclick="location.reload()">Fill out form again</button>
        `;

        // 5. Toggle Visibility
        document.getElementById("form-area").style.display = "none";
        // Scroll to top to see the result
        window.scrollTo(0, 0);
    };
};