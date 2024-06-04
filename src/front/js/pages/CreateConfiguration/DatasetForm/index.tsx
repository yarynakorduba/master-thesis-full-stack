import React, { useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { includes, keys, map, slice } from 'lodash';
import Button from '@mui/material/Button';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import grey from '@mui/material/colors/grey';
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
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { Dropzone, FormContainer } from './styles';
import { TTimeseriesData } from '../../../types';
import { createConfig } from '../../../apiCalls/configuration';
import { parseFile } from './utils';
import { ERoutePaths } from '../../../types/router';
import { useOpenErrorNotification } from '../../../store/notifications/selectors';
import { EConfigurationFormFields } from '../types';

type TProps = {
  readonly timeseriesData: TTimeseriesData;
  readonly setTimeseriesData: (data: TTimeseriesData) => void;
};

const DatasetForm = ({ timeseriesData, setTimeseriesData }: TProps) => {
  const navigate = useNavigate();
  const openErrorNotification = useOpenErrorNotification();

  const formMethods = useFormContext();
  const {
    control,
    register,
    formState: { isSubmitting },
    handleSubmit,
    getValues,
  } = formMethods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: EConfigurationFormFields.valueProperties,
  });

  const valueProps = getValues(EConfigurationFormFields.valueProperties);

  const addField = () => append(undefined);
  const removeField = (index: number) => () => remove(index);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    parseFile(file, setTimeseriesData);
  }, []);

  const handleSave = async (config) => {
    const { valueProperties, timeProperty } = config;
    const convertValuePropForSaving = ({ value }) => ({
      value,
      label: value,
    });
    const response = await createConfig({
      ...config,
      id: uuidv4(),
      data: timeseriesData,
      valueProperties: map(valueProperties, convertValuePropForSaving),
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

  const selectedPropsToAnalyze = useWatch({
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
        <Grid item md={6} sx={{ mb: 1 }}>
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
        <Grid item md={6} sx={{ mb: 1 }}>
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

        <Grid item md={6} sx={{ mb: 1 }}>
          <Controller
            {...register(
              `${EConfigurationFormFields.valueProperties}[0].value`,
            )}
            key={`${EConfigurationFormFields.valueProperties}[0]`}
            control={control}
            render={({ field }) => (
              <FormControl
                sx={{ width: '100%' }}
                size="small"
                disabled={!acceptedFile}
              >
                <Typography variant="subtitle2" sx={{ fontSize: 12 }}>
                  <label htmlFor="name">Field to analyse (#1)</label>
                </Typography>
                <Select {...field}>
                  {map(timeseriesProps, (option: string) => (
                    <MenuItem
                      value={option}
                      disabled={
                        includes<string>(selectedPropsToAnalyze, option) ||
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
          slice(fields, 1).map((f, index) => {
            return (
              <Grid
                item
                md={6}
                sx={{
                  marginBottom: 1,
                  display: 'flex',
                  flexWrap: 'nowrap',
                  alignItems: 'flex-end',
                }}
                key={f.id}
              >
                <Controller
                  {...register(
                    `${EConfigurationFormFields.valueProperties}[${index + 1}].value`,
                  )}
                  control={control}
                  render={({ field }) => {
                    return (
                      <FormControl
                        sx={{ width: '100%' }}
                        size="small"
                        disabled={!acceptedFile}
                      >
                        <Typography variant="subtitle2" sx={{ fontSize: 12 }}>
                          <label htmlFor="name">
                            Field to analyse (#{index + 2})
                          </label>
                        </Typography>
                        <Select {...field}>
                          {map(timeseriesProps, (option: string) => (
                            <MenuItem
                              value={option}
                              disabled={
                                includes(selectedPropsToAnalyze, option) ||
                                option === selectedTimeseriesProp
                              }
                            >
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    );
                  }}
                />
                <IconButton
                  size="small"
                  sx={{ margin: 0.5 }}
                  onClick={removeField(index + 1)}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            );
          })}

        <Button
          onClick={addField}
          disabled={
            !acceptedFile || valueProps[valueProps.length - 1] === undefined
          }
        >
          + Add a variable
        </Button>
        <Typography
          sx={{ textAlign: 'center', mt: 2 }}
          fontSize={14}
          variant="subtitle2"
          color={grey[500]}
        >
          Note: You will not be able to change these settings after saving. If
          needed, consider creating a new dataset.
        </Typography>
        <Button type="submit" disabled={isSubmitting}>
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
