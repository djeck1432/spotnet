export function classBuilder(...classes: (string | boolean)[]) {
  return classes.filter(s => typeof s === 'string' && s).join(' ');
}
