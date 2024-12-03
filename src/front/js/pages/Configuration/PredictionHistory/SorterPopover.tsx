import {
  Box,
  Button,
  Popover,
  Typography,
  IconButton,
  Grid,
  Tooltip,
} from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { map } from 'lodash';
import React, { useRef, useState } from 'react';
import { SorterOption, SorterPopoverHeader } from './styles';
import type { TSortOption, TSorterProps } from './types';

type TProps = {
  readonly sortOptions: TSortOption[];
  readonly sorter: TSorterProps;
  readonly setSorter: (sorterProps: TSorterProps) => void;
};

const SorterPopover = ({ sortOptions, sorter, setSorter }: TProps) => {
  const popoverAnchor = useRef<HTMLButtonElement>();
  const [isSortPopoverOpen, setIsSortPopoverOpen] = useState(false);

  return (
    <>
      <Button
        ref={popoverAnchor as React.MutableRefObject<HTMLButtonElement>}
        onClick={() => setIsSortPopoverOpen(true)}
        sx={{ maxWidth: 'calc(100% - 94px)' }}
      >
        <Typography noWrap>{sorter.label}</Typography>
        {sorter.direction === 'asc' ? (
          <ArrowUpward fontSize="small" />
        ) : (
          <ArrowDownward fontSize="small" />
        )}
      </Button>
      <Popover
        open={isSortPopoverOpen}
        onClose={() => setIsSortPopoverOpen(false)}
        anchorEl={popoverAnchor?.current}
        disableScrollLock
      >
        <Box sx={{ p: 2, width: 400 }}>
          <SorterPopoverHeader variant="subtitle2">
            Sort by{' '}
            <Button size="small" onClick={() => setIsSortPopoverOpen(false)}>
              Close
            </Button>
          </SorterPopoverHeader>
          {map(sortOptions, ({ label, value }) => {
            const isPropSelected = sorter.propPath === value;
            return (
              <SorterOption
                key={value}
                container
                isPropSelected={isPropSelected}
                onClick={() => {
                  setSorter({ label, propPath: value, direction: 'asc' });
                  setIsSortPopoverOpen(false);
                }}
              >
                <Grid item md={9}>
                  <Tooltip title={label} placement="left-start">
                    <Typography noWrap>{label}</Typography>
                  </Tooltip>
                </Grid>
                <Grid item md={3} display="flex" justifyContent="flex-end">
                  <IconButton
                    size="small"
                    color={
                      isPropSelected && sorter.direction === 'asc'
                        ? 'primary'
                        : 'default'
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      setSorter({ label, propPath: value, direction: 'asc' });
                      setIsSortPopoverOpen(false);
                    }}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      setSorter({ label, propPath: value, direction: 'desc' });
                      setIsSortPopoverOpen(false);
                    }}
                  >
                    <ArrowDownward />
                  </IconButton>
                </Grid>
              </SorterOption>
            );
          })}
        </Box>
      </Popover>
    </>
  );
};

export default SorterPopover;
