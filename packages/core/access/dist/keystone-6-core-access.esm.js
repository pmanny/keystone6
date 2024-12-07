function allowAll() {
  return true;
}
function denyAll() {
  return false;
}
function unfiltered() {
  return true;
}
function allOperations(f) {
  return {
    query: f,
    create: f,
    update: f,
    delete: f
  };
}

export { allOperations, allowAll, denyAll, unfiltered };
