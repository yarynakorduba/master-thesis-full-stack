import React, { useEffect, useState } from 'react';
import { Button, Grid, Skeleton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { map } from 'lodash';
import { useNavigate } from 'react-router-dom';

import { Content } from '../Configuration/styles';
import { fetchConfigs } from '../../apiCalls/configuration';
import ConfigCard from './ConfigCard';

const ConfigurationList = () => {
  const navigate = useNavigate();
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

  const handleAddDataset = () => {
    navigate('/configurations/create');
  };

  return (
    <Content>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Datasets
        <Button
          startIcon={<AddIcon />}
          sx={{ ml: 2 }}
          onClick={handleAddDataset}
        >
          Add new dataset
        </Button>
      </Typography>

      <Grid spacing={2} container>
        {isLoading
          ? map(Array(3), () => (
              <Grid item xs={6} lg={4}>
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  height={95}
                  width="100%"
                />
              </Grid>
            ))
          : map(configs, (config) => (
              <Grid item xs={6} lg={4}>
                <ConfigCard config={config} />
              </Grid>
            ))}
      </Grid>
    </Content>
  );
};

export default ConfigurationList;
