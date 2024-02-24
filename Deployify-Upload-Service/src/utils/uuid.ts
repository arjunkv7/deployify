const { v4: uuidv4 } = require("uuid");

export function createId() {
  return uuidv4();
}
