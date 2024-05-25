import React, { useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { includes, keys, map, slice } from 'lodash';
import Button from '@mui/material/Button';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
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
  CircularProgress,
} from '@mui/material';

import { Dropzone, FormContainer } from './styles';
import { TTimeseriesData } from '../../../types';
import { createConfig } from '../../../apiCalls/configuration';
import { parseFile } from './utils';
import { ERoutePaths } from '../../../types/router';
import { useOpenErrorNotification } from '../../../store/notifications/selectors';

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
  const navigate = useNavigate();
  const formMethods = useFormContext();

  const openErrorNotification = useOpenErrorNotification();

  const {
    control,
    register,
    formState: { isSubmitting },
    handleSubmit,
    getValues,
  } = formMethods;

  const { fields, append } = useFieldArray({
    control,
    name: EConfigurationFormFields.valueProperties,
  });

  const valueProps = getValues(EConfigurationFormFields.valueProperties);

  const addField = () => {
    append(undefined);
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    parseFile(file, setTimeseriesData);
  }, []);

  const handleSave = async (config) => {
    const { valueProperties, timeProperty } = config;
    const response = await createConfig({
      ...config,
      id: uuidv4(),
      data: timeseriesData,
      valueProperties: map(valueProperties, (valueProperty) => ({
        value: valueProperty,
        label: valueProperty,
      })),
      timeProperty: { value: timeProperty, label: timeProperty },
    });
    if (response.isSuccess && response.data?.id) {
      // navigate to config view mode
      navigate(`${ERoutePaths.CONFIGURATIONS}/${response.data.id}`, {
        replace: true,
      });
    } else {
      openErrorNotification(
        'CREATE_CONFIGURATION_FAILURE',
        response?.error?.message || 'Failed to create configuration',
      );
    }
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
            required
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
                    <label htmlFor="name">Timestamp field</label>
                  </Typography>
                  <Select {...valueProperties.field}>
                    {map(timeseriesProps, (option: string) => {
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
            rules={{ required: true }}
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
                  <label htmlFor="name">Field to analyse</label>
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
              key={`${EConfigurationFormFields.valueProperties}[${index + 1}]`}
            >
              <Controller
                name={`${EConfigurationFormFields.valueProperties}[${index + 1}]`}
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
              />
            </Grid>
          ))}

        <Button
          onClick={addField}
          disabled={
            !acceptedFile || valueProps[valueProps.length - 1] === undefined
          }
        >
          + Add a variable
        </Button>
        <Button type="submit" sx={{ mt: 2 }} disabled={isSubmitting}>
          {isSubmitting && (
            <CircularProgress size="0.875rem" sx={{ mr: 1 }} color="inherit" />
          )}
          Save dataset configuration
        </Button>
      </FormContainer>
    </>
  );
};

export default DatasetForm;
