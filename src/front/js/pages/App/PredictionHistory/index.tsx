import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Stack, Card, CardContent, Grid } from '@mui/material';

const PredictionHistory = () => {
  return (
    <Container sx={{ background: 'pink', height: 'auto', width: '50%' }}>
      <Typography variant="h5" sx={{ marginBottom: 1 }}>
        History
      </Typography>
      <Grid spacing={1} container>
        <Grid item xs={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Word of the Day
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Word of the Day
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Word of the Day
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PredictionHistory;
