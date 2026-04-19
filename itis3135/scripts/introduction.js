window.onload = function() {
    // 1. DOM Elements
    const addButton = document.getElementById("add-row");
    const instructions = document.getElementById("form-instructions");
    const jsonBtn = document.getElementById("download-json");
    const htmlBtn = document.getElementById("generate-html");
    const form = document.querySelector("form");
    const tableBody = document.getElementById("course-body");
    const outputArea = document.getElementById("output-area");

    // 2. Helper Function
    const val = (id) => document.getElementById(id) ? document.getElementById(id).value : "";

    // 3. Central Data Gatherer
    function getIntroductionData() {
        const courses = [];
        tableBody.querySelectorAll("tr").forEach((row) => {
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

        const fName = val("f-name");
        const mName = val("m-name");
        const lName = val("l-name");
        const fullName = `${fName} ${mName} ${lName}`.replace(/\s+/g, ' ').trim();
        const nickname = val("n-name");
        const divider = val("divider");
        const mascotDesc = val("mascot-desc");
        const mascotAnimal = val("mascot");
        
        const displayTitle = `${fullName}${nickname ? ` "${nickname}"` : ''} ${divider} ${mascotDesc} ${mascotAnimal}`;

        return {
            fullName,
            displayTitle,
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
            funFacts: {
                funnyThing: val("fun-facts"),
                anythingElse: val("share-something")
            },
            links: {
                github: val("github-profile"),
                portfolio: val("personal-page"),
                linkedin: val("linkedin-profile"),
                freecodecamp: val("freeCodeCamp"),
                other: val("other-link")
            },
            ackDate: val("acknowledge-date"),
            courses: courses
        };
    }

    // 4. TABLE LOGIC
    function createRow(dept = "", num = "", name = "", reason = "") {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${tableBody.rows.length + 1}</td>
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

    const initialCourses = [
        { dept: "ITIS", num: "3135", name: "Front-End Web App Development", reason: "Required. Also something I'm very interested in." },
        { dept: "ITIS", num: "3310", name: "Software Architecture & Design", reason: "Required" },
        { dept: "ITSC", num: "3146", name: "Introduction to Operating Systems & Networking", reason: "Required; 2181 got me interested in learning more about operating systems." },
        { dept: "ITSC", num: "3155", name: "Software Engineering", reason: "Required; career prep." },
        { dept: "STAT", num: "2122", name: "Introduction to Probability & Statistics", reason: "Required." }
    ];
    
    tableBody.innerHTML = ""; 
    initialCourses.forEach((c) => createRow(c.dept, c.num, c.name, c.reason));

    if (addButton) {
        addButton.onclick = () => createRow();
    }

    // UPDATED: Now creates raw <a> tags instead of <li> list items
    const buildLink = (url, text) => url ? `<a href="${url}" target="_blank">${text}</a>` : '';

    // 5. SUBMIT & RESET BUTTONS
    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            const data = getIntroductionData();
            const courseList = data.courses.map((c) => `<li><strong>${c.dept} ${c.number} - ${c.name}:</strong> ${c.reason}</li>`).join("");
            
            // UPDATED: Collects links into an array, drops empty ones, and joins with " | "
            const linksArray = [
                buildLink(data.links.github, "GitHub Profile"),
                buildLink(data.links.portfolio, "Personal Website"),
                buildLink(data.links.linkedin, "LinkedIn Profile"),
                buildLink(data.links.freecodecamp, "freeCodeCamp Profile"),
                buildLink(data.links.other, "Other Link")
            ].filter(Boolean);
            const footerLinks = linksArray.join(' | ');

            outputArea.innerHTML = `
                <hr>
                <header>
                    <h2>${data.displayTitle}</h2>
                </header>
                <figure>
                    <img src="${data.photoUrl}" alt="${data.photoCaption}" style="max-width:300px; border-radius: 8px;">
                    <figcaption>${data.photoCaption}</figcaption>
                </figure>
                <p>${data.statement}</p>
                
                <h3>Background & Workstations</h3>
                <ul>
                    <li><strong>Personal Background:</strong> ${data.background.personal}</li>
                    <li><strong>Professional Background:</strong> ${data.background.professional}</li>
                    <li><strong>Academic Background:</strong> ${data.background.academic}</li>
                    <li><strong>Background in Subject:</strong> ${data.background.subject}</li>
                    <li><strong>Primary Computer:</strong> ${data.workstations.primary}</li>
                    <li><strong>Backup Computer:</strong> ${data.workstations.backup}</li>
                </ul>

                <h3>Fun Facts</h3>
                <ul>
                    <li><strong>Funny thing:</strong> ${data.funFacts.funnyThing}</li>
                    <li><strong>Anything else to share?</strong> ${data.funFacts.anythingElse}</li>
                </ul>

                <h3>Courses</h3>
                <ul>${courseList}</ul>

                <p><em>"${data.quote}" — ${data.author}</em></p>
                
                <hr>
                <footer style="text-align: center; margin-bottom: 20px;">
                    <nav>
                        ${footerLinks}
                    </nav>
                </footer>

                <button type="button" onclick="location.reload()">Reset Form</button>
            `;
            document.getElementById("form-area").style.display = "none";
            if (instructions) instructions.style.display = "none";
        };

        form.onreset = function() {
            tableBody.innerHTML = ""; 
            initialCourses.forEach((c) => createRow(c.dept, c.num, c.name, c.reason));
        };
    }

    // 6. JSON BUTTON
    if (jsonBtn) {
        jsonBtn.onclick = function() {
            const data = getIntroductionData();
            outputArea.innerHTML = `
                <hr><h3>JSON Data Output</h3>
                <textarea style="width:100%; height:300px; font-family:monospace; padding:10px;" readonly>${JSON.stringify(data, null, 4)}</textarea>
                <br><br><button type="button" onclick="location.reload()">Return to Form</button>
            `;
            document.getElementById("form-area").style.display = "none";
            if (instructions) instructions.style.display = "none";
        };
    }

    // 7. HTML BUTTON 
    if (htmlBtn) {
        htmlBtn.onclick = function() {
            const data = getIntroductionData();
            const courseItems = data.courses.map((c) => `            <li><strong>${c.dept} ${c.number} - ${c.name}:</strong> ${c.reason}</li>`).join('\n');
            
            // UPDATED: Collects links into an array for the HTML generator
            const linksArray = [
                buildLink(data.links.github, "GitHub Profile"),
                buildLink(data.links.portfolio, "Personal Website"),
                buildLink(data.links.linkedin, "LinkedIn Profile"),
                buildLink(data.links.freecodecamp, "freeCodeCamp Profile"),
                buildLink(data.links.other, "Other Link")
            ].filter(Boolean);
            const footerLinks = linksArray.join('\n            | ');

            const rawHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${data.fullName} | Introduction</title>
</head>
<body>
    <header>
        <h1>${data.displayTitle}</h1>
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
            <h3>Background & Workstations</h3>
            <ul>
                <li><strong>Personal:</strong> ${data.background.personal}</li>
                <li><strong>Professional:</strong> ${data.background.professional}</li>
                <li><strong>Academic:</strong> ${data.background.academic}</li>
                <li><strong>Subject:</strong> ${data.background.subject}</li>
                <li><strong>Primary PC:</strong> ${data.workstations.primary}</li>
                <li><strong>Backup PC:</strong> ${data.workstations.backup}</li>
            </ul>
        </section>

        <section>
            <h3>Fun Facts</h3>
            <ul>
                <li><strong>Funny thing:</strong> ${data.funFacts.funnyThing}</li>
                <li><strong>Anything else to share?</strong> ${data.funFacts.anythingElse}</li>
            </ul>
        </section>

        <section>
            <h3>Courses I'm Taking</h3>
            <ul>
${courseItems}
            </ul>
        </section>

        <section>
            <h3>Favorite Quote</h3>
            <blockquote>"${data.quote}"<cite> — ${data.author}</cite></blockquote>
        </section>
    </main>
    
    <hr>
    <footer style="text-align: center;">
        <nav>
            ${footerLinks}
        </nav>
    </footer>
</body>
</html>`;
            
            outputArea.innerHTML = `
                <hr><h3>HTML Source Output</h3>
                <textarea style="width:100%; height:400px; font-family:monospace; padding:10px;" readonly>${rawHtml.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</textarea>
                <br><br><button type="button" onclick="location.reload()">Return to Form</button>
            `;
            document.getElementById("form-area").style.display = "none";
            if (instructions) instructions.style.display = "none";
        };
    }
};