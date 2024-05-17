import React, { useEffect } from 'react';
import { Button, Grid, Skeleton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { map } from 'lodash';
import { Link } from 'react-router-dom';

import { Content } from '../Configuration/styles';
import ConfigCard from './ConfigCard';
import { ERoutePaths } from '../../types/router';
import { useConfigsList } from '../../store/configurations/selectors';

const ConfigurationList = () => {
  // const [configs, setConfigs] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);

  const [configs, fetchConfigs, isLoading] = useConfigsList();

  // const handleFetchConfigurations = async () => {
  //   setIsLoading(true);
  //   const response = await fetchConfigs();
  //   if (response.isSuccess) {
  //     setConfigs(response.data);
  //   }
  //   setIsLoading(false);
  // };
  useEffect(() => {
    fetchConfigs();
  }, []);

  return (
    <Content>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Datasets
        <Button
          component={Link}
          to={ERoutePaths.CREATE_CONFIGURATION}
          startIcon={<AddIcon />}
          sx={{ ml: 2 }}
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
