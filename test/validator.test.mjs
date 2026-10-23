import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateFixture} from '../src/validator.mjs';

const sample = JSON.parse(readFileSync(new URL('../fixtures/sample.json', import.meta.url), 'utf8'));
const copy = () => JSON.parse(JSON.stringify(sample));

test('synthetic fixture validates', () => {
  assert.deepEqual(validateFixture(copy()), {periods: 2, tasks: 2});
});
test('duplicate task is rejected', () => {
  const data = copy();
  data.tasks.push({...data.tasks[0]});
  assert.throws(() => validateFixture(data));
});
test('unknown period is rejected', () => {
  const data = copy();
  data.tasks[0].period_id = 'missing';
  assert.throws(() => validateFixture(data));
});
test('invalid status is rejected', () => {
  const data = copy();
  data.tasks[0].status = 'unknown';
  assert.throws(() => validateFixture(data));
});
test('duplicate period is rejected', () => {
  const data = copy();
  data.periods.push({...data.periods[0]});
  assert.throws(() => validateFixture(data));
});
test('wrong schema is rejected', () => {
  const data = copy();
  data.schema_version = 99;
  assert.throws(() => validateFixture(data));
});

import {validateSyntheticBridge} from '../src/validator.mjs';
const bridgeCopy = () => JSON.parse(JSON.stringify(sample.synthetic_bridge));

test('synthetic cross-area contract accepts linked anonymous records', () => {
  assert.deepEqual(validateSyntheticBridge(bridgeCopy()), {
    goals: 2, opportunities: 1, pending_questions: 1
  });
});
test('synthetic contract detects mismatched goal targets', () => {
  const x = bridgeCopy(); x.view.goals[0].target = 999;
  assert.throws(() => validateSyntheticBridge(x), /Goal projection drift/);
});
test('synthetic contract detects duplicate goal IDs', () => {
  const x = bridgeCopy(); x.view.goals.push({...x.view.goals[0]});
  assert.throws(() => validateSyntheticBridge(x), /duplicate synthetic ID/);
});
test('synthetic contract preserves unknown current progress', () => {
  const x = bridgeCopy(); x.source.goals[0].current = 0;
  assert.throws(() => validateSyntheticBridge(x), /unknown progress/);
});
test('synthetic contract rejects changed opportunity snapshots', () => {
  const x = bridgeCopy(); x.snapshot.records[0].status = 'closed';
  assert.throws(() => validateSyntheticBridge(x), /snapshot drift/);
});
test('synthetic contract rejects fabricated application completion', () => {
  const x = bridgeCopy(); x.registry.records[0].sent_at = 'synthetic-date';
  x.snapshot.records[0].sent_at = 'synthetic-date';
  assert.throws(() => validateSyntheticBridge(x), /manufacture applications/);
});
test('synthetic contract detects orphaned question references', () => {
  const x = bridgeCopy(); x.questions.pending[0].id = 'missing';
  assert.throws(() => validateSyntheticBridge(x), /Unlinked pending question/);
});
test('synthetic contract rejects invalid schema', () => {
  const x = bridgeCopy(); x.schema_version = 9;
  assert.throws(() => validateSyntheticBridge(x), /Invalid bridge schema/);
});
