window.onload = function() {
    const addButton = document.getElementById("add-row");
    const tableBody = document.getElementById("course-body");
    const form = document.querySelector("form");
    const jsonButton = document.getElementById("download-json");
    const htmlButton = document.getElementById("generate-html");
    const outputArea = document.getElementById("output-area");

    // 1. Helper to create rows
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
        { dept: "ITIS", num: "3135", name: "Front-End Web App Development", reason: "Required/Interest" },
        { dept: "ITIS", num: "3310", name: "Software Architecture & Design", reason: "Required" },
        { dept: "ITSC", num: "3146", name: "Operating Systems", reason: "Required" },
        { dept: "ITSC", num: "3155", name: "Software Engineering", reason: "Required" },
        { dept: "STAT", num: "2122", name: "Probability & Statistics", reason: "Required" }
    ];
    initialCourses.forEach(c => createRow(c.dept, c.num, c.name, c.reason));
    addButton.onclick = () => createRow();

    // 2. Data Gathering Function (Used by all buttons)
    function getFormData() {
        const courses = [];
        tableBody.querySelectorAll("tr").forEach(row => {
            const inputs = row.querySelectorAll("input");
            if (inputs.length >= 4) {
                courses.push({
                    dept: inputs[0].value,
                    num: inputs[1].value,
                    name: inputs[2].value,
                    reason: inputs[3].value
                });
            }
        });

        return {
            firstName: document.getElementById("f-name").value,
            middleName: document.getElementById("m-name").value,
            lastName: document.getElementById("l-name").value,
            nickname: document.getElementById("n-name").value,
            divider: document.getElementById("divider").value,
            mascotDesc: document.getElementById("mascot-desc").value,
            mascotAnimal: document.getElementById("mascot").value,
            statement: document.getElementById("personal-statement").value,
            personalBack: document.getElementById("personal-background").value,
            professionalBack: document.getElementById("professional-background").value,
            academicBack: document.getElementById("academic-background").value,
            subjectBack: document.getElementById("subject-background").value,
            primaryComp: document.getElementById("primary-workstation").value,
            backupComp: document.getElementById("backup-workstation").value,
            photoUrl: document.getElementById("photo-url").value || "https://qrconroy.github.io/itis3135/images/quinn.jpg",
            photoCaption: document.getElementById("photo-caption").value || "Quinn Conroy",
            ackDate: document.getElementById("acknowledge-date").value,
            courses: courses
        };
    }

    // 3. SUBMIT (Visual Preview)
    form.onsubmit = function(e) {
        e.preventDefault();
        const data = getFormData();
        const fullName = `${data.firstName} ${data.middleName ? data.middleName + ' ' : ''}${data.lastName}`;
        
        let courseList = "<ul>";
        data.courses.forEach(c => {
            courseList += `<li><strong>${c.dept} ${c.num} - ${c.name}:</strong> ${c.reason}</li>`;
        });
        courseList += "</ul>";

        outputArea.innerHTML = `
            <hr>
            <h2>${fullName}${data.nickname ? ` "${data.nickname}"` : ''} ${data.divider} ${data.mascotDesc} ${data.mascotAnimal}</h2>
            <figure><img src="${data.photoUrl}" alt="${data.photoCaption}" style="max-width:300px;"><figcaption>${data.photoCaption}</figcaption></figure>
            <p><strong>Statement:</strong> ${data.statement}</p>
            <p><strong>Primary Workstation:</strong> ${data.primaryComp}</p>
            ${courseList}
            <p><em>Certified on ${data.ackDate}</em></p>
            <button type="button" onclick="location.reload()">Reset</button>
        `;
        document.getElementById("form-area").style.display = "none";
    };

    // 4. JSON GENERATOR
    jsonButton.onclick = function() {
        const data = getFormData();
        const jsonString = JSON.stringify(data, null, 4);
        
        outputArea.innerHTML = `
            <hr><h3>JSON Data</h3>
            <textarea style="width:100%; height:300px; font-family:monospace;" readonly>${jsonString}</textarea>
            <p><button type="button" onclick="location.reload()">Reset</button></p>
        `;
        document.getElementById("form-area").style.display = "none";
    };

    // 5. HTML GENERATOR
    htmlButton.onclick = function() {
        const data = getFormData();
        const rawHtml = `<!DOCTYPE html>\n<html>\n<body>\n<h1>${data.firstName} ${data.lastName}</h1>\n<p>${data.statement}</p>\n</body>\n</html>`;
        
        outputArea.innerHTML = `
            <hr><h3>Raw HTML</h3>
            <textarea style="width:100%; height:300px; font-family:monospace;" readonly>${rawHtml.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</textarea>
            <p><button type="button" onclick="location.reload()">Reset</button></p>
        `;
        document.getElementById("form-area").style.display = "none";
    };
};