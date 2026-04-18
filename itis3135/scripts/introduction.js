window.onload = function() {
    // 1. Link Buttons
    const addButton = document.getElementById("add-row");
    const jsonBtn = document.getElementById("download-json");
    const htmlBtn = document.getElementById("generate-html");
    const form = document.querySelector("form");
    const tableBody = document.getElementById("course-body");
    const outputArea = document.getElementById("output-area");

    // 2. Helper: Get value safely (prevents crashes if ID is missing)
    const val = (id) => document.getElementById(id) ? document.getElementById(id).value : "";

    // 3. Data Gathering Function
    function getIntroductionData() {
        const courses = [];
        tableBody.querySelectorAll("tr").forEach(row => {
            const inputs = row.querySelectorAll("input");
            if (inputs.length >= 4) {
                courses.push({
                    dept: inputs[0].value,
                    number: inputs[1].value,
                    name: inputs[2].value,
                    reason: inputs[3].value
                });
            }
        });

        return {
            name: `${val("f-name")} ${val("m-name")} ${val("l-name")}`.replace(/\s+/g, ' ').trim(),
            nickname: val("n-name"),
            mascot: `${val("mascot-desc")} ${val("mascot")}`,
            statement: val("personal-statement"),
            background: {
                personal: val("personal-background"),
                professional: val("professional-background"),
                academic: val("academic-background")
            },
            courses: courses
        };
    }

    // 4. JSON Button Logic
    if (jsonBtn) {
        jsonBtn.onclick = function() {
            const data = getIntroductionData();
            const jsonString = JSON.stringify(data, null, 4);
            outputArea.innerHTML = `
                <hr><h3>JSON Data Output</h3>
                <textarea style="width:100%; height:300px; font-family:monospace;" readonly>${jsonString}</textarea>
                <br><button type="button" onclick="location.reload()">Return to Form</button>
            `;
            document.getElementById("form-area").style.display = "none";
        };
    }

    // 5. HTML Button Logic
    if (htmlBtn) {
        // 5. HTML Button Action
    htmlBtn.onclick = function() {
        const data = getFormValues();
        
        // Grab the extra fields that were missing
        const nickname = document.getElementById("n-name").value;
        const divider = document.getElementById("divider").value;
        const mascotDesc = document.getElementById("mascot-desc").value;
        const mascotAnimal = document.getElementById("mascot").value;
        const photoUrl = document.getElementById("photo-url").value || "https://qrconroy.github.io/itis3135/images/quinn.jpg";
        const photoCaption = document.getElementById("photo-caption").value || "Quinn Conroy";
        const pBack = document.getElementById("personal-background").value;
        const profBack = document.getElementById("professional-background").value;
        const acadBack = document.getElementById("academic-background").value;
        const subjBack = document.getElementById("subject-background").value;
        const primaryComp = document.getElementById("primary-workstation").value;
        const backupComp = document.getElementById("backup-workstation").value;
        const ackDate = document.getElementById("acknowledge-date").value;

        const fullName = `${data.firstName} ${data.lastName}`;
        const displayTitle = `${fullName}${nickname ? ` "${nickname}"` : ''} ${divider} ${mascotDesc} ${mascotAnimal}`;

        // Create the course list items
        const courseItems = data.courses.map(c => 
            `        <li><strong>${c.dept} ${c.num} - ${c.name}:</strong> ${c.reason}</li>`
        ).join('\n');
        
        // The Full HTML Template
        const rawHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${fullName} | ${mascotAnimal}</title>
</head>
<body>
    <header>
        <h1>${displayTitle}</h1>
    </header>
    <main>
        <figure>
            <img src="${photoUrl}" alt="${photoCaption}" style="max-width:300px;">
            <figcaption>${photoCaption}</figcaption>
        </figure>

        <section>
            <h3>Personal Statement</h3>
            <p>${data.statement}</p>
        </section>

        <section>
            <h3>Background</h3>
            <ul>
                <li><strong>Personal:</strong> ${pBack}</li>
                <li><strong>Professional:</strong> ${profBack}</li>
                <li><strong>Academic:</strong> ${acadBack}</li>
                <li><strong>Subject:</strong> ${subjBack}</li>
            </ul>
        </section>

        <section>
            <h3>Workstations</h3>
            <p><strong>Primary:</strong> ${primaryComp}</p>
            <p><strong>Backup:</strong> ${backupComp}</p>
        </section>

        <section>
            <h3>Courses I'm Taking</h3>
            <ul>
${courseItems}
            </ul>
        </section>

        <footer>
            <p><em>I certified this information on ${ackDate}</em></p>
        </footer>
    </main>
</body>
</html>`;
        
        // Render to the screen
        outputArea.innerHTML = `
            <hr><h3>HTML Source Output</h3>
            <textarea style="width:100%; height:400px; font-family:monospace; padding:10px;" readonly>${rawHtml.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</textarea>
            <br><button type="button" onclick="location.reload()">Return to Form</button>
        `;
        document.getElementById("form-area").style.display = "none";
    };
    }

    // 6. Table Row Logic (Your existing working code)
    if (addButton) {
        addButton.onclick = function() {
            const row = tableBody.insertRow();
            row.innerHTML = `
                <td>${tableBody.rows.length}</td>
                <td><input type="text" name="dept[]" required></td>
                <td><input type="number" name="num[]" required></td>
                <td><input type="text" name="name[]" required></td>
                <td><input type="text" name="reason[]" required></td>
                <td><button type="button" onclick="this.closest('tr').remove()">Delete</button></td>
            `;
        };
    }

    // 7. Form Submit Logic
    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            const data = getIntroductionData();
            outputArea.innerHTML = `<hr><h2>Preview</h2><p><strong>Name:</strong> ${data.name}</p><p>${data.statement}</p><button type="button" onclick="location.reload()">Back</button>`;
            document.getElementById("form-area").style.display = "none";
        };
    }



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
};
