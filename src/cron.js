const FIELD_NAMES = ['minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek'];
const FIELD_RANGES = [[0, 59], [0, 23], [1, 31], [1, 12], [0, 6]];
const MONTH_NAMES = ['', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const PRESETS = {
  '@yearly': '0 0 1 1 *', '@annually': '0 0 1 1 *',
  '@monthly': '0 0 1 * *', '@weekly': '0 0 * * 0',
  '@daily': '0 0 * * *', '@midnight': '0 0 * * *',
  '@hourly': '0 * * * *',
};

function parseField(field, [min, max]) {
  const values = new Set();
  for (const part of field.split(',')) {
    const stepMatch = part.match(/^(.+)\/(\d+)$/);
    let range, step = 1;
    if (stepMatch) { range = stepMatch[1]; step = parseInt(stepMatch[2]); }
    else { range = part; }

    if (range === '*') {
      for (let i = min; i <= max; i += step) values.add(i);
    } else if (range.includes('-')) {
      const [a, b] = range.split('-').map(Number);
      for (let i = a; i <= b; i += step) values.add(i);
    } else {
      values.add(parseInt(range));
    }
  }
  return [...values].sort((a, b) => a - b);
}

function parse(expr) {
  expr = PRESETS[expr.toLowerCase()] || expr;
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) throw new Error(`Expected 5 fields, got ${parts.length}`);

  // Replace month/day names
  parts[3] = parts[3].replace(/JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC/gi, m => MONTH_NAMES.indexOf(m.toUpperCase()));
  parts[4] = parts[4].replace(/SUN|MON|TUE|WED|THU|FRI|SAT/gi, d => DAY_NAMES.indexOf(d.toUpperCase()));

  const fields = {};
  FIELD_NAMES.forEach((name, i) => {
    fields[name] = parseField(parts[i], FIELD_RANGES[i]);
  });
  return { expression: expr, fields, raw: parts };
}

function validate(expr) {
  try {
    parse(expr);
    return { valid: true, expression: expr };
  } catch (e) {
    return { valid: false, expression: expr, error: e.message };
  }
}

function explain(expr) {
  const { fields } = parse(expr);
  const parts = [];

  // Minute
  if (fields.minute.length === 60) parts.push('every minute');
  else if (fields.minute.length === 1) parts.push(`at minute ${fields.minute[0]}`);
  else parts.push(`at minutes ${fields.minute.join(', ')}`);

  // Hour
  if (fields.hour.length === 24) parts.push('of every hour');
  else if (fields.hour.length === 1) parts.push(`past hour ${fields.hour[0]}`);
  else parts.push(`past hours ${fields.hour.join(', ')}`);

  // Day of month
  if (fields.dayOfMonth.length < 31) {
    parts.push(`on day ${fields.dayOfMonth.join(', ')} of the month`);
  }

  // Month
  if (fields.month.length < 12) {
    parts.push(`in ${fields.month.map(m => MONTH_NAMES[m]).join(', ')}`);
  }

  // Day of week
  if (fields.dayOfWeek.length < 7) {
    parts.push(`on ${fields.dayOfWeek.map(d => DAY_NAMES[d]).join(', ')}`);
  }

  return { expression: expr, description: parts.join(', '), fields };
}

function nextRuns(expr, count = 5, from = new Date()) {
  const { fields } = parse(expr);
  const runs = [];
  const d = new Date(from);
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() + 1);

  let safety = 0;
  while (runs.length < count && safety < 525600) { // max 1 year of minutes
    if (
      fields.month.includes(d.getMonth() + 1) &&
      fields.dayOfMonth.includes(d.getDate()) &&
      fields.dayOfWeek.includes(d.getDay()) &&
      fields.hour.includes(d.getHours()) &&
      fields.minute.includes(d.getMinutes())
    ) {
      runs.push(new Date(d));
    }
    d.setMinutes(d.getMinutes() + 1);
    safety++;
  }
  return runs.map(r => ({ iso: r.toISOString(), unix: Math.floor(r.getTime() / 1000), human: r.toUTCString() }));
}

function generate(options = {}) {
  const { every, at, on, month } = options;
  const parts = ['*', '*', '*', '*', '*'];

  if (every === 'minute') { /* default */ }
  else if (every === 'hour') { parts[0] = at?.minute ?? '0'; }
  else if (every === 'day') { parts[0] = at?.minute ?? '0'; parts[1] = at?.hour ?? '0'; }
  else if (every === 'week') {
    parts[0] = at?.minute ?? '0'; parts[1] = at?.hour ?? '0';
    parts[4] = on?.day ?? '1'; // Monday
  }
  else if (every === 'month') {
    parts[0] = at?.minute ?? '0'; parts[1] = at?.hour ?? '0';
    parts[2] = on?.date ?? '1';
  }

  if (month) parts[3] = String(month);

  const expr = parts.join(' ');
  return { expression: expr, ...explain(expr) };
}

const COMMON = {
  'every-minute': { expr: '* * * * *', desc: 'Every minute' },
  'every-5-minutes': { expr: '*/5 * * * *', desc: 'Every 5 minutes' },
  'every-15-minutes': { expr: '*/15 * * * *', desc: 'Every 15 minutes' },
  'every-30-minutes': { expr: '*/30 * * * *', desc: 'Every 30 minutes' },
  'hourly': { expr: '0 * * * *', desc: 'Every hour' },
  'every-2-hours': { expr: '0 */2 * * *', desc: 'Every 2 hours' },
  'every-6-hours': { expr: '0 */6 * * *', desc: 'Every 6 hours' },
  'daily-midnight': { expr: '0 0 * * *', desc: 'Daily at midnight' },
  'daily-9am': { expr: '0 9 * * *', desc: 'Daily at 9:00 AM' },
  'weekdays-9am': { expr: '0 9 * * 1-5', desc: 'Weekdays at 9:00 AM' },
  'weekly-monday': { expr: '0 0 * * 1', desc: 'Every Monday at midnight' },
  'monthly-1st': { expr: '0 0 1 * *', desc: 'First day of every month' },
  'yearly': { expr: '0 0 1 1 *', desc: 'January 1st at midnight' },
};

module.exports = { parse, validate, explain, nextRuns, generate, COMMON };
