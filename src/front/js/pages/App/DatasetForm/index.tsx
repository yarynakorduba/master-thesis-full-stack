import React, { useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { isEqual, keys } from 'lodash';
import Button from '@mui/material/Button';
import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { useParseDataset } from './hooks';
import { Dropzone, Select, FormContainer } from './styles';
import { TTimeseriesData } from '../../../types';

type TProps = {
  readonly timeseriesData: TTimeseriesData;
  readonly setTimeseriesData: (data: TTimeseriesData) => void;
};

const DatasetForm = ({ timeseriesData, setTimeseriesData }: TProps) => {
  const { control } = useFormContext(); // retrieve all hook methods

  const { fields, append } = useFieldArray({
    control, // control valueProperties comes from useForm (optional: if you are using FormContext)
    name: 'prop' // unique name for your Field Array,
  });

  const addField = () => {
    append({ value: undefined, label: undefined });
  };

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject, acceptedFiles } =
    useDropzone({});
  const acceptedFile = acceptedFiles[0];

  useParseDataset(acceptedFile, setTimeseriesData);

  const timeseriesProps = useMemo(
    () => (timeseriesData.length ? keys(timeseriesData[0]) : []),
    [timeseriesData]
  );
  const selectOptions = timeseriesProps.map((prop) => ({ value: prop, label: prop }));

  const selectedProp = useWatch({ name: 'prop[0]' });
  const selectedTimeseriesProp = useWatch({ name: 'timeProperty' });
  const filteredSelectOptions = selectOptions.filter(
    (option) => !isEqual(option, selectedProp) && !isEqual(option, selectedTimeseriesProp)
  );
  return (
    <FormContainer>
      <Dropzone {...getRootProps({ isFocused, isDragAccept, isDragReject })}>
        <input {...getInputProps()} />
        <p>
          {acceptedFile
            ? acceptedFile.name
            : "Drag 'n' drop some files here, or click to select files"}
        </p>
      </Dropzone>
      <Controller
        name="timeProperty"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            className="basic-single"
            classNamePrefix="select"
            isDisabled={!acceptedFile}
            isLoading={false}
            isClearable={false}
            isSearchable={true}
            options={filteredSelectOptions}
            value={selectOptions.find((c) => isEqual(c, value))}
            onChange={(value) => onChange(value)}
            placeholder="Select timestamp variable"
          />
        )}
        rules={{ required: true }}
      />
      {fields.map((f, index) => (
        <Controller
          name={`prop[${index}]`}
          key={`prop[${index}]`}
          control={control}
          render={(valueProperties) => (
            <Select
              {...valueProperties.field}
              options={filteredSelectOptions}
              onChange={(v) => {
                valueProperties.field.onChange(v);
              }}
              placeholder="Select variable"
              isDisabled={!acceptedFile}
            />
          )}
          rules={{ required: true }}
        />
      ))}

      <Button onClick={addField} disabled={!acceptedFile}>
        +
      </Button>
    </FormContainer>
  );
};

export default DatasetForm;
