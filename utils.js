import Papa from "papaparse";
import camelcase from "camelcase";

export const parseCSV = file =>
  new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: resolve,
      error: reject,
      transformHeader: camelcase
    });
  });
export const parseCSVFiles = async files => {
  const filesMap = [...files].map(parseCSV);
  return Promise.all(filesMap);
};
export const readFile = file =>
  new Promise(resolve => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsText(file);
  });

export const loadCSV = async files => {
  const fileResults = await parseCSVFiles(files);
  return fileResults.flatMap(({ data }) => data);
};

export const toCamelCase = object =>
  Object.keys(object).map(header => camelcase(header, { pascalCase: true }));

export const lowerStartsWith = (string = "", startString = "") =>
  string.toLowerCase().startsWith(startString);

export const selectElementContents = el => {
  let { body } = document;
  let range;
  let sel;
  if (!el) return;

  if (document.createRange && window.getSelection) {
    range = document.createRange();
    sel = window.getSelection();
    sel.removeAllRanges();
    try {
      range.selectNodeContents(el);
      sel.addRange(range);
    } catch (e) {
      range.selectNode(el);
      sel.addRange(range);
    }
  } else if (body.createTextRange) {
    range = body.createTextRange();
    range.moveToElementText(el);
    range.select();
  }
};

export const sleep = (timeout = 250) =>
  new Promise(resolve => setTimeout(resolve, timeout));
