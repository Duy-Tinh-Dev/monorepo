import { Typography } from '@mui/material';
import React from 'react';

interface InfoProps {
  src: string;
  heading: string;
  subHeading: string;
}
const Info: React.FC<InfoProps> = ({ src, heading, subHeading }) => {
  return (
    <>
      <img src={src} alt='' width={200} />
      <Typography
        fontSize='16px'
        fontWeight={500}
        textAlign='center'
        marginTop={3}
      >
        {heading}
      </Typography>
      <Typography fontSize='14px' textAlign='center'>
        {subHeading}
      </Typography>
    </>
  );
};

export default Info;
