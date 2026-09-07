import { runAllAutomatedTests } from './testRunner';

console.log('====================================================');
console.log('  CityConnect Automated Test Suite Execution');
console.log('====================================================\n');

const { results, summary } = runAllAutomatedTests();

results.forEach((r, idx) => {
  const statusBadge = r.passed ? '✓ PASS' : '✗ FAIL';
  console.log(`[${statusBadge}] Test #${idx + 1}: ${r.name}`);
  console.log(`         Category: ${r.category}`);
  console.log(`         Details: ${r.details}`);
  console.log(`         Execution Time: ${r.executionTimeMs} ms\n`);
});

console.log('----------------------------------------------------');
console.log(`RESULTS SUMMARY: ${summary.passed}/${summary.total} Passed (${summary.failed} Failed)`);
console.log('====================================================');

if (summary.failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
