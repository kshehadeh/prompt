import sharp from "sharp";
import { writeFileSync } from "fs";
import { join } from "path";

// Create SVG with white rounded rectangle and three black dots
const width = 200;
const height = 100;
const cornerRadius = 12;
const rectX = 20;
const rectY = 20;
const rectWidth = width - 40;
const rectHeight = height - 40;

const dotRadius = 8;
const dotY = height / 2;
const spacing = 40;
const startX = width / 2 - spacing;

const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Rounded rectangle with border (white fill, black border) -->
  <rect 
    x="${rectX}" 
    y="${rectY}" 
    width="${rectWidth}" 
    height="${rectHeight}" 
    rx="${cornerRadius}" 
    ry="${cornerRadius}" 
    fill="#ffffff" 
    stroke="#000000" 
    stroke-width="2"
  />
  
  <!-- Three black dots -->
  <circle cx="${startX}" cy="${dotY}" r="${dotRadius}" fill="#000000"/>
  <circle cx="${startX + spacing}" cy="${dotY}" r="${dotRadius}" fill="#000000"/>
  <circle cx="${startX + spacing * 2}" cy="${dotY}" r="${dotRadius}" fill="#000000"/>
</svg>
`;

// Convert SVG to PNG using sharp (PNG supports transparency)
const buffer = await sharp(Buffer.from(svg), {
  density: 300, // Higher density for better quality
})
  .png()
  .toBuffer();

// Write to file (using PNG for transparency support)
const outputPath = join(process.cwd(), "public", "images", "favicon.png");
writeFileSync(outputPath, buffer);

console.log(`Image created successfully at ${outputPath}`);
