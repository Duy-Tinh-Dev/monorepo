import React, { useState } from 'react';

const usePopover = (idName: string) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? idName : undefined;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return {
    id,
    open,
    anchorEl,
    handleClick,
    handleClose,
  };
};

export default usePopover;
