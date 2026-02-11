const fs = require('fs');
const path = require('path');

const intermediatePath = path.join(process.cwd(), 'programs/intermediate/index.html');
const advancedPath = path.join(process.cwd(), 'programs/advanced/index.html');

console.log("Reading files...");
let intermediateContent = fs.readFileSync(intermediatePath, 'utf8');
let advancedContent = fs.readFileSync(advancedPath, 'utf8');

// Use Advanced as Base
let newContent = advancedContent;

console.log("Applying transformations...");

// 1. Title & Meta
newContent = newContent.replace(/Advanced Level Program/g, "Intermediate Level Program");
newContent = newContent.replace(/Master Innovators: Advanced Level/g, "Innovate & Build: Intermediate Level");
newContent = newContent.replace(/Advanced Robotics & ROS, AI, data science, and complex project development/g, "Arduino, Python, robotics, and IoT"); // Update meta desc if matching
newContent = newContent.replace(/Build a strong portfolio with advanced robotics, AI, data science, and complex project development./g, "Advance your skills with Arduino, Python, robotics, and IoT for real-world applications.");
newContent = newContent.replace(/Master Innovators: Advanced Level/g, "Innovate & Build: Intermediate Level");

// 2. CSS Class & Color
newContent = newContent.replace(/\.advanced-hero/g, ".intermediate-hero");
// CSS Definition
newContent = newContent.replace(
    /background: linear-gradient\(135deg, #0d6efd 0%, #0a58ca 100%\);/g,
    "background: linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%);"
);

// 3. Stats Section
newContent = newContent.replace(/15\+ Years/g, "11-14 Years");
newContent = newContent.replace(/ROS & AI\/ML/g, "Arduino & IoT");
newContent = newContent.replace(/Portfolio/g, "Projects"); // Simplified
newContent = newContent.replace(/Building/g, "Building");

// 4. Core Competencies ("What Students Will Master")
// Advanced has: Advanced Robotics, AI & CV, Embedded Systems, Professional Portfolio.
// Intermediate should have: Arduino, Electronics, IoT, Advanced Robotics.
// I will replace these titles/text manually or relying on extraction is hard because formatting differs.
// Replaing Titles:
newContent = newContent.replace(/Advanced Robotics & ROS/g, "Arduino & Embedded Systems");
newContent = newContent.replace(/AI & Computer Vision/g, "Electronics & Sensors");
newContent = newContent.replace(/Embedded Systems \(RTOS\)/g, "IoT & Connected Devices");
newContent = newContent.replace(/Professional Portfolio/g, "Robotics & AI Basics");

// 5. Curriculum
// Extract Modules from Intermediate
// Regex matches <div class="curriculum-item"> ... </div>
// Structure: <div class="curriculum-item"> ... <div class="curriculum-content"> ... </div> </div>
// Relies on </div></div> at the end.
const itemRegex = /<div class="curriculum-item">[\s\S]*?<\/div>\s*<\/div>/g;
const intermediateItems = intermediateContent.match(itemRegex);

if (intermediateItems && intermediateItems.length > 0) {
    console.log(`Found ${intermediateItems.length} curriculum items in Intermediate.`);
    const newCurriculumHTML = intermediateItems.join('\n\n');

    // Replace Advanced Curriculum
    // Find the block from Module 1 to Module 10 in Advanced
    // Advanced has: <!-- MODULE 1 --> ... <!-- MODULE 10 --> ... </div> </div>
    // I'll regex match the whole list content inside <div class="curriculum-list"> ... </div>
    // Advanced: <div class="curriculum-list"> .... </div>

    const advancedListRegex = /<div class="curriculum-list">([\s\S]*?)<\/div>\s*<\/div>/;
    const match = newContent.match(advancedListRegex);
    if (match) {
        // Construct new list container
        const replacement = `<div class="curriculum-list">\n${newCurriculumHTML}\n</div>`;
        // Replace inner content plus the div tag? No, replace the whole match effectively?
        // Match includes outer div?
        // match[0] is <div class="curriculum-list">...</div></div>

        // Wait, "</div></div>" matches the closing of .curriculum-list AND .col-lg-7?
        // Let's replace match[0] but careful about the greedy match or boundaries.
        // It's safer to target <!-- MODULE 1 --> to end of specific module?
        // But I want to remove ALL Advanced modules.

        // Let's search for <div class="curriculum-list">
        const startIdx = newContent.indexOf('<div class="curriculum-list">');
        if (startIdx !== -1) {
            // Find the closing div for this div.
            // This is hard with regex.
            // Assuming indentation or standard specific comments.
            // Advanced file has <!-- MODULE 10 --> ... </div> </div>
            // I'll search for regex that ends at the specific footer of the list?

            // Simplest: Replace everything between <div class="curriculum-list"> and the next </div> that seems to close it?
            // Actually, I'll just use the `replace` with identifying comment if possible.
            // Advanced has <!-- MODULE 1 --> ... 

            // I'll replace /<!-- MODULE 1 -->[\s\S]*?<!-- MODULE 10 -->[\s\S]*?<\/div>\s*<\/div>/ 
            // BE CAREFUL: This assumes MODULE 10 is the last one. It IS in Advanced.
            // And assumes specific closing divs.

            // Let's rely on injecting into the .curriculum-list
            newContent = newContent.replace(
                /<div class="curriculum-list">[\s\S]*?<\/div>\s*<\/div>(?=\s*<\/div>)/, // Lookahead for column closing
                `<div class="curriculum-list">\n${newCurriculumHTML}\n</div>\n</div>`
                // Added extra </div> because regex consumed one?
                // No, regex matching logic is fragile here.

                // Better: Replace ONLY the inner content if I can match it.
                // But I can't match inner content easily.
            );

            // Retry: Use a simpler marker.
            // Replace "<!-- MODULE 1 -->" ... "<!-- MODULE 10 --> ... </div>"
            // with newCurriculumHTML.

            // I'll try to just overwrite the file with manual structure if this is too risky.
            // But I am running code.

            // Let's use string indexes.
            const listStart = newContent.indexOf('<div class="curriculum-list">');
            const listEnd = newContent.indexOf('</div>', newContent.indexOf('<!-- MODULE 10 -->'));
            // Find </div> AFTER Module 10.

            if (listStart !== -1 && listEnd !== -1) {
                const before = newContent.substring(0, listStart + '<div class="curriculum-list">'.length);
                const after = newContent.substring(listEnd); // listEnd points to < of </div> ? No.
                // indexOf returns start index.
                // I want to keep the </div> at listEnd.

                // listEnd is index of </div> closing Module 10 ITEM?
                // Module 10 item: <div class="curriculum-item">...</div>
                // So listEnd points to closing div of Module 10.
                // The list ITSELF closes after that.
                // So I need to find the </div> AFTER the </div> of Module 10?
                // The structure is list > item > header/content.

                // Let's just Regex replace the whole block based on "Module 1" to "Module 10" keywords.
                const regex = /<!-- MODULE 1 -->[\s\S]*?<!-- MODULE 10 -->[\s\S]*?<\/div>\s*<\/div>/;
                // This matches Module 1 start to Module 10 end (item end).
                // It does NOT include the list closing div.
                // So I can replace this chunk with newCurriculumHTML.

                newContent = newContent.replace(regex, newCurriculumHTML);
            }
        }
    } else {
        console.warn("Intermediate curriculum items not found!");
    }

    // 6. Certification
    newContent = newContent.replace(/Advanced Level Completed/g, "Intermediate Level Completed");
    newContent = newContent.replace(/MakerWorks Advanced Level Certificate/g, "MakerWorks Intermediate Level Certificate");
    newContent = newContent.replace(/Mastery of ROS, AI, and Embedded Systems/g, "Mastery of Arduino, IoT, and Robotics");
    newContent = newContent.replace(/6 Industry-Standard Capstone Projects/g, "8+ Advanced Projects");
    newContent = newContent.replace(/Published Technical Paper \/ Case Study/g, "IoT & Home Automation Portfolio");
    newContent = newContent.replace(/Official Advanced Certification/g, "Official Intermediate Certification");

    // 7. Navbar Links (Active State?)
    // Advanced page has "Advanced Level" in navbar.
    // I don't need to change active class because none is marked active in the HTML explicitly?
    // They are just links.

    // 8. Footer (Already correct in Advanced, just shared)
    // No changes needed.

    // 9. Links to other programs
    // Fix navigation links if they are "active".
    // In Advanced: <li><a ... href="/programs/advanced/">Advanced Level</a></li>
    // It's fine.

    fs.writeFileSync(intermediatePath, newContent, 'utf8');
    console.log("Rebuilt intermediate/index.html using Advanced Template.");

