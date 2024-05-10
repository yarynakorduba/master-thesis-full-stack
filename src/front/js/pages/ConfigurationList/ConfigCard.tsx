import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ConfigCard = ({ config }) => {
  const navigate = useNavigate();
  return (
    <Card>
      <CardActionArea
        onClick={() => {
          console.log('Clicked config card');
          navigate(`/configurations/${config.id}`);
        }}
      >
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {config.name}
          </Typography>
          AAA
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ConfigCard;
