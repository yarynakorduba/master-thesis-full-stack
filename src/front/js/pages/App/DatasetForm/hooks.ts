import Papa from "papaparse";
import React, { useCallback, useEffect } from "react";
import { TTimeseriesData } from "../../../types";

export const useParseDataset = (file: File, setTimeseriesData: (data: TTimeseriesData) => void) => {
  const parseCSVFile = useCallback(() => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setTimeseriesData((results.data || []) as TTimeseriesData);
      },
    });
  }, [file, setTimeseriesData]);

  const parseJSONFile = useCallback(
    () =>
      new Promise((resolve, reject) => {
        const fileReader = new FileReader();

        fileReader.onload = (event) => {
          if (event.target) {
            const jsonData = JSON.parse(event.target.result as string);
            setTimeseriesData(jsonData || []);
            resolve(jsonData);
          }
        };

        fileReader.onerror = (error) => reject(error);
        fileReader.readAsText(file);
      }),
    [file, setTimeseriesData],
  );

  const parseFile = useCallback(() => {
    if (file) {
      if (file.type === "application/json") return parseJSONFile();
      if (file.type === "text/csv") return parseCSVFile();
      throw new Error(`The file type ${file.type} is unsupported`);
    }
  }, [file, parseJSONFile, parseCSVFile]);

  useEffect(() => {
    parseFile();
  }, [parseFile]);
};
