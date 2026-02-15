// Seeded random number generator for reproducible results
class SeededRandom {
    constructor(seed) {
        this.seed = seed;
    }

    // Linear congruential generator
    next() {
        this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
        return this.seed / 0x7fffffff;
    }

    // Fisher-Yates shuffle with seeded random
    shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(this.next() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
}

// Generate all 10×10 multiplication problems
function generateProblems(seed) {
    const problems = [];
    for (let a = 1; a <= 10; a++) {
        for (let b = 1; b <= 10; b++) {
            problems.push({ a, b });
        }
    }

    const rng = new SeededRandom(seed);
    return rng.shuffle(problems);
}

// Generate a random seed
function generateSeed() {
    return Math.floor(Math.random() * 900000) + 100000;
}

// Current worksheet data
let currentWorksheet = null;

// DOM elements
const seedInput = document.getElementById('seedInput');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const currentSeedDiv = document.getElementById('currentSeed');
const seedDisplay = document.getElementById('seedDisplay');
const previewDiv = document.getElementById('preview');
const previewSeed = document.getElementById('previewSeed');
const problemsGrid = document.getElementById('problemsGrid');

// Generate worksheet
function generateWorksheet() {
    const seed = seedInput.value ? parseInt(seedInput.value) : generateSeed();

    currentWorksheet = {
        seed: seed,
        problems: generateProblems(seed)
    };

    displayWorksheet();
}

// Display worksheet preview
function displayWorksheet() {
    if (!currentWorksheet) return;

    // Update seed displays
    seedDisplay.textContent = currentWorksheet.seed;
    previewSeed.textContent = currentWorksheet.seed;

    // Show preview and current seed info
    currentSeedDiv.style.display = 'block';
    previewDiv.style.display = 'block';
    downloadBtn.disabled = false;

    // Clear and populate problems grid
    problemsGrid.innerHTML = '';
    currentWorksheet.problems.forEach(({ a, b }) => {
        const problemDiv = document.createElement('div');
        problemDiv.className = 'problem';
        problemDiv.textContent = `${a} × ${b} = ______`;
        problemsGrid.appendChild(problemDiv);
    });

    // Scroll to preview
    previewDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Generate PDF using pdfmake
function downloadPDF() {
    if (!currentWorksheet) return;

    const { seed, problems } = currentWorksheet;

    // Prepare table data (5 columns, 20 rows)
    const tableBody = [];
    for (let i = 0; i < 20; i++) {
        const row = [];
        for (let j = 0; j < 5; j++) {
            const idx = i * 5 + j;
            if (idx < problems.length) {
                const { a, b } = problems[idx];
                row.push({
                    text: `${a} × ${b} = ______`,
                    alignment: 'left',
                    margin: [5, 5, 5, 5]
                });
            }
        }
        tableBody.push(row);
    }

    // PDF document definition
    const docDefinition = {
        pageSize: 'A4',
        pageMargins: [40, 40, 40, 40],
        content: [
            {
                text: 'Multiplication Table Test 1–10',
                style: 'header',
                alignment: 'center',
                margin: [0, 0, 0, 10]
            },
            {
                text: `Worksheet ID: ${seed}`,
                style: 'subheader',
                alignment: 'center',
                margin: [0, 0, 0, 5]
            },
            {
                text: 'Calculate all results. Write answers in the blanks.',
                alignment: 'center',
                margin: [0, 0, 0, 20],
                fontSize: 10
            },
            {
                table: {
                    widths: ['*', '*', '*', '*', '*'],
                    heights: 25,
                    body: tableBody
                },
                layout: {
                    hLineWidth: function (i, node) { return 0.5; },
                    vLineWidth: function (i, node) { return 0.5; },
                    hLineColor: function (i, node) { return 'black'; },
                    vLineColor: function (i, node) { return 'black'; }
                }
            }
        ],
        styles: {
            header: {
                fontSize: 20,
                bold: true,
                margin: [0, 0, 0, 10]
            },
            subheader: {
                fontSize: 12,
                bold: true,
                color: '#667eea'
            }
        },
        defaultStyle: {
            fontSize: 12
        }
    };

    // Create and download PDF
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `worksheet_${seed}_${timestamp}.pdf`;

    pdfMake.createPdf(docDefinition).download(filename);
}

// Event listeners
generateBtn.addEventListener('click', generateWorksheet);
downloadBtn.addEventListener('click', downloadPDF);

// Allow Enter key in seed input
seedInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        generateWorksheet();
    }
});

// Generate initial worksheet on page load
window.addEventListener('load', () => {
    console.log('Multiplication Worksheet Generator loaded!');
});
