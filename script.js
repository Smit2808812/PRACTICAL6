
let students = [];
let filteredStudents = [];
let currentPage = 1;
const recordsPerPage = 5;
let sortAscending = true;

const search = document.getElementById("search");
const courseFilter = document.getElementById("courseFilter");
const sortBtn = document.getElementById("sortBtn");
const studentContainer = document.getElementById("studentContainer");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageNumber = document.getElementById("pageNumber");

async function loadStudents() {
    try {
        const response = await fetch("students.json");

        if (!response.ok) {
            throw new Error("Student data could not be loaded.");
        }

        students = await response.json();
        loading.style.display = "none";
        applyFilters();
    } catch (err) {
        loading.style.display = "none";
        error.textContent =
            "Unable to load records. Please check students.json and run the project using a local server.";
    }
}

function applyFilters() {
    const keyword = search.value.trim().toLowerCase();
    const selectedCourse = courseFilter.value;

    filteredStudents = students.filter(student => {
        const matchesKeyword =
            student.name.toLowerCase().includes(keyword) ||
            student.email.toLowerCase().includes(keyword) ||
            student.course.toLowerCase().includes(keyword);

        const matchesCourse =
            selectedCourse === "All" ||
            student.course === selectedCourse;

        return matchesKeyword && matchesCourse;
    });

    currentPage = 1;
    displayStudents();
}

function displayStudents() {
    studentContainer.innerHTML = "";

    const startIndex = (currentPage - 1) * recordsPerPage;
    const visibleStudents = filteredStudents.slice(
        startIndex,
        startIndex + recordsPerPage
    );

    if (visibleStudents.length === 0) {
        studentContainer.innerHTML = "<p>No matching students found.</p>";
    }

    visibleStudents.forEach(student => {
        const card = document.createElement("article");
        card.className = "student-card";

        const heading = document.createElement("h3");
        heading.textContent = student.name;
        card.appendChild(heading);

        const details = [
            ["Email", student.email],
            ["Mobile", student.mobile],
            ["Course", student.course],
            ["Academic Year", student.year]
        ];

        details.forEach(([label, value]) => {
            const paragraph = document.createElement("p");
            const strong = document.createElement("strong");

            strong.textContent = label + ": ";
            paragraph.appendChild(strong);
            paragraph.appendChild(document.createTextNode(value));
            card.appendChild(paragraph);
        });

        studentContainer.appendChild(card);
    });

    updatePagination();
}

function updatePagination() {
    const totalPages = Math.ceil(
        filteredStudents.length / recordsPerPage
    );

    pageNumber.textContent =
        `Page ${currentPage} of ${totalPages || 1}`;

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled =
        currentPage >= totalPages || totalPages === 0;
}

search.addEventListener("input", applyFilters);
courseFilter.addEventListener("change", applyFilters);

sortBtn.addEventListener("click", () => {
    filteredStudents.sort((a, b) => {
        return sortAscending
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
    });

    sortAscending = !sortAscending;
    sortBtn.textContent = sortAscending ? "Name Z-A" : "Name A-Z";

    currentPage = 1;
    displayStudents();
});

prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        displayStudents();
    }
});

nextBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(
        filteredStudents.length / recordsPerPage
    );

    if (currentPage < totalPages) {
        currentPage++;
        displayStudents();
    }
});

loadStudents();
