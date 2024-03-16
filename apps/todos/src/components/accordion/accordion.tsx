import {
  Accordion as MUIAccordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Divider,
  Box,
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface AccordionProps {
  summary: string;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ summary, children }) => {
  return (
    <MUIAccordion
      disableGutters
      sx={{
        boxShadow: 'none',
        ':before': {
          display: 'none',
        },
      }}
      defaultExpanded
    >
      <AccordionSummary
        expandIcon={<KeyboardArrowUpIcon />}
        sx={{
          flexDirection: 'row-reverse',
          padding: 0,
        }}
      >
        <Box width='100%'>
          <Typography fontSize='13px' fontWeight='500'>
            {summary}
          </Typography>
          <Divider
            sx={{
              transform: 'translateY(10px)',
            }}
          />
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ paddingLeft: 2, paddingRight: 0 }}>
        {children}
      </AccordionDetails>
    </MUIAccordion>
  );
};

export default Accordion;
