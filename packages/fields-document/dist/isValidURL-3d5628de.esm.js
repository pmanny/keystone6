import { sanitizeUrl } from '@braintree/sanitize-url';

function isValidURL(url) {
  return url === sanitizeUrl(url) || url === encodeURI(sanitizeUrl(url));
}

export { isValidURL as i };
