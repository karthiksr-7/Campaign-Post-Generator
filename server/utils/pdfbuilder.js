// server/utils/pdfBuilder.js

const PDFDocument = require('pdfkit');
const fs = require('fs');

function buildPDF(data, files, outputPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // ===========================
    // 📌 1. Cover Page & Branding
    // ===========================
    doc
      .fontSize(24)
      .fillColor('#0000cc')
      .text(`${data.brandName} — Campaign Brief`, { align: 'center' })
      .moveDown();

    doc
      .fontSize(14)
      .fillColor('black')
      .text(`Theme: ${data.theme || 'Let it Shine with Awesomeness'}`, { align: 'center' })
      .moveDown();

    doc
      .fontSize(12)
      .text(`Generated for ${data.brandName}`, { align: 'center' })
      .moveDown(2);

    // ===========================
    // 📖 2. Concept Note
    // ===========================
    doc
      .fontSize(16)
      .fillColor('#333333')
      .text('Concept Note', { underline: true })
      .moveDown(0.5);

    doc
      .fontSize(11)
      .fillColor('#000')
      .text(
        `Whatever you do, make it extraordinary because the mundane will not do. Despite being imperfect, 
everyone has excellence inside. If someone is inspired by your story or style, that’s awesomeness. 
Let’s help ${data.brandName} shine with a special celebration.`
      )
      .moveDown();

    // ===========================
    // 📅 3. Key Dates Section
    // ===========================
    doc
      .fontSize(14)
      .fillColor('#000')
      .text('Key Dates of the Month:', { underline: true })
      .fontSize(11)
      .text(`• World Awesomeness Day – 10`)
      .text(`• International Women’s Day – 08`)
      .text(`• World Sleep Day – 18`)
      .text(`• Day of Happiness – 20`)
      .moveDown();

    // ===========================
    // 🧩 4. Story Themes
    // ===========================
    doc
      .fontSize(14)
      .fillColor('#000')
      .text('Story Categories & Themes', { underline: true })
      .moveDown(0.5);

    doc
      .fontSize(12)
      .text('Story 1: Individuality Inspired – "Feel the Awesomeness"')
      .text('Story 2: Bright/Gradient Prints – "Spread the Awesomeness"')
      .text('Story 3: Gold/Silver/Bling – "Let it Shine with Awesomeness"')
      .moveDown();

    // ===========================
    // 🛍️ 5. Campaign Visual Plan
    // ===========================
    doc
      .fontSize(14)
      .text('Visual Content Plan', { underline: true })
      .moveDown(0.5);

    doc
      .fontSize(11)
      .text(`Product Category: ${data.category}`)
      .text(`Model Use: ${data.modelUse}`)
      .text(`Location Preference: ${data.locationPref}`)
      .text(`Visual Types: ${data.contentType}`)
      .moveDown();

    // ===========================
    // 📝 6. Captioning & Messaging
    // ===========================
    doc
      .fontSize(14)
      .text('Messaging & Captions', { underline: true })
      .moveDown(0.5);

    doc
      .fontSize(11)
      .text(`Tone: ${data.captionTone}`)
      .text(`Tagline: ${data.tagline}`)
      .text(`Hashtags: ${data.hashtags}`)
      .text(`CTA: ${data.ctaText}`)
      .moveDown();

    // ===========================
    // 📎 7. Reference Notes
    // ===========================
    doc
      .fontSize(14)
      .text('Reference & Notes', { underline: true })
      .moveDown(0.5);

    doc
      .fontSize(11)
      .text(`Competitor Inspirations: ${data.competitor}`)
      .text(`Notes: ${data.notes || '—'}`)
      .moveDown();

    // ===========================
    // 🖼️ 8. Uploaded Image Preview (optional)
    // ===========================
    if (files?.productImage?.[0]?.path) {
      try {
        doc
          .fontSize(12)
          .text('Product Preview:', { underline: true })
          .image(files.productImage[0].path, {
            fit: [200, 200],
            align: 'center',
            valign: 'center'
          })
          .moveDown();
      } catch (e) {
        console.log('Image preview failed:', e.message);
      }
    }

    // ===========================
    // ✅ Finish PDF
    // ===========================
    doc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

module.exports = buildPDF;
