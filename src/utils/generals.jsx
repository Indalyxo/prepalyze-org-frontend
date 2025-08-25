export function formatKey(key) {
  return key
    .replace(/([A-Z])/g, " $1") // insert space before capitals
    .replace(/^./, (str) => str.toUpperCase()); // capitalize first letter
}
