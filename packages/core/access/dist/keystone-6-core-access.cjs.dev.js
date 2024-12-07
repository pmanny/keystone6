'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

exports.allOperations = allOperations;
exports.allowAll = allowAll;
exports.denyAll = denyAll;
exports.unfiltered = unfiltered;
