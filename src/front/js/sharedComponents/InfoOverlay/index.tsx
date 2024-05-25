import React, { ReactNode } from 'react';
import { OverlayTrigger } from './styles';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

type TInfoOverlayProps = {
  readonly variant?;
  readonly children: ReactNode | ReactNode[];
  readonly id: string;
  readonly label: string;
  sx?;
};

type TInfoOverlayPopoverProps = {
  readonly children: ReactNode | ReactNode[];
};
const InfoOverlayPopover = ({ children }: TInfoOverlayPopoverProps) => {
  return <Typography sx={{ p: 2, maxWidth: 500 }}>{children}</Typography>;
};

const InfoOverlay = ({
  id,
  children,
  variant,
  label,
  sx = {},
}: TInfoOverlayProps) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
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
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        sx={{ whiteSpace: 'pre-wrap' }}
      >
        {children}
      </Popover>
    </>
  );
};

InfoOverlay.Popover = InfoOverlayPopover;

export default InfoOverlay;
