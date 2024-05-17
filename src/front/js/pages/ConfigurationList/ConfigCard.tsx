import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import { TConfiguration } from '../../../js/store/types';
import { ERoutePaths } from '../../types/router';
import { useDeleteConfig } from '../../store/configurations/selectors';

type TProps = {
  readonly config: TConfiguration;
};

const ConfigCard = ({ config }: TProps) => {
  const navigate = useNavigate();
  const [deleteConfig, isDeleting] = useDeleteConfig();

  const handleDeleteConfig = useCallback(
    (e) => {
      e.stopPropagation();
      if (!config?.id) return;
      deleteConfig(config.id);
    },
    [config.id, deleteConfig],
  );

  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea
        onClick={() => {
          navigate(`${ERoutePaths.CONFIGURATIONS}/${config.id}`);
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
              onClick={handleDeleteConfig}
              disabled={isDeleting}
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
