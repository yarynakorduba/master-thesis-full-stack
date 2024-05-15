import Papa from 'papaparse';
import { useCallback, useEffect } from 'react';
import { TTimeseriesData } from '../../../types';

const parseCSVFile = (file, setter) => {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      setter((results.data || []) as TTimeseriesData);
    },
  });
};

const parseJSONFile = (file, setter) =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      if (event.target) {
        const jsonData = JSON.parse(event.target.result as string);
        setter(jsonData || []);
        resolve(jsonData);
      }
    };

    fileReader.onerror = (error) => reject(error);
    fileReader.readAsText(file);
  });

export const parseFile = (file, setter) => {
  if (file) {
    if (file.type === 'application/json') return parseJSONFile(file, setter);
    if (file.type === 'text/csv') return parseCSVFile(file, setter);
    throw new Error(`The file type ${file.type} is unsupported`);
  }
};

// export const useParseDataset = (
//   file: File,
//   setTimeseriesData: (data: TTimeseriesData) => void,
// ) => {
//   useEffect(() => {
//     parseFile();
//   }, [parseFile]);
// };