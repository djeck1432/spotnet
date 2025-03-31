export function classBuilder(...classes: (string | boolean)[]) {
  return classes.filter(String).join(" ");
}
