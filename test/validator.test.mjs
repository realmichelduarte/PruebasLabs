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
