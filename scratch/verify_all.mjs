import fs from 'fs';
import path from 'path';

// Support both running from project directory (node scratch/verify_all.mjs) or absolute path
const defaultProjectDir = '/Users/user/.gemini/antigravity-ide/scratch/kawung-math';
const projectDir = fs.existsSync(path.join(process.cwd(), 'index.html'))
  ? process.cwd()
  : defaultProjectDir;

const files = ['index.html', 'sandbox.html', 'explore.html'];
if (fs.existsSync(path.join(projectDir, 'challenge.html'))) {
  files.push('challenge.html');
}
if (fs.existsSync(path.join(projectDir, '404.html'))) {
  files.push('404.html');
}

console.log('🧪 Starting Kawung Math Deep Verification & WCAG 2.5.3 Audit Script...\n');

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
  }
}

function cleanText(str) {
  return str.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

// 1. File existence & basic checks
console.log('--- 1. File Existence & Structure ---');
assert(fs.existsSync(path.join(projectDir, '404.html')), 'File exists: 404.html');
assert(fs.existsSync(path.join(projectDir, 'favicon.svg')), 'File exists: favicon.svg');
assert(fs.existsSync(path.join(projectDir, 'favicon.ico')), 'File exists: favicon.ico');

files.forEach(file => {
  const filePath = path.join(projectDir, file);
  assert(fs.existsSync(filePath), `File exists: ${file}`);
  const content = fs.readFileSync(filePath, 'utf8');
  assert(content.includes('<!DOCTYPE html>'), `${file} has valid DOCTYPE`);
  assert(content.includes('<html lang="id"'), `${file} has Indonesian html lang`);
  assert(content.includes('<meta name="viewport" content="width=device-width, initial-scale=1.0">'), `${file} has mobile viewport`);
  assert(content.includes('::selection') && content.includes('#C26D38'), `${file} has #C26D38 custom text selection`);
  assert(content.includes('Made with Love by <a href="https://instagram.com/robawati"'), `${file} has uniform footer with Robawati Instagram link`);
});

// 1.1 SEO, Favicon & Metadata Checks (index.html, explore.html, sandbox.html, challenge.html)
console.log('\n--- 1.1 SEO, Favicon & Title Dash Audit ---');
['index.html', 'explore.html', 'sandbox.html', 'challenge.html'].forEach(file => {
  const filePath = path.join(projectDir, file);
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');

  // Favicon absolute tags
  assert(
    content.includes('<link rel="icon" type="image/svg+xml" href="https://kawung-math.vercel.app/favicon.svg">'),
    `${file} has explicit absolute favicon.svg link tag`
  );
  assert(
    content.includes('<link rel="alternate icon" href="https://kawung-math.vercel.app/favicon.ico">'),
    `${file} has explicit absolute favicon.ico link tag`
  );

  // Title tag must not contain dash '-' or em-dash '—'
  const titleMatch = content.match(/<title>(.*?)<\/title>/i);
  assert(titleMatch && titleMatch[1], `${file} has a <title> tag`);
  if (titleMatch) {
    const titleText = titleMatch[1];
    const hasDash = titleText.includes('-') || titleText.includes('—');
    assert(!hasDash, `${file} title "${titleText}" does NOT contain '-' or '—'`);
  }

  // Meta description under 150 chars
  const descMatch = content.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  assert(descMatch && descMatch[1], `${file} has a meta description`);
  if (descMatch) {
    const descText = descMatch[1];
    assert(descText.length > 0 && descText.length <= 150, `${file} description is <= 150 chars (currently ${descText.length} chars)`);
  }

  // Google Site Name metadata checks
  assert(
    content.includes('<meta property="og:site_name" content="Kawung Math">') ||
    content.includes('<meta property="og:site_name" content="Kawung Math" />'),
    `${file} has <meta property="og:site_name" content="Kawung Math">`
  );
  assert(
    content.includes('<meta name="application-name" content="Kawung Math">') ||
    content.includes('<meta name="application-name" content="Kawung Math" />'),
    `${file} has <meta name="application-name" content="Kawung Math">`
  );
});

// 1.2 Schema.org WebSite JSON-LD on index.html & LearningResource on challenge.html
console.log('\n--- 1.2 Schema.org JSON-LD Validation ---');
const indexContent = fs.readFileSync(path.join(projectDir, 'index.html'), 'utf8');
const jsonLdMatch = indexContent.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
assert(jsonLdMatch && jsonLdMatch[1], 'index.html contains JSON-LD structured data script');
if (jsonLdMatch) {
  try {
    const parsedJson = JSON.parse(jsonLdMatch[1]);
    assert(parsedJson['@context'] === 'https://schema.org', 'index.html JSON-LD @context is https://schema.org');
    assert(parsedJson['@type'] === 'WebSite', 'index.html JSON-LD @type is WebSite');
    assert(parsedJson.name === 'Kawung Math', 'index.html JSON-LD name is "Kawung Math"');
    assert(Array.isArray(parsedJson.alternateName) && parsedJson.alternateName.includes('KawungMath'), 'JSON-LD alternateName contains "KawungMath"');
    assert(parsedJson.url === 'https://kawung-math.vercel.app/', 'JSON-LD url is "https://kawung-math.vercel.app/"');
  } catch (e) {
    assert(false, `JSON-LD in index.html is valid JSON: ${e.message}`);
  }
}

if (fs.existsSync(path.join(projectDir, 'challenge.html'))) {
  const challengeContent = fs.readFileSync(path.join(projectDir, 'challenge.html'), 'utf8');
  const challengeLdMatch = challengeContent.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  assert(challengeLdMatch && challengeLdMatch[1], 'challenge.html contains JSON-LD structured data script');
  if (challengeLdMatch) {
    try {
      const parsedLd = JSON.parse(challengeLdMatch[1]);
      assert(parsedLd['@context'] === 'https://schema.org', 'challenge.html JSON-LD @context is https://schema.org');
      assert(parsedLd['@graph'] && parsedLd['@graph'].some(node => node['@type'] === 'LearningResource'), 'challenge.html JSON-LD contains LearningResource');
    } catch (e) {
      assert(false, `JSON-LD in challenge.html is valid JSON: ${e.message}`);
    }
  }
}

// 2. Routing and Cross-page links
console.log('\n--- 2. Routing & Navigation Links ---');
const indexHtml = fs.readFileSync(path.join(projectDir, 'index.html'), 'utf8');
const sandboxHtml = fs.readFileSync(path.join(projectDir, 'sandbox.html'), 'utf8');
const exploreHtml = fs.readFileSync(path.join(projectDir, 'explore.html'), 'utf8');
const challengeHtml = fs.existsSync(path.join(projectDir, 'challenge.html'))
  ? fs.readFileSync(path.join(projectDir, 'challenge.html'), 'utf8')
  : '';

// Parity checks for exact 4 core navigation titles on all pages
['Beranda', 'Explore', 'Sandbox', 'Challenge'].forEach(label => {
  assert(indexHtml.includes(`>${label}<`), `index.html includes navbar label "${label}"`);
  assert(sandboxHtml.includes(`>${label}<`), `sandbox.html includes navbar label "${label}"`);
  assert(exploreHtml.includes(`>${label}<`), `explore.html includes navbar label "${label}"`);
  if (challengeHtml) {
    assert(challengeHtml.includes(`>${label}<`), `challenge.html includes navbar label "${label}"`);
  }
});

assert(indexHtml.includes('href="#home"') || indexHtml.includes('href="index.html"'), 'index.html links to home');
assert(sandboxHtml.includes('href="index.html"'), 'sandbox.html links back to index.html');
assert(exploreHtml.includes('href="index.html"'), 'explore.html links back to index.html');
if (challengeHtml) {
  assert(challengeHtml.includes('href="index.html"'), 'challenge.html links back to index.html');
  assert(challengeHtml.includes('href="explore.html"'), 'challenge.html links to explore.html');
}

// 3. ARIA & Accessibility Semantics
console.log('\n--- 3. ARIA & Accessibility ---');
assert(exploreHtml.includes('role="tablist"'), 'explore.html has stepper tablist');
assert(exploreHtml.includes('role="tab"'), 'explore.html has stepper tabs');
assert(exploreHtml.includes('role="tabpanel"'), 'explore.html has tabpanel container');
assert(exploreHtml.includes('role="radiogroup"'), 'explore.html has quiz radiogroup');
assert(exploreHtml.includes('role="radio"'), 'explore.html has quiz radio options');
assert(exploreHtml.includes('aria-live="polite"'), 'explore.html has aria-live polite feedback');

assert(sandboxHtml.includes('role="tablist"'), 'sandbox.html has mode switcher tablist');
assert(sandboxHtml.includes('role="tab"'), 'sandbox.html has mode switcher tabs');
assert(sandboxHtml.includes('aria-live="polite"'), 'sandbox.html has aria-live polite feedback');

if (challengeHtml) {
  assert(challengeHtml.includes('role="tablist"'), 'challenge.html has level tablist');
  assert(challengeHtml.includes('role="tab"'), 'challenge.html has level tabs');
  assert(challengeHtml.includes('role="tabpanel"'), 'challenge.html has quest tabpanel');
  assert(challengeHtml.includes('aria-live="polite"'), 'challenge.html has aria-live feedback');
  assert(challengeHtml.includes('role="dialog"'), 'challenge.html has accessible dialogs');
}

assert(indexHtml.includes('aria-label="Buka menu navigasi"'), 'index.html has accessible menu toggle');
assert(indexHtml.includes('aria-expanded'), 'index.html has aria-expanded state');

// 4. Mathematical Formula & Gamification Logic
console.log('\n--- 4. Mathematics & Gamification Logic ---');
assert(exploreHtml.includes('Bab 1: Translasi'), 'explore.html contains Bab 1 Translasi');
assert(exploreHtml.includes('Bab 2: Refleksi'), 'explore.html contains Bab 2 Refleksi');
assert(exploreHtml.includes('Bab 3: Rotasi'), 'explore.html contains Bab 3 Rotasi');
assert(exploreHtml.includes('Bab 4: Dilatasi'), 'explore.html contains Bab 4 Dilatasi');
assert(exploreHtml.includes('requestAnimationFrame'), 'explore.html uses requestAnimationFrame for 60fps');

if (challengeHtml) {
  assert(challengeHtml.includes('Mapper'), 'challenge.html has Level 1 Mapper badge');
  assert(challengeHtml.includes('Mirror Crafter'), 'challenge.html has Level 2 Mirror Crafter badge');
  assert(challengeHtml.includes('Spinner'), 'challenge.html has Level 3 Spinner badge');
  assert(challengeHtml.includes('Architect'), 'challenge.html has Level 4 Architect badge');
  assert(challengeHtml.includes('kawung_math_challenge_progress'), 'challenge.html persists to localStorage');
  assert(challengeHtml.includes('.btn-tactile'), 'challenge.html defines .btn-tactile 3D styling');
}

// 5. WCAG 2.5.3 (Label in Name) Compliance Audit
console.log('\n--- 5. WCAG 2.5.3 (Label in Name) Compliance Audit ---');
files.forEach(file => {
  const filePath = path.join(projectDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // Audit Brand Logo links specifically for exact visual text alignment
  const brandRegex = /<a\b[^>]*class="(?:brand|brand-wrap)"[^>]*>([\s\S]*?)<\/a>/gi;
  let brandMatch;
  while ((brandMatch = brandRegex.exec(content)) !== null) {
    const fullTag = brandMatch[0];
    const innerHtml = brandMatch[1];
    const visibleText = cleanText(innerHtml);
    const ariaMatch = fullTag.match(/aria-label="([^"]+)"/i);

    if (ariaMatch) {
      const ariaLabel = ariaMatch[1].trim();
      assert(
        ariaLabel === visibleText,
        `${file} brand link accessible name ("${ariaLabel}") strictly matches visible text ("${visibleText}")`
      );
    } else {
      assert(
        visibleText.length > 0,
        `${file} brand link without aria-label has semantic text content ("${visibleText}")`
      );
    }
  }

  // Audit all <a> and <button> elements with aria-label & visible text
  const interactiveRegex = /<(a|button)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
  let elemMatch;
  let elementsAudited = 0;

  while ((elemMatch = interactiveRegex.exec(content)) !== null) {
    const tag = elemMatch[1];
    const attrs = elemMatch[2];
    const innerHtml = elemMatch[3];
    const ariaMatch = attrs.match(/aria-label="([^"]+)"/i);

    if (ariaMatch) {
      const ariaLabel = ariaMatch[1].trim();
      const visibleText = cleanText(innerHtml);

      if (visibleText.length > 0) {
        elementsAudited++;
        const normAria = ariaLabel.toLowerCase();
        const normVis = visibleText.toLowerCase();
        const cleanAria = normAria.replace(/[^a-z0-9]/g, '');
        const cleanVis = normVis.replace(/[^a-z0-9]/g, '');

        const isCompliant =
          normAria.includes(normVis) ||
          cleanAria.includes(cleanVis) ||
          normVis.includes(normAria);

        assert(
          isCompliant,
          `${file} <${tag}> visible text "${visibleText}" is contained in accessible name "${ariaLabel}" (WCAG 2.5.3)`
        );
      }
    }
  }
  assert(elementsAudited > 0, `${file} completed WCAG 2.5.3 audit on ${elementsAudited} labeled interactive element(s)`);
});

console.log(`\n========================================`);
console.log(`Test Results: ${passedTests} / ${totalTests} PASSED (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log(`========================================\n`);

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
