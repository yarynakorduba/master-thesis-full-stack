import React, { useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { includes, keys, map, slice } from 'lodash';
import Button from '@mui/material/Button';
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import {
  FormControl,
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
  timeProperty = 'timeProperty',
  valueProperties = 'valueProperties',
}

const DatasetForm = ({ timeseriesData, setTimeseriesData }: TProps) => {
  const formMethods = useFormContext();

  const {
    control,
    register,
    formState: { isSubmitting, isSubmitSuccessful },
    handleSubmit,
  } = formMethods;

  const { fields, append } = useFieldArray({
    control,
    name: EConfigurationFormFields.valueProperties,
  });

  const addField = () => {
    append({ value: undefined, label: undefined });
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    parseFile(file, setTimeseriesData);
  }, []);

  const handleSave = async (config) => {
    const { valueProperties, timeProperty } = config;
    console.log('CONFIGUR -- > ', config, timeProperty, valueProperties);
    await createConfig({
      ...config,
      data: timeseriesData,
      valueProperties: map(valueProperties, (valueProperty) => ({
        value: valueProperty,
        label: valueProperty,
      })),
      timeProperty: { value: timeProperty, label: timeProperty },
    });
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

  const timeseriesProps: string[] = useMemo(
    () => (timeseriesData.length ? keys(timeseriesData[0]) : []),
    [timeseriesData],
  );

  const selectedProp = useWatch({
    name: EConfigurationFormFields.valueProperties,
  });
  const selectedTimeseriesProp = useWatch({
    name: EConfigurationFormFields.timeProperty,
  });

  return (
    <>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Add new dataset
      </Typography>
      <FormContainer onSubmit={handleSubmit(handleSave)}>
        <Grid item md={6} sx={{ mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontSize: 12 }}>
            <label>Upload the dataset</label>
          </Typography>
          <Dropzone
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
          <Typography variant="subtitle2" sx={{ fontSize: 12 }}>
            <label htmlFor="name">Dataset name</label>
          </Typography>
          <TextField
            autoFocus
            size="small"
            type="text"
            sx={{ width: '100%' }}
            {...register(EConfigurationFormFields.name)}
          />
        </Grid>
        <Grid item md={6} sx={{ marginBottom: 1 }}>
          <Controller
            control={control}
            {...register(EConfigurationFormFields.timeProperty)}
            render={(valueProperties) => {
              return (
                <FormControl
                  sx={{ width: '100%' }}
                  size="small"
                  disabled={!acceptedFile}
                >
                  <Typography variant="subtitle2" sx={{ fontSize: 12 }}>
                    <label htmlFor="name">Timestamp variable</label>
                  </Typography>
                  <Select {...valueProperties.field}>
                    {map(timeseriesProps, (option: string) => {
                      console.log('OPTION -- > ', option);
                      return (
                        <MenuItem
                          value={option}
                          disabled={includes<string>(valueProperties, option)}
                        >
                          {option}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              );
            }}
            // rules={{ required: true }}
          />
        </Grid>

        <Grid item md={6} sx={{ marginBottom: 1 }}>
          <Controller
            name={`${EConfigurationFormFields.valueProperties}[0]`}
            key={`${EConfigurationFormFields.valueProperties}[0]`}
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
                <Select {...valueProperties.field}>
                  {map(timeseriesProps, (option: string) => (
                    <MenuItem
                      value={option}
                      disabled={
                        includes<string>(valueProperties, option) ||
                        option === selectedTimeseriesProp
                      }
                    >
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            rules={{ required: true }}
          />
        </Grid>
        {!!fields.length &&
          slice(fields, 1).map((f, index) => (
            <Grid
              item
              md={6}
              sx={{ marginBottom: 1 }}
              key={`${EConfigurationFormFields.valueProperties}[${index}]`}
            >
              <Controller
                name={`${EConfigurationFormFields.valueProperties}[${index}]`}
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
                    <Select {...valueProperties.field}>
                      {map(timeseriesProps, (option: string) => (
                        <MenuItem
                          value={option}
                          disabled={
                            includes(selectedProp, option as any) ||
                            option === selectedTimeseriesProp
                          }
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                rules={{ required: true }}
              />
            </Grid>
          ))}

        <Button onClick={addField} disabled={!acceptedFile}>
          + Add a variable
        </Button>
        <Button type="submit" sx={{ mt: 2 }}>
          Save dataset configuration
        </Button>
      </FormContainer>
    </>
  );
};

export default DatasetForm;
