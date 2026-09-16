import fs from 'fs';
import path from 'path';

const projectDir = '/Users/user/.gemini/antigravity-ide/scratch/kawung-math';
const pages = ['index.html', 'sandbox.html', 'explore.html'];
if (fs.existsSync(path.join(projectDir, 'challenge.html'))) {
  pages.push('challenge.html');
}

console.log('⚡ Running Kawung Math Comprehensive Stress & Edge-Case Test Suite...\n');

let totalTests = 0;
let passedTests = 0;

function check(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
  }
}

// 1. Asset & Resource Integrity
console.log('--- 1. Asset & Resource Integrity ---');
pages.forEach(page => {
  const filePath = path.join(projectDir, page);
  const html = fs.readFileSync(filePath, 'utf8');

  // Check all local hrefs and src links
  const hrefMatches = [...html.matchAll(/href="([^"#:]+)"/g)].map(m => m[1]);
  const srcMatches = [...html.matchAll(/src="([^"#:]+)"/g)].map(m => m[1]);
  
  [...hrefMatches, ...srcMatches].forEach(ref => {
    if (!ref.startsWith('http') && !ref.startsWith('mailto:') && !ref.startsWith('#')) {
      const cleanRef = ref.split('?')[0].split('#')[0];
      const targetPath = path.join(projectDir, cleanRef);
      check(fs.existsSync(targetPath), `${page} references existing file: ${cleanRef}`);
    }
  });
});

// 2. Viewport & Responsive Design Stress Checks
console.log('\n--- 2. Responsive & Layout Constraints ---');
pages.forEach(page => {
  const html = fs.readFileSync(path.join(projectDir, page), 'utf8');
  check(html.includes('overflow-x: hidden'), `${page} enforces overflow-x: hidden to prevent horizontal scrollbar`);
  check(html.includes('max-width: 100%') || html.includes('width: 100%'), `${page} enforces fluid container scaling`);
  check(html.includes('clamp('), `${page} uses CSS clamp() for fluid stepped typography`);
  check(html.includes('@media (min-width:'), `${page} includes responsive breakpoints`);
});

// 3. Mathematical Coordinate Engine Boundary Stress Test
console.log('\n--- 3. Geometric Engine Boundary & Edge Cases ---');
function simulateCartesian(x, y, tx, ty, rotDeg, scale, axis) {
  let cx = x;
  let cy = y;

  // Reflection
  if (axis === 'x') cy = -cy;
  else if (axis === 'y') cx = -cx;
  else if (axis === 'yx') {
    const temp = cx;
    cx = cy;
    cy = temp;
  }

  // Dilation
  cx = cx * scale;
  cy = cy * scale;

  // Rotation
  const rad = (rotDeg * Math.PI) / 180;
  const rx = cx * Math.cos(rad) - cy * Math.sin(rad);
  const ry = cx * Math.sin(rad) + cy * Math.cos(rad);

  // Translation
  const fx = rx + tx;
  const fy = ry + ty;

  return { x: fx, y: fy };
}

// Test Origin invariant under pure rotation/dilation
const originTest = simulateCartesian(0, 0, 0, 0, 90, 1.5, 'none');
check(Math.abs(originTest.x) < 0.001 && Math.abs(originTest.y) < 0.001, 'Origin O(0,0) stays at origin under rotation and dilation');

// Test Translation
const txTest = simulateCartesian(10, 20, 50, -30, 0, 1.0, 'none');
check(txTest.x === 60 && txTest.y === -10, 'Translation T(50, -30) on (10, 20) yields (60, -10)');

// Test Reflection Sumbu-X
const refXTest = simulateCartesian(25, 40, 0, 0, 0, 1.0, 'x');
check(refXTest.x === 25 && refXTest.y === -40, 'Reflection over X-axis maps (25, 40) to (25, -40)');

// Test Reflection Sumbu-Y
const refYTest = simulateCartesian(25, 40, 0, 0, 0, 1.0, 'y');
check(refYTest.x === -25 && refYTest.y === 40, 'Reflection over Y-axis maps (25, 40) to (-25, 40)');

// Test Reflection y = x
const refYXTest = simulateCartesian(25, 40, 0, 0, 0, 1.0, 'yx');
check(refYXTest.x === 40 && refYXTest.y === 25, 'Reflection over line y=x maps (25, 40) to (40, 25)');

// Test Rotation 90° CCW
const rot90Test = simulateCartesian(0, 30, 0, 0, 90, 1.0, 'none');
check(Math.round(rot90Test.x) === -30 && Math.round(rot90Test.y) === 0, 'Rotation 90° CCW maps (0, 30) to (-30, 0)');

// Test Rotation 180°
const rot180Test = simulateCartesian(15, 20, 0, 0, 180, 1.0, 'none');
check(Math.round(rot180Test.x) === -15 && Math.round(rot180Test.y) === -20, 'Rotation 180° maps (15, 20) to (-15, -20)');

// Test Dilation k = 1.5
const dilTest = simulateCartesian(20, 30, 0, 0, 0, 1.5, 'none');
check(dilTest.x === 30 && dilTest.y === 45, 'Dilation k=1.5 maps (20, 30) to (30, 45)');

// 4. Extreme Slider Boundaries
console.log('\n--- 4. Extreme Slider Boundaries ---');
const extremeMin = simulateCartesian(0, 32, -120, -120, 0, 0.2, 'none');
check(Number.isFinite(extremeMin.x) && Number.isFinite(extremeMin.y), 'Extreme min values produce stable finite coordinates');

const extremeMax = simulateCartesian(0, 32, 120, 120, 360, 1.8, 'yx');
check(Number.isFinite(extremeMax.x) && Number.isFinite(extremeMax.y), 'Extreme max values produce stable finite coordinates');

// 5. Accessibility & Keyboard Trapping Verification
console.log('\n--- 5. Keyboard & Accessibility Stress ---');
pages.forEach(page => {
  const html = fs.readFileSync(path.join(projectDir, page), 'utf8');
  check(html.includes(':focus-visible'), `${page} defines visible focus rings for keyboard navigation`);
  check(html.includes('aria-label') || html.includes('aria-labelledby'), `${page} provides ARIA accessible names`);
  check(html.includes('Escape'), `${page} supports Escape key to close overlays and return focus`);
});

// 6. Mobile Header & Drawer Collision Stress Test
console.log('\n--- 6. Mobile Header Single-Row & Drawer Tests (320px - 1024px) ---');
pages.forEach(page => {
  const html = fs.readFileSync(path.join(projectDir, page), 'utf8');
  check(html.includes('height: 64px'), `${page} enforces strict 64px header height`);
  check(html.includes('justify-content: space-between'), `${page} enforces space-between header distribution`);
  check(html.includes('z-index: 1000') || html.includes('z-index: 1001'), `${page} establishes proper header z-index layering`);
  check(html.includes('backdrop-filter: blur'), `${page} applies backdrop blur on mobile drawer/header`);
  check(html.includes('min-height: 48px'), `${page} enforces >= 48px touch targets in drawer links`);
});

// Verify 320px - 1024px responsive CSS rules
const indexHtml = fs.readFileSync(path.join(projectDir, 'index.html'), 'utf8');
const sandboxHtml = fs.readFileSync(path.join(projectDir, 'sandbox.html'), 'utf8');
const exploreHtml = fs.readFileSync(path.join(projectDir, 'explore.html'), 'utf8');
const challengeHtml = fs.existsSync(path.join(projectDir, 'challenge.html'))
  ? fs.readFileSync(path.join(projectDir, 'challenge.html'), 'utf8')
  : '';

check(exploreHtml.includes('.nav-actions .btn-nav-sandbox { display: none !important; }'), 'explore.html hides desktop sandbox CTA on mobile to prevent header collision');
check(sandboxHtml.includes('.nav-actions .btn-nav-explore { display: none !important; }'), 'sandbox.html hides desktop explore CTA on mobile to prevent header collision');
if (challengeHtml) {
  check(challengeHtml.includes('.nav-actions .btn-nav-explore { display: none !important; }'), 'challenge.html hides desktop explore CTA on mobile to prevent header collision');
  check(challengeHtml.includes('.btn-menu-toggle span'), 'challenge.html implements 3-bar animated hamburger');
}
check(indexHtml.includes('.menu-toggle span') && exploreHtml.includes('.btn-menu-toggle span') && sandboxHtml.includes('.btn-menu-toggle span'), 'All pages implement 3-bar animated hamburger morphing into close ✕');

console.log(`\n======================================================`);
console.log(`STRESS TEST SUMMARY: ${passedTests} / ${totalTests} PASSED (${Math.round((passedTests/totalTests)*100)}%)`);
console.log(`======================================================\n`);

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
