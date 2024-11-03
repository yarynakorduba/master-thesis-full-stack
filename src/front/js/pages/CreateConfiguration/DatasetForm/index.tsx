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
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { Dropzone } from './styles';
import { TTimeseriesData } from '../../../types';
import { createConfig } from '../../../apiCalls/configuration';
import { parseFile } from './utils';
import { ERoutePaths } from '../../../types/router';
import { useOpenErrorNotification } from '../../../store/notifications/selectors';
import { EConfigurationFormFields } from '../types';
import { FIELD_LABEL_PROPS } from '../../../../js/consts';

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
    <form onSubmit={handleSubmit(handleSave)}>
      <Grid container rowGap={1}>
        <Grid item sm={12}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Add new dataset
          </Typography>
        </Grid>
        <Grid item sm={12}>
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
        <Grid item sm={12}>
          <Typography
            variant="subtitle2"
            sx={{ fontSize: 12 }}
            component="label"
            htmlFor={EConfigurationFormFields.name}
          >
            Dataset name
          </Typography>
          <TextField
            autoFocus
            size="small"
            type="text"
            sx={{ width: '100%' }}
            {...register(EConfigurationFormFields.name)}
            required
            inputProps={{ maxLength: 100 }}
          />
        </Grid>
        <Grid item sm={12}>
          <Controller
            control={control}
            {...register(EConfigurationFormFields.timeProperty)}
            render={(valueProperties) => {
              return (
                <>
                  <Typography
                    component="label"
                    htmlFor={EConfigurationFormFields.timeProperty}
                    {...FIELD_LABEL_PROPS}
                  >
                    Timestamp variable
                  </Typography>
                  <FormControl
                    sx={{ width: '100%' }}
                    size="small"
                    disabled={!acceptedFile}
                  >
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
                </>
              );
            }}
            rules={{ required: true }}
          />
        </Grid>

        <Grid item sm={12}>
          <Controller
            {...register(
              `${EConfigurationFormFields.valueProperties}[0].value`,
            )}
            key={`${EConfigurationFormFields.valueProperties}[0]`}
            control={control}
            render={({ field }) => (
              <>
                <Typography
                  component="label"
                  htmlFor={`${EConfigurationFormFields.valueProperties}[0]`}
                  {...FIELD_LABEL_PROPS}
                >
                  Variable to analyze (#1)
                </Typography>
                <FormControl
                  sx={{ width: '100%' }}
                  size="small"
                  disabled={!acceptedFile}
                >
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
              </>
            )}
            rules={{ required: true }}
          />
        </Grid>
        {!!fields.length &&
          slice(fields, 1).map((f, index) => {
            return (
              <Grid
                item
                sm={12}
                sx={{
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
                      <Box sx={{ width: '100%' }}>
                        <Typography
                          {...FIELD_LABEL_PROPS}
                          component="label"
                          htmlFor={`${EConfigurationFormFields.valueProperties}[${index + 1}]`}
                        >
                          Variable to analyze (#{index + 2})
                        </Typography>
                        <FormControl
                          sx={{ width: '100%' }}
                          size="small"
                          disabled={!acceptedFile}
                        >
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
                      </Box>
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
        <Grid item sm={12} sx={{ mb: 1, textAlign: 'center' }}>
          <Button
            onClick={addField}
            disabled={
              !acceptedFile || valueProps[valueProps.length - 1] === undefined
            }
          >
            + Add the next variable to analyze
          </Button>
          <Typography
            sx={{ mt: 2 }}
            fontSize={14}
            variant="subtitle2"
            color={grey[500]}
          >
            Note: You will not be able to change this configuration after
            saving. If needed, consider creating a new dataset.
          </Typography>
          <Button type="submit" disabled={isSubmitting} sx={{ mt: 1 }}>
            {isSubmitting && (
              <CircularProgress
                size="0.875rem"
                sx={{ mr: 1 }}
                color="inherit"
              />
            )}
            Save dataset configuration
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default DatasetForm;
