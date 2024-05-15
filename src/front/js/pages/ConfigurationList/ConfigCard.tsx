import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';

import DeleteIcon from '@mui/icons-material/Delete';
import { deleteConfig } from '../../apiCalls/configuration';
import { TConfiguration } from '../../../js/store/types';

type TProps = {
  readonly config: TConfiguration;
};

const ConfigCard = ({ config }: TProps) => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const handleDeleteConfiguration = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    const response = await deleteConfig(config.id);
    setIsLoading(false);
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea
        onClick={() => {
          navigate(`/configurations/${config.id}`);
        }}
      >
        <CardContent>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{ display: 'flex', alignItems: 'baseline' }}
          >
            {config.name}
            <IconButton
              aria-label="delete"
              sx={{ marginLeft: 'auto' }}
              onClick={handleDeleteConfiguration}
            >
              <DeleteIcon />
            </IconButton>
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ConfigCard;
