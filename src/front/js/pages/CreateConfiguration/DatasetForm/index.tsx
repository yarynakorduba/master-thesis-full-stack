import React, { useCallback, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { isEqual, keys, map, noop } from 'lodash';
import Button from '@mui/material/Button';
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import {
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  Typography,
  Select,
  Grid,
} from '@mui/material';

import { Dropzone, FormContainer } from './styles';
import { TTimeseriesData } from '../../../types';
import { createConfig } from '../../../apiCalls/configuration';
import { parseFile } from './hooks';

type TProps = {
  readonly timeseriesData: TTimeseriesData;
  readonly setTimeseriesData: (data: TTimeseriesData) => void;
};

enum EConfigurationFormFields {
  name = 'name',
  data = 'data',
}

const DatasetForm = ({ timeseriesData, setTimeseriesData }: TProps) => {
  const formMethods = useFormContext(); // retrieve all hook methods

  const {
    control,
    register,
    formState: { isSubmitting, isSubmitSuccessful },
    handleSubmit,
  } = formMethods;

  console.log('--->>> ', formMethods);

  const { fields, append } = useFieldArray({
    control, // control valueProperties comes from useForm (optional: if you are using FormContext)
    name: 'prop', // unique name for your Field Array,
  });

  const addField = () => {
    append({ value: undefined, label: undefined });
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    parseFile(file, setTimeseriesData);
  }, []);

  const handleSave = async (config) => {
    await createConfig({ ...config, data: timeseriesData });
  };

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    acceptedFiles,
  } = useDropzone({ onDrop });
  const acceptedFile = acceptedFiles[0];

  const timeseriesProps = useMemo(
    () => (timeseriesData.length ? keys(timeseriesData[0]) : []),
    [timeseriesData],
  );
  const selectOptions = timeseriesProps.map((prop) => ({
    value: prop,
    label: prop,
  }));

  const selectedProp = useWatch({ name: 'prop[0]' });
  const selectedTimeseriesProp = useWatch({ name: 'timeProperty' });
  const filteredSelectOptions = selectOptions.filter(
    (option) =>
      !isEqual(option, selectedProp) &&
      !isEqual(option, selectedTimeseriesProp),
  );

  return (
    <FormContainer onSubmit={handleSubmit(handleSave)} noValidate>
      <Grid item md={6} sx={{ marginBottom: 1 }}>
        <Typography variant="subtitle2" sx={{ fontSize: 12 }}>
          <label htmlFor="name">Dataset name</label>
        </Typography>
        <TextField
          size="small"
          type="text"
          sx={{ width: '100%' }}
          {...register(EConfigurationFormFields.name)}
        />
      </Grid>
      <Grid item md={6} sx={{ marginBottom: 1 }}>
        <Typography variant="subtitle2" sx={{ fontSize: 12 }}>
          <label>Upload the dataset</label>
        </Typography>
        <Dropzone
          {...register(EConfigurationFormFields.data)}
          {...getRootProps({ isFocused, isDragAccept, isDragReject })}
        >
          <input {...getInputProps()} />
          <Typography>
            {acceptedFile
              ? acceptedFile.name
              : "Drag 'n' drop some files here, or click to select files"}
          </Typography>
        </Dropzone>
      </Grid>
      <Grid item md={6} sx={{ marginBottom: 1 }}>
        <Controller
          name="timeProperty"
          control={control}
          render={(valueProperties) => (
            <FormControl
              sx={{ width: '100%' }}
              size="small"
              disabled={!acceptedFile}
            >
              <Typography variant="subtitle2" sx={{ fontSize: 12 }}>
                <label htmlFor="name" id="demo-select-small-label">
                  Timestamp variable
                </label>
              </Typography>
              <Select {...valueProperties.field}>
                {map(filteredSelectOptions, (option) => (
                  <MenuItem value={option.value}>{option.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          // rules={{ required: true }}
        />
      </Grid>
      <Grid item md={6} sx={{ marginBottom: 1 }}>
        {fields.map((f, index) => (
          <Controller
            name={`prop[${index}]`}
            key={`prop[${index}]`}
            control={control}
            render={(valueProperties) => (
              <FormControl
                sx={{ width: '100%' }}
                size="small"
                disabled={!acceptedFile}
              >
                <Typography variant="subtitle2" sx={{ fontSize: 12 }}>
                  <label htmlFor="name">Variable to analyse</label>
                </Typography>
                <Select {...valueProperties.field} id="demo-select-small">
                  {map(filteredSelectOptions, (option) => (
                    <MenuItem value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            // rules={{ required: true }}
          />
        ))}
      </Grid>
      <Button onClick={addField} disabled={!acceptedFile}>
        + Add a variable
      </Button>
      <Button type="submit" sx={{ mt: 2 }}>
        Save dataset configuration
      </Button>
    </FormContainer>
  );
};

export default DatasetForm;
