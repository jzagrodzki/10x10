// Language translations
const translations = {
    en: {
        title: 'Multiplication Worksheet Generator',
        subtitle: 'Generate randomized 10×10 multiplication tests for students',
        worksheetIdLabel: 'Worksheet ID (optional):',
        worksheetIdPlaceholder: 'Leave empty for random',
        worksheetIdHelp: 'Use the same ID to regenerate identical worksheets',
        generateButton: 'Generate New Worksheet',
        downloadButton: 'Download PDF',
        currentIdLabel: 'Current Worksheet ID:',
        saveIdHelp: 'Save this ID to regenerate the same worksheet later',
        previewTitle: 'Preview',
        worksheetTitle: 'Multiplication Table Test 1–10',
        worksheetIdPrefix: 'Worksheet ID:',
        instructions: 'Calculate all results. Write answers in the blanks.',
        footerTip: '💡 Tip: Each worksheet has a unique ID. Save it to print the same worksheet again later.',
        languageLabel: 'Language:'
    },
    no: {
        title: 'Generator for Gangetabeller',
        subtitle: 'Generer tilfeldig blandede 10×10 gangeoppgaver for elever',
        worksheetIdLabel: 'Oppgavesett ID (valgfritt):',
        worksheetIdPlaceholder: 'La stå tom for tilfeldig',
        worksheetIdHelp: 'Bruk samme ID for å generere identiske oppgavesett',
        generateButton: 'Generer Nytt Oppgavesett',
        downloadButton: 'Last ned PDF',
        currentIdLabel: 'Nåværende Oppgavesett ID:',
        saveIdHelp: 'Lagre denne ID-en for å generere samme oppgavesett senere',
        previewTitle: 'Forhåndsvisning',
        worksheetTitle: 'Gangetabell Test 1–10',
        worksheetIdPrefix: 'Oppgavesett ID:',
        instructions: 'Regn ut alle resultatene. Skriv svarene på strekene.',
        footerTip: '💡 Tips: Hvert oppgavesett har en unik ID. Lagre den for å skrive ut samme oppgavesett senere.',
        languageLabel: 'Språk:'
    },
    pl: {
        title: 'Generator Arkuszy Tabliczki Mnożenia',
        subtitle: 'Generuj losowe testy tabliczki mnożenia 10×10 dla uczniów',
        worksheetIdLabel: 'ID Arkusza (opcjonalne):',
        worksheetIdPlaceholder: 'Zostaw puste dla losowego',
        worksheetIdHelp: 'Użyj tego samego ID, aby wygenerować identyczne arkusze',
        generateButton: 'Generuj Nowy Arkusz',
        downloadButton: 'Pobierz PDF',
        currentIdLabel: 'Aktualny ID Arkusza:',
        saveIdHelp: 'Zapisz ten ID, aby odtworzyć ten sam arkusz później',
        previewTitle: 'Podgląd',
        worksheetTitle: 'Test Tabliczki Mnożenia 1–10',
        worksheetIdPrefix: 'ID Arkusza:',
        instructions: 'Oblicz wszystkie wyniki. Wpisz odpowiedzi w kratkach.',
        footerTip: '💡 Wskazówka: Każdy arkusz ma unikalny ID. Zapisz go, aby wydrukować ten sam arkusz później.',
        languageLabel: 'Język:'
    }
};

// Current language
let currentLanguage = 'en';

// Update UI text based on current language
function updateLanguage(lang) {
    currentLanguage = lang;
    const t = translations[lang];

    // Update all text elements
    document.querySelector('h1').textContent = `📝 ${t.title}`;
    document.querySelector('.subtitle').textContent = t.subtitle;
    document.querySelector('label[for="seedInput"]').textContent = t.worksheetIdLabel;
    document.getElementById('seedInput').placeholder = t.worksheetIdPlaceholder;
    document.querySelector('.control-group small').textContent = t.worksheetIdHelp;
    document.getElementById('generateBtn').textContent = t.generateButton;
    document.getElementById('downloadBtn').textContent = t.downloadButton;
    document.querySelector('#currentSeed strong').textContent = t.currentIdLabel;
    document.querySelector('#currentSeed small').textContent = t.saveIdHelp;
    document.querySelector('#preview h2').textContent = t.previewTitle;
    document.querySelector('footer p').textContent = t.footerTip;
    document.querySelector('label[for="languageSelect"]').textContent = t.languageLabel;

    // Update worksheet preview if it exists
    if (currentWorksheet) {
        displayWorksheet();
    }

    // Save language preference
    localStorage.setItem('preferredLanguage', lang);
}

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

    const t = translations[currentLanguage];

    // Update seed displays
    seedDisplay.textContent = currentWorksheet.seed;
    previewSeed.textContent = currentWorksheet.seed;

    // Update worksheet header with current language
    document.querySelector('.worksheet-header h3').textContent = t.worksheetTitle;
    document.querySelector('.worksheet-header .worksheet-id').innerHTML = `${t.worksheetIdPrefix} <strong id="previewSeed">${currentWorksheet.seed}</strong>`;
    document.querySelector('.worksheet-header p:last-child').textContent = t.instructions;

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
    const t = translations[currentLanguage];

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
                text: t.worksheetTitle,
                style: 'header',
                alignment: 'center',
                margin: [0, 0, 0, 10]
            },
            {
                text: `${t.worksheetIdPrefix} ${seed}`,
                style: 'subheader',
                alignment: 'center',
                margin: [0, 0, 0, 5]
            },
            {
                text: t.instructions,
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

// Language selector change
document.getElementById('languageSelect').addEventListener('change', (e) => {
    updateLanguage(e.target.value);
});

// Allow Enter key in seed input
seedInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        generateWorksheet();
    }
});

// Initialize on page load
window.addEventListener('load', () => {
    // Load saved language preference or default to English
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    document.getElementById('languageSelect').value = savedLang;
    updateLanguage(savedLang);

    console.log('Multiplication Worksheet Generator loaded!');
});
