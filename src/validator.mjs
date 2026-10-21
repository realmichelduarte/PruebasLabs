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
