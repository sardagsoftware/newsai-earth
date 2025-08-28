#!/usr/bin/env node
// Simple smoke test: fetch a list of pages and validate basic expectations
const urls = [
  { path: '/', url: 'https://newsai.earth' },
  { path: '/decisions', url: 'https://newsai.earth/decisions' },
  { path: '/news', url: 'https://newsai.earth/news' },
];

async function checkPage(u) {
  try {
    const res = await fetch(u.url, { method: 'GET' });
    const status = res.status;
    const text = await res.text();
    const footerCount = (text.match(/<footer\b/gi) || []).length;
    const selectCount = (text.match(/<select\b/gi) || []).length;
    const optionsWithTextWhite = (text.match(/class=\"[^\"]*text-white/gi) || []).length;
    return { path: u.path, url: u.url, status, footerCount, selectCount, optionsWithTextWhite };
  } catch (err) {
    return { path: u.path, url: u.url, error: String(err) };
  }
}

(async function main(){
  console.log('Running smoke test for newsai.earth...');
  const results = [];
  for (const u of urls) {
    process.stdout.write(`Checking ${u.path} ... `);
    // eslint-disable-next-line no-await-in-loop
    const r = await checkPage(u);
    results.push(r);
    if (r.error) {
      console.log('ERROR');
      console.log(r.error);
    } else {
      console.log(`HTTP ${r.status} | footer=${r.footerCount} | select=${r.selectCount} | optionsWithTextWhite=${r.optionsWithTextWhite}`);
    }
  }

  // Evaluate pass/fail: all statuses 200, exactly one footer, and when selects exist ensure optionsWithTextWhite>0
  let failed = false;
  for (const r of results) {
    if (r.error) { failed = true; continue; }
    if (r.status !== 200) { failed = true; }
    if (r.footerCount !== 1) { failed = true; }
    if (r.selectCount > 0 && r.optionsWithTextWhite === 0) { failed = true; }
  }

  console.log('\nSummary:');
  results.forEach(r => console.log(JSON.stringify(r)));

  if (failed) {
    console.error('\nSmoke test FAILED');
    process.exit(2);
  }
  console.log('\nSmoke test PASSED');
  process.exit(0);
})();
