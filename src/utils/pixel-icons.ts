import { html } from 'lit';

/**
 * Super simple, pixelated SVG icons.
 * All paths use sharp grid steps (no curves/arcs).
 */

// Pixelated Color Swatch Icon
export const iconPixelColor = html`
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="12" height="12" fill="currentColor" stroke="#000000" stroke-width="2" />
    <rect x="4" y="4" width="4" height="4" fill="#09090b" />
    <rect x="8" y="8" width="4" height="4" fill="#71717a" />
  </svg>
`;

// Pixelated Paint Brush Icon
export const iconPixelBrush = html`
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 1L14 5L12 7L8 3L10 1ZM7 4L11 8L6 13H2V9L7 4ZM4 11V12H5L8 9L7 8L4 11Z" />
  </svg>
`;

// Pixelated Letter 'A' Icon
export const iconPixelLetter = html`
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 2H10V4H12V14H10V10H6V14H4V4H6V2ZM6 6V8H10V6H6Z" />
  </svg>
`;

// Pixelated Number '7' Icon
export const iconPixelNumber = html`
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 2H12V4L8 14H6L10 4H4V2Z" />
  </svg>
`;

// Pixelated Plus (Zoom In) Icon
export const iconZoomIn = html`
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 2H9V7H14V9H9V14H7V9H2V7H7V2Z" />
  </svg>
`;

// Pixelated Minus (Zoom Out) Icon
export const iconZoomOut = html`
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 7H14V9H2V7Z" />
  </svg>
`;

// Pixelated Center Target Icon
export const iconReset = html`
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 2H6V4H4V6H2V2ZM10 2H14V6H12V4H10V2ZM2 10H4V12H6V14H2V10ZM12 12H10V14H14V10H12V12ZM7 7H9V9H7V7Z" />
  </svg>
`;

// Pixelated Grid Icon
export const iconGrid = html`
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 2H6V6H2V2ZM10 2H14V6H10V2ZM2 10H6V14H2V10ZM10 10H14V14H10V10Z" />
  </svg>
`;

// Pixelated Question Mark / Help Icon
export const iconHelp = html`
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 3H11V5H13V8H11V10H9V11H7V8H9V6H5V3ZM7 13H9V15H7V13Z" />
  </svg>
`;

// Pixelated Close 'X' Icon
export const iconClose = html`
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 2H5L8 5L11 2H14V5L11 8L14 11V14H11L8 11L5 14H2V11L5 8L2 5V2Z" />
  </svg>
`;

// 100% Pixelated Clock / History Icon (Zero Curves)
export const iconHistory = html`
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 2H11V4H13V6H15V10H13V12H11V14H5V12H3V10H1V6H3V4H5V2ZM5 4V6H3V10H5V12H11V10H13V6H11V4H5ZM7 5H9V8H12V10H7V5Z" />
  </svg>
`;

// Pixelated Keyboard Icon
export const iconKeyboard = html`
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 3H15V13H1V3ZM3 5V7H5V5H3ZM7 5V7H9V5H7ZM11 5V7H13V5H11ZM3 9V11H13V9H3Z" />
  </svg>
`;
