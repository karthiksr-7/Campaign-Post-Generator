const express = require("express");
const multer = require("multer");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


router.post("/generate-cover",  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "contentImages", maxCount: 6 },
    { name: "storyImage", maxCount: 1 },
    { name: "page9Content1", maxCount: 3 },
    { name: "page9Content2", maxCount: 1 },
    { name: "page9Content3", maxCount: 2 },
     { name: "page10Content4", maxCount: 1 },
  { name: "page10Content5", maxCount: 2 },
  { name:"page11StoryImage",maxCount:1 },
  { name: "page13Content1", maxCount: 2 },
{ name: "page13Content2", maxCount: 1 },
{ name: "page13Content3", maxCount: 3 },
{ name: "page14Content1", maxCount: 1 }, 
  { name: "page14Content2", maxCount: 2 }, 
  { name: "page14Content3", maxCount: 1 },
  { name: "page15StoryImage", maxCount: 1 },
  { name: "page17Content1", maxCount: 3 },
{ name: "page17Content2", maxCount: 1 },
{ name: "page17Content3", maxCount: 3 },
{ name: "page18Content1", maxCount: 3 },
{ name: "page18Content2", maxCount: 3 },
{ name: "page18Content3", maxCount: 3 }
  ]), async (req, res) => {
  try {
    const coverTitle = req.body.coverTitle || "";
    const slogan = req.body.slogan || "";
    
    const backgroundColor = req.body.backgroundColor;
    const boardColor = req.body.boardColor;
    const conceptNoteText = req.body.conceptNoteText || "";
    const imageFile = req.files?.image?.[0];
if (!imageFile) {
  return res.status(400).json({ error: "Image file is missing." });
}
const imageBuffer = imageFile.buffer;
    const notes = JSON.parse(req.body.importantDates || "{}");
    const storyBreakup = JSON.parse(req.body.storyBreakup || "[]");


    const pdfDoc = await PDFDocument.create();
     const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const hexToRgb = (hex) => {
      const num = parseInt(hex.slice(1), 16);
      return {
        r: ((num >> 16) & 255) / 255,
        g: ((num >> 8) & 255) / 255,
        b: (num & 255) / 255,
      };
    };

    const bg = hexToRgb(backgroundColor || "#f2f2f2");
    const board = hexToRgb(boardColor || "#d96d87");
    const width = 612, height = 792;
    const marginOuter = 30;

    // PAGE 1 – COVER
    const page1 = pdfDoc.addPage([width, height]);
    page1.drawRectangle({
      x: marginOuter,
      y: marginOuter,
      width: width - 2 * marginOuter,
      height: height - 2 * marginOuter,
      color: rgb(bg.r, bg.g, bg.b),
    });

    const titleFontSize = 24;
    const titleWidth = fontBold.widthOfTextAtSize(coverTitle, titleFontSize);
    const titleX = (width - titleWidth) / 2;
    const titleY = height - 80;
    page1.drawText(coverTitle, {
      x: titleX,
      y: titleY,
      size: titleFontSize,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    page1.drawLine({
      start: { x: titleX, y: titleY - 5 },
      end: { x: titleX + titleWidth, y: titleY - 5 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    const sloganFontSize = 14;
    const sloganWidth = fontRegular.widthOfTextAtSize(slogan, sloganFontSize);
    const sloganX = (width - sloganWidth) / 2;
    const sloganY = titleY - 30;
    page1.drawText(slogan, {
      x: sloganX,
      y: sloganY,
      size: sloganFontSize,
      font: fontRegular,
      color: rgb(0, 0, 0),
    });

    const boardTopY = sloganY - 100;
    const boardHeight = 300;
    const boardMarginH = 70;
    const boardY = boardTopY - boardHeight;
    const boardWidth = width - 2 * boardMarginH;
    page1.drawRectangle({
      x: boardMarginH,
      y: boardY,
      width: boardWidth,
      height: boardHeight,
      color: rgb(board.r, board.g, board.b),
    });

    const embeddedImg = imageFile.mimetype === "image/png"
  ? await pdfDoc.embedPng(imageBuffer)
  : await pdfDoc.embedJpg(imageBuffer);

    const imgHeight = boardHeight * 1.3;
    const imgWidth = boardWidth * 0.92;
    const imgX = (width - imgWidth) / 2;
    const imgY = boardY + (boardHeight - imgHeight) / 2;
    page1.drawImage(embeddedImg, {
      x: imgX,
      y: imgY,
      width: imgWidth,
      height: imgHeight,
    });

    // PAGE 2 – CONCEPT NOTE
    const page2 = pdfDoc.addPage([width, height]);
    page2.drawRectangle({
      x: 0, y: 0, width, height,
      color: rgb(1, 1, 1),
    });
    const innerX = marginOuter;
    const innerY = marginOuter;
    const innerW = width - 2 * marginOuter;
    const innerH = height - 2 * marginOuter;
    page2.drawRectangle({
      x: innerX, y: innerY, width: innerW, height: innerH,
      color: rgb(bg.r, bg.g, bg.b),
      borderColor: rgb(0.3, 0.3, 0.3),
      borderWidth: 2,
    });

    const headingFontSizeP2 = 22;
    const titleFontSizeP2 = 20;
    const sloganFontSizeP2 = 16;
    const paragraphFontSizeP2 = 14;
    const lineHeightP2 = 26;
    let contentY = height - marginOuter - 60;

    const heading = "Concept Note";
    const headingWidth = fontBold.widthOfTextAtSize(heading, headingFontSizeP2);
    page2.drawText(heading, {
      x: (width - headingWidth) / 2,
      y: contentY,
      size: headingFontSizeP2,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    page2.drawLine({
      start: { x: (width - headingWidth) / 2, y: contentY - 4 },
      end: { x: (width + headingWidth) / 2, y: contentY - 4 },
      thickness: 0.8,
      color: rgb(0, 0, 0),
    });

    contentY -= lineHeightP2 * 2;
    const p2TitleWidth = fontBold.widthOfTextAtSize(coverTitle, titleFontSizeP2);
    page2.drawText(coverTitle, {
      x: (width - p2TitleWidth) / 2,
      y: contentY,
      size: titleFontSizeP2,
      font: fontBold,
      color: rgb(0.1, 0.1, 0.1),
    });

    contentY -= lineHeightP2 * 1.5;
    const p2SloganWidth = fontRegular.widthOfTextAtSize(slogan, sloganFontSizeP2);
    page2.drawText(slogan, {
      x: (width - p2SloganWidth) / 2,
      y: contentY,
      size: sloganFontSizeP2,
      font: fontRegular,
      color: rgb(0.2, 0.2, 0.2),
    });

    contentY -= lineHeightP2 * 2;
    const paragraphX = innerX + 30;
    const maxLineWidth = innerW - 60;
    const wrappedLines = wrapTextByWidth(conceptNoteText, fontRegular, paragraphFontSizeP2, maxLineWidth);

    wrappedLines.forEach((line) => {
      if (contentY < innerY + 40) return;
      page2.drawText(line, {
        x: paragraphX,
        y: contentY,
        size: paragraphFontSizeP2,
        font: fontRegular,
        color: rgb(0.1, 0.1, 0.1),
      });
      contentY -= lineHeightP2;
    });

   // Page 3 – Calendar View with Notes
// Page 3 – Calendar View with Notes
const page3 = pdfDoc.addPage([width, height]);

// White outer margin
page3.drawRectangle({
  x: 0,
  y: 0,
  width,
  height,
  color: rgb(1, 1, 1),
});

// Inner content background (same as page 1)
page3.drawRectangle({
  x: marginOuter,
  y: marginOuter,
  width: width - 2 * marginOuter,
  height: height - 2 * marginOuter,
  color: rgb(bg.r, bg.g, bg.b),
});

// Header box – "Key Dates of the Month"
const headerText = "Key Dates of the Month";
const headerSize = 20;
const headerPadding = 12;
const headerWidth = fontBold.widthOfTextAtSize(headerText, headerSize);
const headerX = (width - headerWidth) / 2 - 10;
const headerY = height - 60;

page3.drawRectangle({
  x: headerX - headerPadding,
  y: headerY - headerPadding,
  width: headerWidth + headerPadding * 2,
  height: headerSize + headerPadding * 1.2,
  color: rgb(0.85, 0.85, 0.85),
});

page3.drawText(headerText, {
  x: headerX,
  y: headerY,
  size: headerSize,
  font: fontBold,
  color: rgb(0, 0, 0),
});

// Extract month from notes
const dateKeys = Object.keys(notes || {});
const firstDate = dateKeys.length > 0 ? new Date(dateKeys[0]) : new Date();
const monthText = firstDate.toLocaleString("default", { month: "long", year: "numeric" });

// ==== CALENDAR WHITE BOX ====
const calendarCols = 7;
const calendarRows = 5;
const cellSize = 60;
const calendarMarginX = 30;
const calendarPadding = 20;
const calendarBoxWidth = calendarCols * cellSize + calendarPadding * 2;
const calendarBoxHeight = (calendarRows + 2) * cellSize; // +2 for month and days row

const calendarBoxX = (width - calendarBoxWidth) / 2;
const calendarBoxY = headerY - 100;

// White background box
page3.drawRectangle({
  x: calendarBoxX,
  y: calendarBoxY - calendarBoxHeight,
  width: calendarBoxWidth,
  height: calendarBoxHeight,
  color: rgb(1, 1, 1),
});

// Month Name
const monthFontSize = 14;
const monthWidth = fontBold.widthOfTextAtSize(monthText, monthFontSize);
page3.drawText(monthText, {
  x: (width - monthWidth) / 2,
  y: calendarBoxY - cellSize * 0.5,
  size: monthFontSize,
  font: fontBold,
  color: rgb(0, 0, 0),
});

// Weekdays row
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
for (let i = 0; i < calendarCols; i++) {
  page3.drawText(days[i], {
    x: calendarBoxX + calendarPadding + i * cellSize + 18,
    y: calendarBoxY - cellSize * 1.3,
    size: 12,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  });
}

// Calendar Grid
let dayNum = 1;
for (let row = 0; row < calendarRows; row++) {
  for (let col = 0; col < calendarCols; col++) {
    const x = calendarBoxX + calendarPadding + col * cellSize;
    const y = calendarBoxY - cellSize * (2 + row);

    page3.drawRectangle({
      x,
      y,
      width: cellSize,
      height: cellSize,
      borderColor: rgb(0.75, 0.75, 0.75),
      borderWidth: 1,
    });

    if (dayNum <= 31) {
      const dateStr = `2025-07-${dayNum.toString().padStart(2, "0")}`;
      const textColor = notes[dateStr] ? rgb(1, 1, 1) : rgb(0.2, 0.2, 0.2);
      const fillHighlight = notes[dateStr];

      if (fillHighlight) {
        // Orange circle
        page3.drawEllipse({
          x: x + cellSize / 2,
          y: y + cellSize / 2,
          xScale: 16,
          yScale: 16,
          color: rgb(1, 0.6, 0.2),
        });
      }

      // Day text
      const text = dayNum.toString().padStart(2, "0");
      const textWidth = fontBold.widthOfTextAtSize(text, 10);
      page3.drawText(text, {
        x: x + cellSize / 2 - textWidth / 2,
        y: y + cellSize / 2 - 5,
        size: 10,
        font: fontBold,
        color: textColor,
      });

      dayNum++;
    }
  }
}

// === NOTES SECTION ===
let noteY = calendarBoxY - calendarBoxHeight - 30;
const noteFontSize = 11;
const noteLineHeight = 20;

Object.entries(notes).forEach(([date, note]) => {
  if (noteY < marginOuter + 40) return;

  const d = new Date(date);
  const dayCircle = d.getDate().toString().padStart(2, "0");

  // Orange dot
  page3.drawEllipse({
    x: calendarBoxX + 10,
    y: noteY + 5,
    xScale: 10,
    yScale: 10,
    color: rgb(1, 0.6, 0.2),
  });

  const textWidth = fontBold.widthOfTextAtSize(dayCircle, 9);
  page3.drawText(dayCircle, {
    x: calendarBoxX + 10 - textWidth / 2,
    y: noteY + 1,
    size: 9,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page3.drawText(note, {
    x: calendarBoxX + 30,
    y: noteY,
    size: noteFontSize,
    font: fontRegular,
    color: rgb(0, 0, 0),
  });

  noteY -= noteLineHeight;
});

// PAGE 4 – Story Breakups Table
// === PAGE 4: Clean Story Breakups

// PAGE 4 – Story Breakups Table
// PAGE 4 – Story Breakups Table (Proper Layout)
const page4 = pdfDoc.addPage([width, height]);

// Margins & Layout Constants
const p4_margin = 40;
const tableMarginTop = 30;
const rowHeight = 60;
const colWidths = [90, 200, 200]; // Total: 490
const tableX = (width - colWidths.reduce((a, b) => a + b)) / 2;
let cursorY = height - p4_margin - 40;

// Background
page4.drawRectangle({
  x: p4_margin,
  y: p4_margin,
  width: width - 2 * p4_margin,
  height: height - 2 * p4_margin,
  color: rgb(bg.r, bg.g, bg.b),
});

// Title: "Story Breakups"
const p4_title = "Story breakups";
const p4_titleSize = 18;
const p4_titleWidth = fontBold.widthOfTextAtSize(p4_title, p4_titleSize);
page4.drawText(p4_title, {
  x: (width - p4_titleWidth) / 2,
  y: cursorY,
  size: p4_titleSize,
  font: fontBold,
  color: rgb(0, 0, 0),
});

// Move below title
cursorY -= tableMarginTop;

// Table Header
const headers = ["", "SUB STORIES", "PRODUCT CATEGORIES"];
for (let col = 0; col < headers.length; col++) {
  const x = tableX + colWidths.slice(0, col).reduce((a, b) => a + b, 0);
  page4.drawRectangle({
    x,
    y: cursorY - rowHeight,
    width: colWidths[col],
    height: rowHeight,
    borderColor: rgb(0.4, 0.4, 0.4),
    borderWidth: 1,
  });

  const tw = fontBold.widthOfTextAtSize(headers[col], 12);
  page4.drawText(headers[col], {
    x: x + (colWidths[col] - tw) / 2,
    y: cursorY - rowHeight / 2 - 6,
    size: 12,
    font: fontBold,
    color: rgb(0, 0, 0),
  });
}

// Table Rows (Dynamic)
cursorY -= rowHeight;

for (let i = 0; i < 3; i++) {
  const label = `Story ${i + 1}`;
  const sub = storyBreakup?.[i]?.subStory || "";
  const cat = storyBreakup?.[i]?.category || "";
  cursorY -= rowHeight;

  let x = tableX;

  // Column 1: Label
  page4.drawRectangle({
    x,
    y: cursorY,
    width: colWidths[0],
    height: rowHeight,
    borderColor: rgb(0.5, 0.5, 0.5),
    borderWidth: 1,
  });
  page4.drawText(label, {
    x: x + 10,
    y: cursorY + rowHeight / 2 - 6,
    size: 11,
    font: fontRegular,
    color: rgb(0.2, 0.2, 0.2),
  });

  // Column 2: Sub Story
  x += colWidths[0];
  page4.drawRectangle({
    x,
    y: cursorY,
    width: colWidths[1],
    height: rowHeight,
    borderColor: rgb(0.5, 0.5, 0.5),
    borderWidth: 1,
  });
  const subLines = wrapTextByWidth(sub, fontRegular, 11, colWidths[1] - 20);
  subLines.slice(0, 2).forEach((line, j) => {
    page4.drawText(line, {
      x: x + 10,
      y: cursorY + rowHeight - 20 - j * 14,
      size: 11,
      font: fontRegular,
      color: rgb(0.1, 0.1, 0.1),
    });
  });

  // Column 3: Product Category
  x += colWidths[1];
  page4.drawRectangle({
    x,
    y: cursorY,
    width: colWidths[2],
    height: rowHeight,
    borderColor: rgb(0.5, 0.5, 0.5),
    borderWidth: 1,
  });
  const catLines = wrapTextByWidth(cat, fontRegular, 11, colWidths[2] - 20);
  catLines.slice(0, 2).forEach((line, j) => {
    page4.drawText(line, {
      x: x + 10,
      y: cursorY + rowHeight - 20 - j * 14,
      size: 11,
      font: fontRegular,
      color: rgb(0.1, 0.1, 0.1),
    });
  });
}
// ========== PAGE 5: Hardcoded Creative Grid ==========
// === PAGE 5 – Refined Creative Grid with Square Boxes ===
const page5 = pdfDoc.addPage([width, height]);

// Background
page5.drawRectangle({
  x: 0,
  y: 0,
  width,
  height,
  color: rgb(1, 1, 1),
});
page5.drawRectangle({
  x: 40,
  y: 40,
  width: width - 80,
  height: height - 80,
  color: rgb(0.93, 0.93, 0.93),
});

// Fonts
const p5_fontSize = 9;
const p5_font = fontRegular;
const p5_boldFont = fontBold;

// Box layout (Square)
const boxSize = 80; // square: width = height
const boxGapX = 15;
const boxGapY = 15;
const storyGapY = 35;

const totalRowWidth = 3 * boxSize + 2 * boxGapX;
const labelColumnX = 80;
const startX = (width - totalRowWidth) / 2 + 20;
let currentY = height - 80;

// Story data
const storyBlocks = [
  {
    label: "Story 3",
    rows: [
      ["COLLECTION VIDEO 2 WITH MODELS", "PRODUCT CAROUSEL", "PRODUCT VIDEO"],
      ["COLLECTION STILL WITH MODEL", "GIF", "LAY DOWN LOOK"]
    ]
  },
  {
    label: "Story 2",
    rows: [
      ["COLLECTION VIDEO 2 WITH MODELS", "PRODUCT CAROUSEL", "PRODUCT VIDEO"],
      ["COLLECTION STILL WITH MODEL", "GIF", "LAY DOWN LOOK"]
    ]
  },
  {
    label: "Story 1",
    rows: [
      ["COLLECTION VIDEO 2 WITH MODELS", "PRODUCT CAROUSEL", "PRODUCT VIDEO"],
      ["COLLECTION STILL WITH MODEL", "GIF", "LAY DOWN LOOK"]
    ]
  }
];

// Text wrap helper
function drawCenteredWrappedText(page, text, font, size, x, y, maxWidth, boxHeight) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const testLine = line ? line + " " + word : word;
    const testWidth = font.widthOfTextAtSize(testLine, size);
    if (testWidth > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  }
  if (line) lines.push(line);

  const totalTextHeight = lines.length * size;
  let textY = y + (boxHeight - totalTextHeight) / 2 + size / 2;

  lines.forEach((lineText) => {
    const lineWidth = font.widthOfTextAtSize(lineText, size);
    page.drawText(lineText, {
      x: x + (maxWidth - lineWidth) / 2,
      y: textY,
      size,
      font,
      color: rgb(0, 0, 0),
    });
    textY -= size;
  });
}

// Draw stories
storyBlocks.forEach((story) => {
  // Draw story label (centered to 2 box rows)
  const blockHeight = 2 * boxSize + boxGapY;
  const labelY = currentY - boxSize / 2;
  page5.drawText(story.label, {
    x: labelColumnX,
    y: labelY,
    size: 11,
    font: p5_boldFont,
    color: rgb(0, 0, 0),
  });

  // Draw rows of boxes
  story.rows.forEach((row) => {
    row.forEach((label, i) => {
      const x = startX + i * (boxSize + boxGapX);
      const y = currentY - boxSize;

      // Draw box
      page5.drawRectangle({
        x,
        y,
        width: boxSize,
        height: boxSize,
        borderColor: rgb(0.3, 0.3, 0.3),
        borderWidth: 1,
      });

      // Text inside
      drawCenteredWrappedText(page5, label, p5_font, p5_fontSize, x, y, boxSize, boxSize);
    });

    currentY -= boxSize + boxGapY;
  });

  currentY -= storyGapY;
});

// ========== PAGE 6 – CONTENT TYPES ==========
// ========== PAGE 6 – CONTENT TYPES (Perfect Grid Alignment) ==========
// ========== PAGE 6 – CONTENT TYPES (Final Aligned Layout) ==========
const page6 = pdfDoc.addPage([width, height]);

// Backgrounds
page6.drawRectangle({ x: 0, y: 0, width, height, color: rgb(1, 1, 1) });
page6.drawRectangle({
  x: 40, y: 40, width: width - 80, height: height - 80, color: rgb(bg.r, bg.g, bg.b)
});

// Layout constants
const contentBoxSize = 100;
const contentGapX = 30;
const contentGapY = 50;
const contentLabelGap = 18;
const contentColumns = 3;
const contentStartX = (width - (contentColumns * contentBoxSize + (contentColumns - 1) * contentGapX)) / 2;

// Step 1: Title
const contentTitle = "CONTENT TYPES";
const contentFontSize = 16;
const contentTitleWidth = fontBold.widthOfTextAtSize(contentTitle, contentFontSize);
const contentTitleY = height - 60;

page6.drawText(contentTitle, {
  x: (width - contentTitleWidth) / 2,
  y: contentTitleY,
  size: contentFontSize,
  font: fontBold,
  color: rgb(0, 0, 0),
});

// Step 2: Start boxes below the title
let boxGridStartY = contentTitleY - 125;

// === STATIC 6 BOXES ===
const fixedLabels = [
  "COLLECTION VIDEO 2 WITH MODELS", "PRODUCT CAROUSEL", "PRODUCT VIDEO",
  "COLLECTION STILL WITH MODEL", "GIF", "LAY DOIWN LOOK"
];

for (let i = 0; i < 6; i++) {
  const row = Math.floor(i / contentColumns);
  const col = i % contentColumns;

  const x = contentStartX + col * (contentBoxSize + contentGapX);
  const y = boxGridStartY - row * (contentBoxSize + contentGapY);

  // Box outline
  page6.drawRectangle({
    x, y,
    width: contentBoxSize,
    height: contentBoxSize,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });

  const lines = wrapTextByWidth(fixedLabels[i], fontBold, 9, contentBoxSize - 10);
  lines.forEach((line, j) => {
    const lineWidth = fontBold.widthOfTextAtSize(line, 9);
    page6.drawText(line, {
      x: x + (contentBoxSize - lineWidth) / 2,
      y: y + contentBoxSize - 15 - j * 11,
      size: 9,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
  });
}

// Step 3: Image Grid (Below Static Boxes)
const contentImages = req.files?.contentImages || [];
const contentLabels = JSON.parse(req.body.contentLabels || "[]");

// Move Y down for images
boxGridStartY = boxGridStartY - 2 * (contentBoxSize + contentGapY) - 50;

for (let i = 0; i < Math.min(6, contentImages.length); i++) {
  const row = Math.floor(i / contentColumns);
  const col = i % contentColumns;

  const x = contentStartX + col * (contentBoxSize + contentGapX);
  const y = boxGridStartY - row * (contentBoxSize + contentGapY + contentLabelGap);

  const image = contentImages[i];
  const embeddedImage = image.mimetype.includes("png")
    ? await pdfDoc.embedPng(image.buffer)
    : await pdfDoc.embedJpg(image.buffer);

  page6.drawImage(embeddedImage, {
    x, y, width: contentBoxSize, height: contentBoxSize
  });

  const fallbackLabels = [
  "COLLECTION VIDEO WITH MODEL", "Product CAROUSEL", "PRODUCT VIDEO",
  " COLLECTION WITH MODEL", "GIF", "LAY DOWN LOOK"
];
const label = contentLabels[i] || fallbackLabels[i] || `Creative ${i + 1}`;
  const labelWidth = fontRegular.widthOfTextAtSize(label, 10);
  page6.drawText(label, {
    x: x + (contentBoxSize - labelWidth) / 2,
    y: y - 14,
    size: 10, font: fontRegular, color: rgb(0, 0, 0)
  });
}


// ========== PAGE 7 – Story Visual ==========
// Page 7 – Story Image with Red Board
if (req.files?.storyImage?.[0]) {
  const page7 = pdfDoc.addPage([width, height]);

  const storyImageBuffer = req.files.storyImage[0].buffer;
  const storyImage = await pdfDoc.embedJpg(storyImageBuffer);

  const storyHeadline = req.body.storyHeadline || "";
  const storyDescription = req.body.storyDescription || "";

  const margin = 40;
  const usableWidth = width - margin * 2;

  // White outer background
  page7.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(1, 1, 1), // White
  });

  // Light gray inner background
  page7.drawRectangle({
    x: margin,
    y: margin,
    width: usableWidth,
    height: height - margin * 2,
    color: rgb(0.95, 0.95, 0.95), // Light gray
  });

  // Left title: Story 1
  page7.drawText("Story 1", {
    x: margin + 20,
    y: height - margin - 30,
    size: 18,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  // ✅ Centered Headline
  const cleanHeadline = storyHeadline.replace(/[^\x20-\x7E]/g, '');
  const headlineSize = 20;
  const headlineWidth = fontBold.widthOfTextAtSize(cleanHeadline, headlineSize);
  const headlineX = (width - headlineWidth) / 2;

  page7.drawText(cleanHeadline, {
    x: headlineX,
    y: height - margin - 60,
    size: headlineSize,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  // Red board box for image
  const boardWidth = 450;
  const boardHeight = 300;
  const boardX = (width - boardWidth) / 2;
  const boardY = height / 2 - boardHeight / 2;

  page7.drawRectangle({
    x: boardX,
    y: boardY,
    width: boardWidth,
    height: boardHeight,
   color: rgb(1, 0.5, 0.5), // Light red
 // Red
  });

  // Place image inside the board
  const scaledImage = storyImage.scale(0.3);
  page7.drawImage(storyImage, {
    x: boardX + (boardWidth - scaledImage.width) / 2,
    y: boardY + (boardHeight - scaledImage.height) / 3,
    width: scaledImage.width,
    height: scaledImage.height,
  });

  // Footer description – centered text
  const lines = storyDescription.split("\n");
  let currentY = margin + 80;

  lines.forEach((line) => {
    const cleanLine = line.replace(/[^\x20-\x7E]/g, '');
    const textWidth = font.widthOfTextAtSize(cleanLine, 12);
    const centerX = (width - textWidth) / 2;

    page7.drawText(cleanLine, {
      x: centerX,
      y: currentY,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    });

    currentY += 18;
  });
}

// Add this after page 7 in your PDF generation logic

if (font && fontBold) {
  const page8 = pdfDoc.addPage([width, height]);

  // Light gray inner background
  page8.drawRectangle({
    x: 30,
    y: 30,
    width: width - 60,
    height: height - 60,
    color: rgb(0.95, 0.95, 0.95),
  });

  // Title: GRID LOOK (centered)
  const gridTitle = "GRID LOOK";
const gridTitleSize = 16;
const gridTitleWidth = fontBold.widthOfTextAtSize(gridTitle, gridTitleSize);
page8.drawText(gridTitle, {
  x: (width - gridTitleWidth) / 2,
  y: height - 180, // Moved downward
  size: gridTitleSize,
  font: fontBold,
  color: rgb(0, 0, 0),
});

  // Content layout
  const boxWidth = 120;
  const boxHeight = 100;
  const startX = 100;
  const startY = height - 310;
  const gapX = 40;
  const gapY = 30;

  const contents = [
    { title: "COLLECTION VIDEO 2\nWITH MODEL", label: "CONTENT 6" },
    { title: "PRODUCT CAROUSEL", label: "CONTENT 5" },
    { title: "PRODUCT VIDEO", label: "CONTENT 4" },
    { title: "COLLECTION STILL\nWITH MODEL", label: "CONTENT 3" },
    { title: "GIF", label: "CONTENT 2" },
    { title: "LAY DOIWN\nLOOK", label: "CONTENT 1" },
  ];

  contents.forEach((item, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);

    const x = startX + col * (boxWidth + gapX);
    const y = startY - row * (boxHeight + gapY);

    // Box
    page8.drawRectangle({
      x,
      y,
      width: boxWidth,
      height: boxHeight,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });

    // Box title
    const titleLines = item.title.split("\n");
    titleLines.forEach((line, i) => {
      const textWidth = font.widthOfTextAtSize(line, 10);
      page8.drawText(line, {
        x: x + (boxWidth - textWidth) / 2,
        y: y + boxHeight - 18 - i * 14,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });
    });

    // Footer label
    const labelWidth = font.widthOfTextAtSize(item.label, 10);
    page8.drawText(item.label, {
      x: x + (boxWidth - labelWidth) / 2,
      y: y - 14,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
  });
}

// Page 9
const page9 = pdfDoc.addPage([width, height]);

// Draw background with margin
page9.drawRectangle({
  x: 30,
  y: 30,
  width: width - 60,
  height: height - 60,
  color: rgb(0.95, 0.95, 0.95),
});

const contentBoxes = [
  {
    title: "LAY DOWN\nLOOK",
    label: "CONTENT 1",
    images: req.files?.page9Content1 || [],
    caption: req.body.page9Content1Caption || "",
  },
  {
    title: "GIF",
    label: "CONTENT 2",
    images: req.files?.page9Content2 ? [req.files.page9Content2[0]] : [],
    caption: req.body.page9Content2Caption || "",
  },
  {
    title: "COLLECTION\nSTILL\nWITH MODEL",
    label: "CONTENT 3",
    images: req.files?.page9Content3 || [],
    caption: req.body.page9Content3Caption || "",
  },
];

const boxWidth = 100;
const boxHeight = 100;
const boxX = 60;
const startY = height - 100;
const gapY = 180;
const imageStartX = 200;
const maxImageWidth = 80;
const maxImageHeight = 80;
const imageGap = 20;

for (let i = 0; i < contentBoxes.length; i++) {
  const block = contentBoxes[i];
  const y = startY - i * gapY;

  // Draw title box
  page9.drawRectangle({
    x: boxX,
    y: y - boxHeight,
    width: boxWidth,
    height: boxHeight,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });

  // Title text
  const titleLines = block.title.split("\n");
  titleLines.forEach((line, j) => {
    const textWidth = font.widthOfTextAtSize(line, 10);
    page9.drawText(line, {
      x: boxX + (boxWidth - textWidth) / 2,
      y: y - 20 - j * 12,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
  });

  // Label below
  const labelWidth = font.widthOfTextAtSize(block.label, 10);
  page9.drawText(block.label, {
    x: boxX + (boxWidth - labelWidth) / 2,
    y: y - boxHeight - 15,
    size: 10,
    font,
    color: rgb(0, 0, 0),
  });

  // Images
  let imageX = imageStartX;
  const imageY = y - 20;

  for (let k = 0; k < block.images.length; k++) {
    const imgFile = block.images[k];
    if (imgFile?.buffer) {
      try {
        const isPng = imgFile.mimetype === "image/png";
        const embeddedImg = isPng
          ? await pdfDoc.embedPng(imgFile.buffer)
          : await pdfDoc.embedJpg(imgFile.buffer);

        // Maintain aspect ratio and fit inside max box
        const originalWidth = embeddedImg.width;
        const originalHeight = embeddedImg.height;
        const widthRatio = maxImageWidth / originalWidth;
        const heightRatio = maxImageHeight / originalHeight;
        const scale = Math.min(widthRatio, heightRatio);

        const drawWidth = originalWidth * scale;
        const drawHeight = originalHeight * scale;

        page9.drawImage(embeddedImg, {
          x: imageX,
          y: imageY - drawHeight,
          width: drawWidth,
          height: drawHeight,
        });

        imageX += drawWidth + imageGap; // increment by actual image width
      } catch (err) {
        console.error(`❌ Image error at block ${i}, image ${k}`, err);
      }
    }
  }

  // Caption
  if (block.caption) {
    const wrapped = block.caption.split("\n");
    wrapped.forEach((line, idx) => {
      page9.drawText(line, {
        x: imageStartX,
        y: y - boxHeight - 40 - idx * 14,
        size: 10,
        font: fontBold,
        color: rgb(0, 0, 0),
      });
    });
  }
}
//Page 10
// === PAGE 10 ===
const page10 = pdfDoc.addPage([width, height]);

// Background with margin
page10.drawRectangle({
  x: 30,
  y: 30,
  width: width - 60,
  height: height - 60,
  color: rgb(0.95, 0.95, 0.95),
});

// Page 10 Data blocks
const contentBoxes10 = [
  {
    title: "PRODUCT\nVIDEO",
    label: "CONTENT 4",
    images: req.files?.page10Content4 ? [req.files.page10Content4[0]] : [],
    caption: "Reference given in the link feel the awesome product video",
  },
  {
    title: "PRODUCT\nCAROUSEL",
    label: "CONTENT 5",
    images: req.files?.page10Content5 || [],
    caption: "1ST IMAGE      2ND IMAGE",
  },
  {
    title: "COLLECTION\nVIDEO\nWITH MODEL",
    label: "CONTENT 6",
    images: [],
    caption: "Reference given in the link feel the awesome model video",
  },
];

// Unique layout values for Page 10
const boxWidth10 = 100;
const boxHeight10 = 100;
const boxX10 = 60;
const startY10 = height - 100;
const gapY10 = 180;
const imageStartX10 = 200;
const imageGap10 = 20;
const maxImageSize10 = 100;

for (let i = 0; i < contentBoxes10.length; i++) {
  const block = contentBoxes10[i];
  const y10 = startY10 - i * gapY10;

  // Box
  page10.drawRectangle({
    x: boxX10,
    y: y10 - boxHeight10,
    width: boxWidth10,
    height: boxHeight10,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });

  // Title text
  const titleLines = block.title.split("\n");
  titleLines.forEach((line, j) => {
    const textWidth = font.widthOfTextAtSize(line, 10);
    page10.drawText(line, {
      x: boxX10 + (boxWidth10 - textWidth) / 2,
      y: y10 - 20 - j * 12,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
  });

  // Label
  const labelWidth = font.widthOfTextAtSize(block.label, 10);
  page10.drawText(block.label, {
    x: boxX10 + (boxWidth10 - labelWidth) / 2,
    y: y10 - boxHeight10 - 15,
    size: 10,
    font,
    color: rgb(0, 0, 0),
  });

  // Images
  let imageX10 = imageStartX10;
  const imageY10 = y10 - 20;

  for (let k = 0; k < block.images.length; k++) {
    const imgFile = block.images[k];
    if (imgFile?.buffer) {
      try {
        let embeddedImg;
        if (imgFile.mimetype === "image/png") {
          embeddedImg = await pdfDoc.embedPng(imgFile.buffer);
        } else if (
          imgFile.mimetype === "image/jpeg" ||
          imgFile.mimetype === "image/jpg"
        ) {
          embeddedImg = await pdfDoc.embedJpg(imgFile.buffer);
        } else {
          console.warn(`Unsupported image type: ${imgFile.mimetype}`);
          continue;
        }

        const origWidth = embeddedImg.width;
        const origHeight = embeddedImg.height;
        let drawWidth = origWidth;
        let drawHeight = origHeight;

        const scaleRatio = Math.min(
          maxImageSize10 / origWidth,
          maxImageSize10 / origHeight,
          1
        );

        drawWidth = origWidth * scaleRatio;
        drawHeight = origHeight * scaleRatio;

        page10.drawImage(embeddedImg, {
          x: imageX10,
          y: imageY10 - drawHeight,
          width: drawWidth,
          height: drawHeight,
        });

        imageX10 += drawWidth + imageGap10;
      } catch (err) {
        console.error(`Page 10 image error block ${i}, img ${k}`, err);
      }
    }
  }

  // Caption below images
  if (block.caption) {
    page10.drawText(block.caption, {
      x: imageStartX10,
      y: y10 - boxHeight10 - 40,
      size: 10,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
  }
}

// === PAGE 11 ===
// Add a new page for Page 11
// Page 11
const page11 = pdfDoc.addPage([width, height]);

// Light grey background with margin
page11.drawRectangle({
  x: 30,
  y: 30,
  width: width - 60,
  height: height - 60,
  color: rgb(0.95, 0.95, 0.95),
});

// Top-left "STORY 2" label
page11.drawText("STORY 2", {
  x: 40,
  y: height - 50,
  size: 12,
  font: fontBold,
  color: rgb(0, 0, 0),
});

// Headline (centered)
const page11Headline = req.body.page11StoryHeadline || "Spread the Awesomeness";
const headlineFontSize = 20;
const headlineTextWidth = fontBold.widthOfTextAtSize(page11Headline, headlineFontSize);
page11.drawText(page11Headline, {
  x: (width - headlineTextWidth) / 2,
  y: height - 90,
  size: headlineFontSize,
  font: fontBold,
  color: rgb(0, 0, 0),
});

// Draw pink board behind image
const boardColor11 = rgb(1, 0.6, 0.6); // light red
 // light pink
const imageBoxY = height - 480;
const imageBoxWidth = 440;
const imageBoxHeight = 300;

page11.drawRectangle({
  x: (width - imageBoxWidth) / 2,
  y: imageBoxY,
  width: imageBoxWidth,
  height: imageBoxHeight,
  color: boardColor11,
});

// Draw image over board
const page11ImageFile = req.files?.page11StoryImage?.[0];
if (page11ImageFile?.buffer) {
  let embeddedImage;
  if (page11ImageFile.mimetype === "image/png") {
    embeddedImage = await pdfDoc.embedPng(page11ImageFile.buffer);
  } else {
    embeddedImage = await pdfDoc.embedJpg(page11ImageFile.buffer);
  }

  const maxWidth = imageBoxWidth+100;
  const maxHeight = imageBoxHeight+70;
  const originalWidth = embeddedImage.width;
  const originalHeight = embeddedImage.height;

  const widthRatio = maxWidth / originalWidth;
  const heightRatio = maxHeight / originalHeight;
  const scale = Math.min(widthRatio, heightRatio);

  const drawWidth = originalWidth * scale;
  const drawHeight = originalHeight * scale;

  page11.drawImage(embeddedImage, {
    x: (width - drawWidth) / 2,
    y: imageBoxY + (imageBoxHeight - drawHeight) / 2,
    width: drawWidth,
    height: drawHeight,
  });
}

// Draw description below image
const page11Desc = req.body.page11StoryDescription || "Bright colors / printed / gradient collection";
const descLines = page11Desc.split("\n");
descLines.forEach((line, index) => {
  const textWidth = font.widthOfTextAtSize(line, 11);
  page11.drawText(line, {
    x: (width - textWidth) / 2,
    y: imageBoxY - 70 - index * 20,
    size: 11,
    font,
    color: rgb(0, 0, 0),
  });
});

// Add Page 12
// Add Page 12
const page12 = pdfDoc.addPage([width, height]);

// Light grey background with white margin
page12.drawRectangle({
  x: 30,
  y: 30,
  width: width - 60,
  height: height - 60,
  color: rgb(0.95, 0.95, 0.95),
});

// Title - GRID LOOK
const gridTitle12 = "GRID LOOK";
const gridTitleFontSize12 = 18;
const gridTitleWidth12 = fontBold.widthOfTextAtSize(gridTitle12, gridTitleFontSize12);
page12.drawText(gridTitle12, {
  x: (width - gridTitleWidth12) / 2,
  y: height - 220,
  size: gridTitleFontSize12,
  font: fontBold,
  color: rgb(0, 0, 0),
});

// Grid layout for Page 12
const boxSize12 = 120;
const boxGapX12 = 30;
const boxGapY12 = 40;
const startX12 = (width - (3 * boxSize12 + 2 * boxGapX12)) / 2;
const startY12 = height - 380;

const boxContents12 = [
  { top: "PRODUCT SHOOT", bottom: "CONTENT 6" },
  { top: "PRODUCT CAROUSEL", bottom: "CONTENT 5" },
  { top: "PRODUCT VIDEO", bottom: "CONTENT 4" },
  { top: "COLLECTION\nSTILL\nWITH MODEL", bottom: "CONTENT 3" },
  { top: "GIF", bottom: "CONTENT 2" },
  { top: "LAY DOIWN\nLOOK", bottom: "CONTENT 1" },
];

for (let i = 0; i < 6; i++) {
  const col = i % 3;
  const row = Math.floor(i / 3);

  const x = startX12 + col * (boxSize12 + boxGapX12);
  const y = startY12 - row * (boxSize12 + boxGapY12);

  // Draw the box
  page12.drawRectangle({
    x,
    y,
    width: boxSize12,
    height: boxSize12,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });

  // Top label inside box
  const lines = boxContents12[i].top.split("\n");
  const lineHeight = 14;
  const totalTextHeight = lines.length * lineHeight;
  lines.forEach((line, index) => {
    const textWidth = font.widthOfTextAtSize(line, 11);
    page12.drawText(line, {
      x: x + (boxSize12 - textWidth) / 2,
      y: y + (boxSize12 + totalTextHeight) / 2 - index * lineHeight - 10,
      size: 11,
      font,
      color: rgb(0, 0, 0),
    });
  });

  // Bottom label
  const bottomText = boxContents12[i].bottom;
  const bottomWidth = font.widthOfTextAtSize(bottomText, 10);
  page12.drawText(bottomText, {
    x: x + (boxSize12 - bottomWidth) / 2,
    y: y - 16,
    size: 10,
    font,
    color: rgb(0, 0, 0),
  });
}

//Page 13
// === PAGE 13 ===
// === PAGE 13 ===
const page13 = pdfDoc.addPage([width, height]);

const leftBoxX13 = 50;
const sectionBoxWidth13 = 180;
const leftBoxHeight13 = 100;
const rightStartX13 = leftBoxX13 + sectionBoxWidth13 + 40;
const imageBoxWidth13 = 100;
const imageBoxHeight13 = 100;
const rowGap13 = 160;

// Page 13 Background
page13.drawRectangle({
  x: 30,
  y: 30,
  width: width - 60,
  height: height - 60,
  color: rgb(0.95, 0.95, 0.95),
});

// Section Data
const sections13 = [
  {
    title: 'LAY DOWN LOOK',
    caption: 'Frames which good for outdoor activity / going out for weekend etc.',
    images: req.files?.page13Content1 || [],
  },
  {
    title: 'GIF',
    caption: 'spread the awesome gif',
    images: req.files?.page13Content2 ? [req.files.page13Content2[0]] : [],
  },
  {
    title: 'COLLECTION STILL \nWITH MODEL',
    caption: 'Image ref 1 | Image ref 2 | Image ref 3',
    images: req.files?.page13Content3 || [],
  },
];

// Draw Left Boxes + Right Images
for (let i = 0; i < sections13.length; i++) {
  const block = sections13[i];

  // Calculate box Y position
  const boxTopY = height - 80 - i * rowGap13;
  const boxBottomY = boxTopY - leftBoxHeight13;

  // Draw Left Gray Box
  page13.drawRectangle({
    x: leftBoxX13,
    y: boxBottomY,
    width: sectionBoxWidth13,
    height: leftBoxHeight13,
    color: rgb(0.9, 0.9, 0.9),
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });

  // Draw Title
  page13.drawText(block.title, {
    x: leftBoxX13 + 10,
    y: boxTopY - 18,
    size: 12,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  // Draw Caption
  const captionFontSize = 9;
  const captionLeftMargin = 10;
  const captionTopMargin = 60;
  const captionLineSpacing = 12;

  const captionLines13 = wrapTextByWidth(
    block.caption,
    font,
    captionFontSize,
    sectionBoxWidth13 - 2 * captionLeftMargin
  );

  captionLines13.forEach((line, idx) => {
    const lineY = boxTopY - captionTopMargin - idx * captionLineSpacing;

    if (lineY > boxBottomY + 10) {
      page13.drawText(line, {
        x: leftBoxX13 + captionLeftMargin,
        y: lineY,
        size: captionFontSize,
        font,
        color: rgb(0.2, 0.2, 0.2),
      });
    }
  });

  // Draw Right-side Images
  let imageX13 = rightStartX13;
  const imageY13 = boxBottomY;

  for (let j = 0; j < block.images.length; j++) {
    const imgFile = block.images[j];
    if (imgFile?.buffer) {
      try {
        const embeddedImg = imgFile.mimetype === 'image/png'
          ? await pdfDoc.embedPng(imgFile.buffer)
          : await pdfDoc.embedJpg(imgFile.buffer);

        const scaleRatio = Math.min(
          imageBoxWidth13 / embeddedImg.width,
          imageBoxHeight13 / embeddedImg.height
        );

        const drawWidth = embeddedImg.width * scaleRatio;
        const drawHeight = embeddedImg.height * scaleRatio;

        page13.drawImage(embeddedImg, {
          x: imageX13,
          y: imageY13,
          width: drawWidth,
          height: drawHeight,
        });

        imageX13 += drawWidth + 15;
      } catch (err) {
        console.error(`Page 13 image error [${block.title}]`, err);
      }
    }
  }
}


// === PAGE 14 ===
const page14 = pdfDoc.addPage([width, height]);

const leftBoxX14 = 60;
const boxWidth14 = 100;
const boxHeight14 = 100;
const rightStartX14 = 200;
const rowGap14 = 180;

const sectionLabels14 = [
  { title: "PRODUCT\nVIDEO", content: "CONTENT 4" },
  { title: "PRODUCT\nCAROUSEL", content: "CONTENT 5" },
  { title: "COLLECTION\nVIDEO\nWITH MODEL", content: "CONTENT 6" },
];

const imageSets14 = {
  content4: req.files?.page14Content1 || [], // 1 image
  content5: req.files?.page14Content2 || [], // 2 images
  content6: req.files?.page14Content3 || []  // 1 image
};

// Page background
page14.drawRectangle({
  x: 30,
  y: 30,
  width: width - 60,
  height: height - 60,
  color: rgb(0.95, 0.95, 0.95),
});

// Draw left boxes and right images
for (let i = 0; i < 3; i++) {
  const topY = height - 80 - i * rowGap14;
  const bottomY = topY - boxHeight14;

  // Draw left box
  page14.drawRectangle({
    x: leftBoxX14,
    y: bottomY,
    width: boxWidth14,
    height: boxHeight14,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });

  // Draw title text (centered)
  const titleLines = sectionLabels14[i].title.split("\n");
  titleLines.forEach((line, j) => {
    const textWidth = font.widthOfTextAtSize(line, 10);
    page14.drawText(line, {
      x: leftBoxX14 + (boxWidth14 - textWidth) / 2,
      y: topY - 20 - j * 14,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
  });

  // Draw content label below
  const labelText = sectionLabels14[i].content;
  const labelWidth = font.widthOfTextAtSize(labelText, 10);
  page14.drawText(labelText, {
    x: leftBoxX14 + (boxWidth14 - labelWidth) / 2,
    y: bottomY - 15,
    size: 10,
    font,
    color: rgb(0, 0, 0),
  });

  // === RIGHT SIDE IMAGES ===
  const imageY = bottomY;
  let caption = "";

  if (i === 0 && imageSets14.content4[0]) {
    // PRODUCT VIDEO IMAGE
    const imgBuffer = imageSets14.content4[0].buffer;
    const embedded = imageSets14.content4[0].mimetype === 'image/png'
      ? await pdfDoc.embedPng(imgBuffer)
      : await pdfDoc.embedJpg(imgBuffer);

    page14.drawImage(embedded, {
      x: rightStartX14,
      y: imageY,
      width: 100,
      height: 100,
    });

    caption = "Refrence given in the link spread the awesome product";

  } else if (i === 1 && imageSets14.content5.length >= 2) {
    // PRODUCT CAROUSEL — 2 Images
    for (let j = 0; j < 2; j++) {
      const imgBuffer = imageSets14.content5[j].buffer;
      const embedded = imageSets14.content5[j].mimetype === 'image/png'
        ? await pdfDoc.embedPng(imgBuffer)
        : await pdfDoc.embedJpg(imgBuffer);

      const imgX = rightStartX14 + j * 120;

      page14.drawImage(embedded, {
        x: imgX,
        y: imageY,
        width: 100,
        height: 100,
      });

      // Add label under each
      page14.drawText(`${j + 1}ST IMAGE`, {
        x: imgX + 10,
        y: imageY - 15,
        size: 9,
        font: fontBold,
        color: rgb(0, 0, 0),
      });
    }

  } else if (i === 2 && imageSets14.content6[0]) {
    // COLLECTION VIDEO IMAGE
    const imgBuffer = imageSets14.content6[0].buffer;
    const embedded = imageSets14.content6[0].mimetype === 'image/png'
      ? await pdfDoc.embedPng(imgBuffer)
      : await pdfDoc.embedJpg(imgBuffer);

    page14.drawImage(embedded, {
      x: rightStartX14,
      y: imageY,
      width: 100,
      height: 100,
    });

    caption = "refrence given in the link spread the awesome model video";
  }

  // Add caption under single images
  if (caption && i !== 1) {
    const captionWidth = font.widthOfTextAtSize(caption, 9);
    page14.drawText(caption, {
      x: rightStartX14,
      y: imageY - 15,
      size: 9,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });
  }
}


// === PAGE 15 ===
// === PAGE 15 BEGIN ===
const page15 = pdfDoc.addPage([width, height]);

// Use unique variable names to avoid redeclaration
const outerMargin15 = 30;
const innerMargin15 = 20;
const backgroundGrey15 = rgb(0.95, 0.95, 0.95);
const redBoardColor15 = rgb(0.8, 0, 0);

// Dynamic user inputs
const storyTitle15 = req.body.page15StoryHeadline || "Your Title Here";
const storyDesc15 = req.body.page15StoryDescription|| "Your description here";
const storyImage15 = req.files?.page15StoryImage?.[0];

// Fonts and sizes
const titleFontSize15 = 20;
const descFontSize15 = 12;

// === Draw white margin background
page15.drawRectangle({
  x: 0,
  y: 0,
  width: width,
  height: height,
  color: rgb(1, 1, 1),
});

// === Draw light grey inner box
page15.drawRectangle({
  x: outerMargin15,
  y: outerMargin15,
  width: width - 2 * outerMargin15,
  height: height - 2 * outerMargin15,
  color: backgroundGrey15,
});

// === Static Label: STORY 3
page15.drawText("STORY 3", {
  x: outerMargin15 + 5,
  y: height - outerMargin15 - 12,
  size: 10,
  font: font,
  color: rgb(0, 0, 0),
});

// === Title - Centered
const titleLines = storyTitle15.split("\n");
titleLines.forEach((line, i) => {
  const textWidth = fontBold.widthOfTextAtSize(line, titleFontSize15);
  page15.drawText(line, {
    x: (width - textWidth) / 2,
    y: height - outerMargin15 - 40 - i * 24,
    size: titleFontSize15,
    font: fontBold,
    color: rgb(0, 0, 0),
  });
});

// === Red rectangle behind image
// === FLEXIBLE SETTINGS FOR RED BOX ===
// === Page 15 Red Box ===
const redBoxMarginX15 = 100;            // Increased margin for reduced width
const redBoxMarginTop15 = 550;          // 150px from top
const redBoxHeight15 = 350;              // red box height
const redBoxColor15 = rgb(0.9, 0, 0);   // bright red

const redBoxWidth15 = width - 2 * redBoxMarginX15;  // narrower width
const redBoxX15 = redBoxMarginX15;
const redRectY15 = height - redBoxMarginTop15;

page15.drawRectangle({
  x: redBoxX15,
  y: redRectY15,
  width: redBoxWidth15,
  height: redBoxHeight15,
  color: redBoxColor15,
});


// === Image on top of red strip
if (storyImage15) {
  const imageBuffer = storyImage15.buffer;
  const imgEmbed = storyImage15.mimetype === "image/png"
    ? await pdfDoc.embedPng(imageBuffer)
    : await pdfDoc.embedJpg(imageBuffer);

  const imgWidth15 = 320;           // wider image
  const imgHeight15 = 480;          // taller image
  const imgX15 = (width - imgWidth15) / 2;
  const imgMarginTop15 = 130;       // 🟢 fixed margin from top of page
  const imgY15 = height - imgMarginTop15;

  page15.drawImage(imgEmbed, {
    x: imgX15,
    y: imgY15 - imgHeight15,       // subtract height to place bottom correctly
    width: imgWidth15,
    height: imgHeight15,
  });
}



// === Description under image - centered
const descLines15 = storyDesc15.split("\n");
descLines15.forEach((line, i) => {
  const lineWidth = font.widthOfTextAtSize(line, descFontSize15);
  page15.drawText(line, {
    x: (width - lineWidth) / 2,
    y: redRectY15 - 200 - i * 16,
    size: descFontSize15,
    font,
    color: rgb(0, 0, 0),
  });
});


// === PAGE 16 START ===
// === PAGE 16 — GRID LOOK (Safe & Consistent) ===
const page16 = pdfDoc.addPage([width, height]);

// Reuse existing fonts
const fontPg16 = font;
const fontBoldPg16 = fontBold;

// Unique layout variables for Page 16 only
const boxSizePg16 = 100;
const boxGapXPg16 = 50;
const boxGapYPg16 = 60;
const columnsPg16 = 3;
const outerMarginPg16 = 40;

// Backgrounds
page16.drawRectangle({
  x: 0,
  y: 0,
  width,
  height,
  color: rgb(1, 1, 1), // White outer
});
page16.drawRectangle({
  x: outerMarginPg16,
  y: outerMarginPg16,
  width: width - 2 * outerMarginPg16,
  height: height - 2 * outerMarginPg16,
  color: rgb(0.94, 0.94, 0.94), // Light gray inner
});

// Title
// Title: GRID LOOK with top spacing
const gridTitlePg16 = "GRID LOOK";
const gridTitleFontSizePg16 = 14;
const gridTitleWidthPg16 = fontBoldPg16.widthOfTextAtSize(gridTitlePg16, gridTitleFontSizePg16);

// Define vertical space from top (margin from top of page)
const topMarginFromPage16 = 250; // Increase for more vertical spacing

const gridTitleYPg16 = height - topMarginFromPage16;

page16.drawText(gridTitlePg16, {
  x: (width - gridTitleWidthPg16) / 2,
  y: gridTitleYPg16,
  size: gridTitleFontSizePg16,
  font: fontBoldPg16,
  color: rgb(0, 0, 0),
});


// Grid Data
const gridDataPg16 = [
  { label: "PRODUCT SHOOT", caption: "CONTENT 6" },
  { label: "PRODUCT CAROUSEL", caption: "CONTENT 5" },
  { label: "PRODUCT VIDEO", caption: "CONTENT 4" },
  { label: "COLLECTION\nSTILL\nWITH MODEL", caption: "CONTENT 3" },
  { label: "GIF", caption: "CONTENT 2" },
  { label: "LAY DOWN\nLOOK", caption: "CONTENT 1" },
];

// Grid positioning
const startXPg16 = (width - (columnsPg16 * boxSizePg16 + (columnsPg16 - 1) * boxGapXPg16)) / 2;
const startYPg16 = gridTitleYPg16 - 80;

for (let i = 0; i < gridDataPg16.length; i++) {
  const col = i % columnsPg16;
  const row = Math.floor(i / columnsPg16);

  const x = startXPg16 + col * (boxSizePg16 + boxGapXPg16);
  const y = startYPg16 - row * (boxSizePg16 + boxGapYPg16);

  // Draw box
  page16.drawRectangle({
    x,
    y,
    width: boxSizePg16,
    height: boxSizePg16,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });

  // Inside label
  const lines = gridDataPg16[i].label.split("\n");
  const lineHeight = 12;
  const totalTextHeight = lines.length * lineHeight;
  const textStartY = y + (boxSizePg16 + totalTextHeight) / 2 - lineHeight;

  lines.forEach((line, j) => {
    const lineWidth = fontPg16.widthOfTextAtSize(line, 9);
    page16.drawText(line, {
      x: x + (boxSizePg16 - lineWidth) / 2,
      y: textStartY - j * lineHeight,
      size: 9,
      font: fontPg16,
      color: rgb(0, 0, 0),
    });
  });

  // Caption below
  const caption = gridDataPg16[i].caption;
  const captionWidth = fontPg16.widthOfTextAtSize(caption, 8);
  page16.drawText(caption, {
    x: x + (boxSizePg16 - captionWidth) / 2,
    y: y - 18,
    size: 8,
    font: fontPg16,
    color: rgb(0, 0, 0),
  });
}


// === PAGE 16 END ===
const page17 = pdfDoc.addPage([width, height]);

const leftBoxX17 = 50;
const sectionBoxWidth17 = 180;
const leftBoxHeight17 = 100;
const rightStartX17 = leftBoxX17 + sectionBoxWidth17 + 40;
const imageBoxWidth17 = 100;
const imageBoxHeight17 = 100;
const rowGap17 = 160;

// Page 17 Background
page17.drawRectangle({
  x: 30,
  y: 30,
  width: width - 60,
  height: height - 60,
  color: rgb(0.95, 0.95, 0.95),
});

// Section Data with same titles/captions as Page 13
const sections17 = [
  {
    title: 'LAY DOWN LOOK',
    caption: 'Frames which good for outdoor activity / going out for weekend etc.',
    images: req.files?.page17Content1 || [],
  },
  {
    title: 'GIF',
    caption: 'spread the awesome gif',
    images: req.files?.page17Content2 ? [req.files.page17Content2[0]] : [],
  },
  {
    title: 'COLLECTION STILL \nWITH MODEL',
    caption: 'Image ref 1 | Image ref 2 | Image ref 3',
    images: req.files?.page17Content3 || [],
  },
];

// Draw Left Boxes + Right Images
for (let i = 0; i < sections17.length; i++) {
  const block = sections17[i];

  // Calculate box Y position
  const boxTopY = height - 80 - i * rowGap17;
  const boxBottomY = boxTopY - leftBoxHeight17;

  // Draw Left Gray Box
  page17.drawRectangle({
    x: leftBoxX17,
    y: boxBottomY,
    width: sectionBoxWidth17,
    height: leftBoxHeight17,
    color: rgb(0.9, 0.9, 0.9),
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });

  // Draw Title
  page17.drawText(block.title, {
    x: leftBoxX17 + 10,
    y: boxTopY - 18,
    size: 12,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  // Draw Caption
  const captionFontSize = 9;
  const captionLeftMargin = 10;
  const captionTopMargin = 60;
  const captionLineSpacing = 12;

  const captionLines17 = wrapTextByWidth(
    block.caption,
    font,
    captionFontSize,
    sectionBoxWidth17 - 2 * captionLeftMargin
  );

  captionLines17.forEach((line, idx) => {
    const lineY = boxTopY - captionTopMargin - idx * captionLineSpacing;

    if (lineY > boxBottomY + 10) {
      page17.drawText(line, {
        x: leftBoxX17 + captionLeftMargin,
        y: lineY,
        size: captionFontSize,
        font,
        color: rgb(0.2, 0.2, 0.2),
      });
    }
  });

  // Draw Right-side Images
  let imageX17 = rightStartX17;
  const imageY17 = boxBottomY;

  for (let j = 0; j < block.images.length; j++) {
    const imgFile = block.images[j];
    if (imgFile?.buffer) {
      try {
        const embeddedImg = imgFile.mimetype === 'image/png'
          ? await pdfDoc.embedPng(imgFile.buffer)
          : await pdfDoc.embedJpg(imgFile.buffer);

        const scaleRatio = Math.min(
          imageBoxWidth17 / embeddedImg.width,
          imageBoxHeight17 / embeddedImg.height
        );

        const drawWidth = embeddedImg.width * scaleRatio;
        const drawHeight = embeddedImg.height * scaleRatio;

        page17.drawImage(embeddedImg, {
          x: imageX17,
          y: imageY17,
          width: drawWidth,
          height: drawHeight,
        });

        imageX17 += drawWidth + 15;
      } catch (err) {
        console.error(`Page 17 image error [${block.title}]`, err);
      }
    }
  }
}
//Page 18
const page18 = pdfDoc.addPage([width, height]);

const leftBoxX18 = 60;
const boxWidth18 = 100;
const boxHeight18 = 100;
const rightStartX18 = 200;
const rowGap18 = 180;

// Page 18 Background
page18.drawRectangle({
  x: 30,
  y: 30,
  width: width - 60,
  height: height - 60,
  color: rgb(0.95, 0.95, 0.95),
});

// Add page name label top-left like "PAGE 18"


const sectionLabels18 = [
  { title: "PRODUCT\nVIDEO", content: "CONTENT 4" },
  { title: "PRODUCT\nCAROUSEL", content: "CONTENT 5" },
  { title: "COLLECTION\nVIDEO\nWITH MODEL", content: "CONTENT 6" },
];

const imageSets18 = {
  content4: req.files?.page18Content1 || [], // 1 image
  content5: req.files?.page18Content2 || [], // 2 images
  content6: req.files?.page18Content3 || []  // 1 image
};

// Draw left boxes and right images
for (let i = 0; i < 3; i++) {
  const topY = height - 80 - i * rowGap18;
  const bottomY = topY - boxHeight18;

  // Draw left box
  page18.drawRectangle({
    x: leftBoxX18,
    y: bottomY,
    width: boxWidth18,
    height: boxHeight18,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });

  // Draw title text (centered)
  const titleLines = sectionLabels18[i].title.split("\n");
  titleLines.forEach((line, j) => {
    const textWidth = font.widthOfTextAtSize(line, 10);
    page18.drawText(line, {
      x: leftBoxX18 + (boxWidth18 - textWidth) / 2,
      y: topY - 20 - j * 14,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
  });

  // Draw content label below
  const labelText = sectionLabels18[i].content;
  const labelWidth = font.widthOfTextAtSize(labelText, 10);
  page18.drawText(labelText, {
    x: leftBoxX18 + (boxWidth18 - labelWidth) / 2,
    y: bottomY - 15,
    size: 10,
    font,
    color: rgb(0, 0, 0),
  });

  // === RIGHT SIDE IMAGES ===
  const imageY = bottomY;
  let caption = "";

  if (i === 0 && imageSets18.content4[0]) {
    // PRODUCT VIDEO IMAGE
    const imgBuffer = imageSets18.content4[0].buffer;
    const embedded = imageSets18.content4[0].mimetype === 'image/png'
      ? await pdfDoc.embedPng(imgBuffer)
      : await pdfDoc.embedJpg(imgBuffer);

    page18.drawImage(embedded, {
      x: rightStartX18,
      y: imageY,
      width: 100,
      height: 100,
    });

    caption = "Reference given in the link — awesome product video";

  } else if (i === 1 && imageSets18.content5.length >= 2) {
    // PRODUCT CAROUSEL — 2 Images
    for (let j = 0; j < 2; j++) {
      const imgBuffer = imageSets18.content5[j].buffer;
      const embedded = imageSets18.content5[j].mimetype === 'image/png'
        ? await pdfDoc.embedPng(imgBuffer)
        : await pdfDoc.embedJpg(imgBuffer);

      const imgX = rightStartX18 + j * 120;

      page18.drawImage(embedded, {
        x: imgX,
        y: imageY,
        width: 100,
        height: 100,
      });

      // Add label under each
      page18.drawText(`${j + 1}ST IMAGE`, {
        x: imgX + 10,
        y: imageY - 15,
        size: 9,
        font: fontBold,
        color: rgb(0, 0, 0),
      });
    }

  } else if (i === 2 && imageSets18.content6[0]) {
    // COLLECTION VIDEO IMAGE
    const imgBuffer = imageSets18.content6[0].buffer;
    const embedded = imageSets18.content6[0].mimetype === 'image/png'
      ? await pdfDoc.embedPng(imgBuffer)
      : await pdfDoc.embedJpg(imgBuffer);

    page18.drawImage(embedded, {
      x: rightStartX18,
      y: imageY,
      width: 100,
      height: 100,
    });

    caption = "Reference given in the link — awesome model video";
  }

  // Add caption under single images
  if (caption && i !== 1) {
    const captionWidth = font.widthOfTextAtSize(caption, 9);
    page18.drawText(caption, {
      x: rightStartX18,
      y: imageY - 15,
      size: 9,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });
  }
}
const page19 = pdfDoc.addPage([width, height]);

// Draw background (same as other pages)
page19.drawRectangle({
  x: 30,
  y: 30,
  width: width - 60,
  height: height - 60,
  color: rgb(0.95, 0.95, 0.95),
});

// Thank You message
const thankYouText = "Thank You!";
const fontSize = 30;
const textWidth = fontBold.widthOfTextAtSize(thankYouText, fontSize);
const textHeight = fontSize; // approximate height

// Calculate center position
const x = (width - textWidth) / 2;
const y = (height - textHeight) / 2;

page19.drawText(thankYouText, {
  x,
  y,
  size: fontSize,
  font: fontBold,
  color: rgb(0, 0, 0),
});


    // SAVE + RESPOND
    const pdfBytes = await pdfDoc.save();
    if (req.query.preview === "true") {
      const base64String = Buffer.from(pdfBytes).toString("base64");
      res.json({ base64: base64String });
    } else {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=campaign.pdf");
      res.send(pdfBytes);
    }
  } catch (err) {
    console.error("❌ PDF Generation Error:", err);
    res.status(500).send("Failed to generate PDF.");
  }
});

// ✅ Utility to wrap long paragraphs
function wrapTextByWidth(text, font, fontSize, maxWidth) {
  const sanitizedText = text
    .replace(/[\r\n]+/g, " ")
    .replace(/[^\x00-\x7F]/g, "");
  const words = sanitizedText.split(" ");
  const lines = [];
  let line = "";

  for (const word of words) {
    const testLine = line ? line + " " + word : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);
    if (width > maxWidth) {
      lines.push(line.trim());
      line = word;
    } else {
      line = testLine;
    }
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

module.exports = router;
