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
        htmlBtn.onclick = function() {
            const data = getIntroductionData();
            const rawHtml = `<h1>${data.name}</h1>\n<p>${data.statement}</p>\n<ul>\n${data.courses.map(c => `  <li>${c.dept} ${c.number}: ${c.name}</li>`).join('\n')}\n</ul>`;
            
            outputArea.innerHTML = `
                <hr><h3>HTML Source Output</h3>
                <textarea style="width:100%; height:300px; font-family:monospace;" readonly>${rawHtml.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</textarea>
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
};