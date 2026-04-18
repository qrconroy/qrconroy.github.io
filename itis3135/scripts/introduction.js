window.onload = function() {
    // 1. Link Buttons
    const addButton = document.getElementById("add-row");
    const jsonBtn = document.getElementById("download-json");
    const htmlBtn = document.getElementById("generate-html");
    const form = document.querySelector("form");
    const tableBody = document.getElementById("course-body");
    const outputArea = document.getElementById("output-area");

    // 2. Helper: Get value safely
    const val = (id) => document.getElementById(id) ? document.getElementById(id).value : "";

    // 3. Data Gathering Function (Updated to include Quote)
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
            firstName: val("f-name"),
            middleName: val("m-name"),
            lastName: val("l-name"),
            fullName: `${val("f-name")} ${val("m-name")} ${val("l-name")}`.replace(/\s+/g, ' ').trim(),
            nickname: val("n-name"),
            divider: val("divider"),
            mascotDesc: val("mascot-desc"),
            mascotAnimal: val("mascot"),
            statement: val("personal-statement"),
            quote: val("favorite-quote"),
            author: val("quote-author"),
            photoUrl: val("photo-url") || "https://qrconroy.github.io/itis3135/images/quinn.jpg",
            photoCaption: val("photo-caption") || "Quinn Conroy",
            background: {
                personal: val("personal-background"),
                professional: val("professional-background"),
                academic: val("academic-background"),
                subject: val("subject-background")
            },
            workstations: {
                primary: val("primary-workstation"),
                backup: val("backup-workstation")
            },
            ackDate: val("acknowledge-date"),
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
                <textarea style="width:100%; height:300px; font-family:monospace; padding:10px;" readonly>${jsonString}</textarea>
                <br><button type="button" onclick="location.reload()">Return to Form</button>
            `;
            document.getElementById("form-area").style.display = "none";
        };
    }

    // 5. HTML Button Logic (Updated with Quote section)
    if (htmlBtn) {
        htmlBtn.onclick = function() {
            const data = getIntroductionData();
            const displayTitle = `${data.fullName}${data.nickname ? ` "${data.nickname}"` : ''} ${data.divider} ${data.mascotDesc} ${data.mascotAnimal}`;

            const courseItems = data.courses.map(c => 
                `        <li><strong>${c.dept} ${c.number} - ${c.name}:</strong> ${c.reason}</li>`
            ).join('\n');
            
            const rawHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${data.fullName} | ${data.mascotAnimal}</title>
</head>
<body>
    <header>
        <h1>${displayTitle}</h1>
    </header>
    <main>
        <figure>
            <img src="${data.photoUrl}" alt="${data.photoCaption}" style="max-width:300px;">
            <figcaption>${data.photoCaption}</figcaption>
        </figure>

        <section>
            <h3>Personal Statement</h3>
            <p>${data.statement}</p>
        </section>

        <section>
            <h3>Favorite Quote</h3>
            <blockquote>
                "${data.quote}"
                <cite>— ${data.author}</cite>
            </blockquote>
        </section>

        <section>
            <h3>Background</h3>
            <ul>
                <li><strong>Personal:</strong> ${data.background.personal}</li>
                <li><strong>Professional:</strong> ${data.background.professional}</li>
                <li><strong>Academic:</strong> ${data.background.academic}</li>
                <li><strong>Subject:</strong> ${data.background.subject}</li>
            </ul>
        </section>

        <section>
            <h3>Workstations</h3>
            <p><strong>Primary:</strong> ${data.workstations.primary}</p>
            <p><strong>Backup:</strong> ${data.workstations.backup}</p>
        </section>

        <section>
            <h3>Courses I'm Taking</h3>
            <ul>
${courseItems}
            </ul>
        </section>

        <footer>
            <p><em>I certified this information on ${data.ackDate}</em></p>
        </footer>
    </main>
</body>
</html>`;
            
            outputArea.innerHTML = `
                <hr><h3>HTML Source Output</h3>
                <textarea style="width:100%; height:400px; font-family:monospace; padding:10px;" readonly>${rawHtml.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</textarea>
                <br><button type="button" onclick="location.reload()">Return to Form</button>
            `;
            document.getElementById("form-area").style.display = "none";
        };
    }

    // 6. Form Submit Logic (Visual Preview Updated)
    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            const data = getIntroductionData();
            outputArea.innerHTML = `
                <hr>
                <h2>Preview</h2>
                <p><strong>Name:</strong> ${data.fullName}</p>
                <p><strong>Mascot:</strong> ${data.mascotDesc} ${data.mascotAnimal}</p>
                <p><strong>Quote:</strong> "${data.quote}" - ${data.author}</p>
                <p><strong>Statement:</strong> ${data.statement}</p>
                <button type="button" onclick="location.reload()">Back</button>
            `;
            document.getElementById("form-area").style.display = "none";
        };
    }

    // 7. Table Management Functions
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

    // Pre-fill initial courses
    const initialCourses = [
        { dept: "ITIS", num: "3135", name: "Front-End Web App Development", reason: "Required. Also something I'm very interested in." },
        { dept: "ITIS", num: "3310", name: "Software Architecture & Design", reason: "Required" },
        { dept: "ITSC", num: "3146", name: "Introduction to Operating Systems & Networking", reason: "Required; 2181 got me interested in learning more about operating systems." },
        { dept: "ITSC", num: "3155", name: "Software Engineering", reason: "Required; career prep." },
        { dept: "STAT", num: "2122", name: "Introduction to Probability & Statistics", reason: "Required." }
    ];
    initialCourses.forEach(c => createRow(c.dept, c.num, c.name, c.reason));

    addButton.onclick = () => createRow();
};
