export class NotFoundError extends Error {
  /** @type {string} */
  name = "NotFoundError";

  /** @type {number} */
  status = 404;

  /** @type {number} */
  statusCode = 404;
}
