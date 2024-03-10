export function isValid(timestamp) {
  const expirationTime = 60 * 60 * 1000;
  return Date.now() - timestamp < expirationTime;
}
