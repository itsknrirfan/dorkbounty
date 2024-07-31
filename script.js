// Select elements
const domainInput = document.getElementById('domainInput');
const dorkList = document.getElementById('dorkList');

// Global variable to store original dorks
let originalDorks = [];

// Function to fetch dorks from local JSON file and populate dorkList
async function fetchDorks() {
    const url = "dorks.json";

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Iterate through JSON data
        data.forEach(item => {
            const { title, dork } = item;
            originalDorks.push(dork); // Store dork
            const listItem = createDorkListItem(dork, title); // Create list item
            dorkList.appendChild(listItem); // Append to dorkList
        });

        filterDorks(); // Filter dorks after populating
    } catch (error) {
        console.error('Error fetching dorks:', error);
    }
}

// Function to create list item for dork with optional description
function createDorkListItem(dork, description) {
    const googleLink = `https://www.google.com/search?q=${encodeURIComponent(dork)}`;
    const listItem = document.createElement("li");

    if (description) {
        const desc = document.createElement("p");
        desc.textContent = description;
        desc.classList.add("description");
        listItem.appendChild(desc);
    }

    const link = document.createElement("a");
    link.href = googleLink;
    link.textContent = dork;
    link.classList.add("dorkLink");
    link.target = "_blank";
    listItem.appendChild(link);

    return listItem;
}

// Function to update dork links and text based on domain input
function updateDomain() {
    const domains = domainInput.value.split(",").map(domain => domain.trim());

    if (domains.length === 0) return;

    const dorkLinks = document.querySelectorAll(".dorkLink");
    dorkLinks.forEach((link, index) => {
        let originalDork = originalDorks[index];

        // Update originalDork based on domains input
        if (/site:"?example\[?\.\]?com"?/i.test(originalDork)) {
            const joinedDomains = domains.map(d => `site:${d}`).join(" | ");
            originalDork = originalDork.replace(/site:"?example\[?\.\]?com"?/gi, joinedDomains);
        } else if (/["']example\[?\.\]?com["']/i.test(originalDork)) {
            const joinedDomains = domains.map(d => `"${d}"`).join(" | ");
            originalDork = originalDork.replace(/["']example\[?\.\]?com["']/gi, joinedDomains);
        }

        const updatedLink = `https://www.google.com/search?q=${encodeURIComponent(originalDork)}`;

        link.textContent = originalDork;
        link.href = updatedLink;
    });
}

// Function to filter dorks based on content
function filterDorks() {
    const dorkItems = dorkList.querySelectorAll("li");
    dorkItems.forEach(item => {
        if (item.textContent.toLowerCase().includes("omit")) {
            item.style.display = "none";
        }
    });
}

// Call fetchDorks to initiate fetching and populating dorks
fetchDorks();
