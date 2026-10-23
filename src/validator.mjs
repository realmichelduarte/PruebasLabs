const validStates = new Set(['proposed', 'in_progress', 'done']);

export function validateFixture(data) {
  if (!data || data.schema_version !== 1 ||
      !Array.isArray(data.periods) || !Array.isArray(data.tasks)) {
    throw new Error('Invalid synthetic fixture format');
  }

  const periods = new Set();
  for (const period of data.periods) {
    if (typeof period?.id !== 'string' || !period.id ||
        typeof period.label !== 'string' || periods.has(period.id)) {
      throw new Error('Invalid or duplicate period');
    }
    periods.add(period.id);
  }
  if (periods.size === 0) throw new Error('Missing sample periods');

  const ids = new Set();
  for (const task of data.tasks) {
    if (typeof task?.id !== 'string' || !task.id || ids.has(task.id)) {
      throw new Error('Invalid or duplicate task');
    }
    if (!periods.has(task.period_id) || !validStates.has(task.status)) {
      throw new Error('Invalid sample task relationship or status');
    }
    ids.add(task.id);
  }
  return {periods: periods.size, tasks: ids.size};
}

const ensure = (condition, message) => {
  if (!condition) throw new Error(message);
};

/**
 * PUBLIC SYNTHETIC CONTRACT TESTS ONLY.
 * These are artificial records: never feed private plans, credentials or user data.
 * The real private repository remains the source of truth and is checked separately.
 */
export function validateSyntheticBridge(bundle) {
  ensure(bundle?.schema_version === 1, 'Invalid bridge schema');
  const {source, view, registry, snapshot, questions} = bundle;
  ensure(source && view && registry && snapshot && questions, 'Missing bridge component');
  for (const arr of [source.goals, view.goals, registry.records, snapshot.records,
                     questions.pending, view.questions]) {
    ensure(Array.isArray(arr), 'Expected synthetic array');
  }
  const uniqueIds = (arr) => {
    const ids = arr.map(item => item?.id);
    ensure(ids.every(id => typeof id === 'string' && id.trim()) &&
      new Set(ids).size === ids.length, 'Missing or duplicate synthetic ID');
  };
  [source.goals, view.goals, registry.records, snapshot.records,
   questions.pending, view.questions].forEach(uniqueIds);
  ensure(source.goals.length === view.goals.length, 'Goal count drift');
  const projected = new Map(view.goals.map(goal => [goal.id, goal]));
  for (const g of source.goals) {
    const mirror = projected.get(g.id);
    ensure(mirror && mirror.title === g.title &&
      mirror.target === g.target && mirror.unit === g.unit,
      'Goal projection drift');
    ensure(g.current === null && mirror.current === null,
      'Synthetic fixture must preserve unknown progress');
  }
  ensure(JSON.stringify(registry.records) === JSON.stringify(snapshot.records),
    'Opportunity snapshot drift');
  ensure(registry.records.every(r => r.sent_at === null && r.outcome === null),
    'Synthetic test may not manufacture applications or outcomes');
  const allQuestions = new Set(view.questions.map(q => q.id));
  ensure(questions.pending.every(q => allQuestions.has(q.id)),
    'Unlinked pending question');
  return {
    goals: source.goals.length,
    opportunities: registry.records.length,
    pending_questions: questions.pending.length
  };
}
