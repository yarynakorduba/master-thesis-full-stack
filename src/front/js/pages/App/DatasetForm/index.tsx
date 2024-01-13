import React, { useMemo } from "react";
import Select from "react-select";
import { useDropzone } from "react-dropzone";
import { isEqual, keys } from "lodash";
import { Controller, useFieldArray, useFormContext, useWatch } from "react-hook-form";

import { useParseDataset } from "./hooks";
import { Dropzone } from "./styles";
import { TTimeseriesData } from "../../../types";

type TProps = {
  readonly timeseriesData: TTimeseriesData;
  readonly setTimeseriesData: (data: TTimeseriesData) => void;
};

const DatasetForm = ({ timeseriesData, setTimeseriesData }: TProps) => {
  const { control } = useFormContext(); // retrieve all hook methods

  const { fields, append } = useFieldArray({
    control, // control valueProperties comes from useForm (optional: if you are using FormContext)
    name: "prop", // unique name for your Field Array
  });

  const addField = () => {
    append({ value: undefined, label: undefined });
  };

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject, acceptedFiles } = useDropzone({});
  const acceptedFile = acceptedFiles[0];

  useParseDataset(acceptedFile, setTimeseriesData);

  const timeseriesProps = useMemo(() => (timeseriesData.length ? keys(timeseriesData[0]) : []), [timeseriesData]);
  const selectOptions = timeseriesProps.map((prop) => ({ value: prop, label: prop }));

  const selectedProp = useWatch({ name: "prop[0]" });
  const selectedTimeseriesProp = useWatch({ name: "timeProperty" });
  const filteredSelectOptions = selectOptions.filter(
    (option) => !isEqual(option, selectedProp) && !isEqual(option, selectedTimeseriesProp),
  );
  return (
    <div>
      <Dropzone {...getRootProps({ isFocused, isDragAccept, isDragReject })}>
        <input {...getInputProps()} />
        <p>{acceptedFile ? acceptedFile.name : "Drag 'n' drop some files here, or click to select files"}</p>
      </Dropzone>
      <Controller
        name="timeProperty"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            className="basic-single"
            classNamePrefix="select"
            defaultValue={selectOptions[0]}
            isDisabled={!acceptedFile}
            isLoading={false}
            isClearable={false}
            isSearchable={true}
            options={filteredSelectOptions}
            value={selectOptions.find((c) => isEqual(c, value))}
            onChange={(value) => onChange(value)}
          />
        )}
        rules={{ required: true }}
      />
      {(fields as any).map((f, index) => (
        <Controller
          name={`prop[${index}]`}
          control={control}
          render={(valueProperties) => (
            <Select
              {...valueProperties.field}
              options={filteredSelectOptions as any}
              onChange={(v) => {
                console.log(v);
                valueProperties.field.onChange(v);
              }}
            />
          )}
          rules={{ required: true }}
        />
      ))}

      <button onClick={addField}>+</button>
    </div>
  );
};

export default DatasetForm;
