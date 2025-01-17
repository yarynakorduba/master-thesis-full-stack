import React, { ReactNode } from 'react';
import Popover from '@mui/material/Popover';
import { Stack } from '@mui/material';

import { OverlayTrigger } from './styles';

type TInfoOverlayProps = {
  readonly variant?;
  readonly children: ReactNode | ReactNode[];
  readonly id: string;
  readonly label: string | ReactNode;
  readonly sx?;
  readonly component?;
  readonly overlayStyles?;
};

type TInfoOverlayPopoverProps = {
  readonly children: ReactNode | ReactNode[];
};
const InfoOverlayPopover = ({ children }: TInfoOverlayPopoverProps) => (
  <Stack sx={{ p: 2 }} gap={1}>
    {children}
  </Stack>
);

const InfoOverlay = ({
  id,
  children,
  variant,
  label,
  sx = {},
  overlayStyles = { maxWidth: '500px' },
}: TInfoOverlayProps) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (ev) => {
    ev.stopPropagation();
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <OverlayTrigger variant={variant} onClick={handleClick} sx={sx}>
        {label}
      </OverlayTrigger>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        sx={{
          whiteSpace: 'pre-wrap',
          width: 'auto',
          maxWidth: 'auto',
        }}
        slotProps={{ paper: { sx: overlayStyles } }}
      >
        {children}
      </Popover>
    </>
  );
};

InfoOverlay.Popover = InfoOverlayPopover;

export default InfoOverlay;
