import {
  Box,
  Button,
  Popover,
  Typography,
  IconButton,
  Grid,
  alpha,
  useTheme,
  Tooltip,
} from '@mui/material';
import { CloseOutlined, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { map } from 'lodash';
import React, { useRef, useState } from 'react';

type TProps = {
  readonly sortOptions;
  readonly sorter;
  readonly setSorter;
};

const SorterPopover = ({ sortOptions, sorter, setSorter }: TProps) => {
  const { palette } = useTheme();
  const popoverAnchor = useRef<any>();

  const [isSortPopoverOpen, setIsSortPopoverOpen] = useState(false);

  return (
    <Box>
      <Button ref={popoverAnchor} onClick={() => setIsSortPopoverOpen(true)}>
        Sort{' '}
      </Button>
      <Popover
        open={isSortPopoverOpen}
        onClose={() => setIsSortPopoverOpen(false)}
        anchorEl={popoverAnchor?.current}
        disableScrollLock
      >
        <Box sx={{ p: 2, width: 400 }}>
          <Typography
            variant="subtitle2"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            Sort by{' '}
            <IconButton size="small" sx={{ marginLeft: 'auto' }}>
              <CloseOutlined />
            </IconButton>
          </Typography>
          {map(sortOptions, ({ label, value }) => {
            const isPropSelected = sorter.propPath === value;
            return (
              <Grid
                container
                sx={{
                  background: isPropSelected
                    ? alpha(palette.info.light, 0.15)
                    : 'none',
                  paddingX: 1,
                  alignItems: 'center',
                  flexWrap: 'nowrap',
                }}
              >
                <Grid item md={9}>
                  <Tooltip title={label} placement="left-start">
                    <Typography noWrap>{label}</Typography>
                  </Tooltip>
                </Grid>
                <Grid item md={3}>
                  <IconButton
                    size="small"
                    color={
                      isPropSelected && sorter.direction === 'asc'
                        ? 'primary'
                        : 'default'
                    }
                    onClick={() =>
                      setSorter({ propPath: value, direction: 'asc' })
                    }
                  >
                    <ArrowUpward />
                  </IconButton>
                  <IconButton
                    size="small"
                    color={
                      isPropSelected && sorter.direction === 'desc'
                        ? 'primary'
                        : 'default'
                    }
                    onClick={() =>
                      setSorter({ propPath: value, direction: 'desc' })
                    }
                  >
                    <ArrowDownward />
                  </IconButton>
                </Grid>
              </Grid>
            );
          })}
        </Box>
      </Popover>
    </Box>
  );
};

export default SorterPopover;
