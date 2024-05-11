import React, { useEffect, useState } from 'react';
import { Content } from '../Configuration/styles';
import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from '@mui/material';
import { fetchConfigs } from '../../apiCalls/configuration';
import ConfigCard from './ConfigCard';
import { map } from 'lodash';

const ConfigurationList = () => {
  const [configs, setConfigs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchConfigurations = async () => {
    setIsLoading(true);
    const response = await fetchConfigs();
    if (response.isSuccess) {
      setConfigs(response.data);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    handleFetchConfigurations();
  }, []);

  return (
    <Content>
      <Typography variant="h4">Datasets</Typography>
      <Grid spacing={2} container sx={{ marginTop: 3 }}>
        {map(configs, (config) => (
          <Grid item xs={6} lg={4}>
            <ConfigCard config={config} />
          </Grid>
        ))}
      </Grid>
    </Content>
  );
};

export default ConfigurationList;
