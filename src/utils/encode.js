/**
 * Encode the form data for POST to Netlify
 * See link in README.md for integrating forms in React and Netlify
 */
const encode = data =>
  Object.keys(data)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');

export default encode;
