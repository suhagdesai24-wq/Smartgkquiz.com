const express = require('express');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static UI
app.use(express.static(path.join(__dirname, 'public')));

// Load GK facts (you can replace this file with a much larger dataset)
const FACTS_PATH = path.join(__dirname, 'data', 'gk_facts.json');
let GK_FACTS = [];
try {
  GK_FACTS = JSON.parse(fs.readFileSync(FACTS_PATH, 'utf8'));
  if (!Array.isArray(GK_FACTS)) GK_FACTS = [];
} catch (e) {
  console.warn('Could not load GK facts:', e.message);
  GK_FACTS = [];
}

function getFact(index) {
  if (GK_FACTS.length === 0) return `General Knowledge Fact ${index}`;
  return GK_FACTS[index % GK_FACTS.length];
}

// Main PDF generation endpoint
// Query params: pages (number), itemsPerPage (number), inline (true|false)
app.get('/generate-pdf', (req, res) => {
  const pages = Math.max(1, parseInt(req.query.pages || '100', 10));
  const itemsPerPage = Math.max(1, parseInt(req.query.itemsPerPage || '40', 10));
  const siteName = 'Smartgkquiz.com';
  const inline = req.query.inline === 'true';

  // Set headers for streaming PDF
  res.setHeader('Content-Type', 'application/pdf');
  const filename = `${siteName.replace(/[^a-z0-9]/gi,'_')}_General_Knowledge_${pages}pages.pdf`;
  if (inline) {
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
  } else {
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  }

  const doc = new PDFDocument({ size: 'A4', margin: 50, autoFirstPage: false });

  // Pipe PDF document to response
  doc.pipe(res);

  // Styles
  const headerFontSize = 14;
  const itemFontSize = 10;
  const footerFontSize = 9;

  // Generate pages sequentially
  for (let p = 0; p < pages; p++) {
    doc.addPage();

    // Header
    doc.fontSize(headerFontSize).text(siteName, { align: 'center' });
    doc.moveDown(0.5);

    // Content
    doc.fontSize(itemFontSize);
    const startIndex = p * itemsPerPage;
    for (let i = 0; i < itemsPerPage; i++) {
      const itemNo = startIndex + i + 1;
      const fact = getFact(itemNo);
      doc.text(`${itemNo}. ${fact}`, { align: 'left', paragraphGap: 2 });
    }

    // Footer
    doc.moveDown(0.5);
    doc.fontSize(footerFontSize).text(`Page ${p + 1} — ${siteName}`, 50, doc.page.height - 50, {
      width: doc.page.width - 100,
      align: 'center'
    });
  }

  // Finalize PDF and end the stream
  doc.end();

  // Note: no need to call res.end() because doc.pipe(res) will end when doc ends
});

app.listen(PORT, () => {
  console.log(`Smartgkquiz.com PDF generator listening on port ${PORT}`);
});
