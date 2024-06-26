// Generate a random hex color
import { randomInRange } from "./utils";

function randomHue() {
  const h = Math.floor(Math.random() * 360);
  const s = randomInRange(50, 100);
  const l = randomInRange(25, 50);
  return hslToHex(h, s, l);
}

function hslToHex(h: number, s: number, l: number) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Convert hex to RGB
function hexToRgb(hex: string) {
  hex = hex.replace("#", "");
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

// Convert RGB to hex
function rgbToHex(r: number, g: number, b: number) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
}

// Interpolate between two colors
function interpolateColor(color1: number[], color2: number[], factor: number) {
  const result = color1.slice();
  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (color2[i] - result[i]));
  }
  return result;
}

// Generate the gradient
function generateGradient(
  startHex: string,
  middleHex: string,
  middleEnabled: boolean,
  endHex: string,
  steps: number
) {
  const startRgb = hexToRgb(startHex);
  const endRgb = hexToRgb(endHex);
  const gradient = [];

  if (middleEnabled) {
    const middleRgb = hexToRgb(middleHex);
    const halfSteps = Math.floor(steps / 2);

    for (let i = 0; i < halfSteps; i++) {
      const factor = i / (halfSteps - 1);
      const color = interpolateColor(startRgb, middleRgb, factor);
      gradient.push(shortenHex(rgbToHex(color[0], color[1], color[2])));
    }

    for (let i = 0; i < steps - halfSteps; i++) {
      const factor = i / (steps - halfSteps - 1);
      const color = interpolateColor(middleRgb, endRgb, factor);
      gradient.push(shortenHex(rgbToHex(color[0], color[1], color[2])));
    }
  } else {
    for (let i = 0; i < steps; i++) {
      const factor = i / (steps - 1);
      const color = interpolateColor(startRgb, endRgb, factor);
      gradient.push(shortenHex(rgbToHex(color[0], color[1], color[2])));
    }
  }

  return gradient;
}

// Convert 6-digit hex color to 3-digit
function shortenHex(hex: string) {
  // convert 6-digit hex color to 3-digit
  /*
  R = round(0xRR/0xFF*0xF)
  G = round(0xGG/0xFF*0xF)
  B = round(0xBB/0xFF*0xF)
   */
  const r = Math.round((parseInt(hex.slice(1, 3), 16) / 255) * 15).toString(16);
  const g = Math.round((parseInt(hex.slice(3, 5), 16) / 255) * 15).toString(16);
  const b = Math.round((parseInt(hex.slice(5, 7), 16) / 255) * 15).toString(16);
  return `#${r}${g}${b}`.toUpperCase();
}

function applyColorsToHTMLString(colors: string[], htmlstring: string) {
  console.log(colors, htmlstring);
  let colorIndex = 0; // To keep track of the index in the colors array
  let result = ""; // To store the resulting string with colors
  let isTag = false; // Flag to check if we are inside an HTML tag

  for (let i = 0; i < htmlstring.length; i++) {
    let char = htmlstring[i];

    if (char === "<") {
      isTag = true; // Entering an HTML tag
      result += char;
    } else if (char === ">") {
      isTag = false; // Exiting an HTML tag
      result += char;
    } else if (isTag) {
      // If inside a tag, just append the character
      result += char;
    } else {
      // If not inside a tag, wrap the character with a span and apply the color
      result += `<span style="color: ${colors[colorIndex]}">${char}</span>`;
      colorIndex++;
    }
  }

  return result;
}

export {
  generateGradient,
  shortenHex,
  rgbToHex,
  hexToRgb,
  randomHue,
  hslToHex,
  applyColorsToHTMLString,
};
