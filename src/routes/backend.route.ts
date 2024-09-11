export const URL_PROD = {
  type: "prod",
  baseUrl: "https://api.themoviedb.org/3",
  apiKey: "aafa86502a60244c7844fcc84ca5ecce", // "cfe422613b250f702980a3bbf9e90716",
  language: 'fr-FR',
};

export const URL_LOCAL = {
  type: "local",
  baseUrl: "https://api.themoviedb.org/3",
  apiKey: "aafa86502a60244c7844fcc84ca5ecce", // "cfe422613b250f702980a3bbf9e90716",
  language: 'fr-FR',
};

export let URL_API = window.location.href.includes("localhost")
  ? URL_LOCAL
  : URL_PROD;