# 10×10 Multiplication Worksheet Generator - Web Version

A simple web application that generates randomized multiplication worksheets for students. Creates PDFs with all 100 multiplication problems (1-10 × 1-10) in random order.

## Features

- ✅ Generates all 10×10 multiplication problems in random order
- ✅ Browser-based PDF generation (no server required)
- ✅ Reproducible worksheets using Worksheet IDs
- ✅ Clean, responsive design
- ✅ Print-ready PDF output
- ✅ No installation needed - just open in a browser

## How to Use

1. **Open the Application**
   - Simply open `index.html` in any modern web browser
   - No server or installation required!

2. **Generate a Worksheet**
   - Click "Generate New Worksheet" to create a random worksheet
   - OR enter a specific Worksheet ID to regenerate an existing worksheet
   - The same ID always generates the same problem order

3. **Preview**
   - View the worksheet layout on screen before downloading
   - All 100 problems are displayed in a 5-column grid

4. **Download PDF**
   - Click "Download PDF" to save the worksheet
   - The file will be named: `worksheet_[ID]_[timestamp].pdf`
   - Print and distribute to students!

## Worksheet IDs

Each worksheet has a unique 6-digit ID. Save this ID to:
- Regenerate the exact same worksheet later
- Create multiple copies of the same test
- Track which version students received

## Technical Details

- **No Backend Required**: Everything runs in the browser
- **PDF Library**: Uses pdfMake for client-side PDF generation
- **Seeded Random**: Uses a Linear Congruential Generator for reproducible randomization
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Comparison with Python Version

This web version provides the same core functionality as the Python generator:
- ✅ Generates 100 problems (10×10)
- ✅ Randomized order
- ✅ Reproducible with seed/ID
- ✅ PDF output
- ✅ 5-column grid layout

**Advantages of Web Version:**
- No Python installation needed
- No dependencies to install
- Works on any device with a browser
- Instant preview before downloading
- Easy to share with others

## Files

- `index.html` - Main application page
- `style.css` - Styling and layout
- `app.js` - Application logic and PDF generation
- `README.md` - This file

## License

Free to use for educational purposes.
