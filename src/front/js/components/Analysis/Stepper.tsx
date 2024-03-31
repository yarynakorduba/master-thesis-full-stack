import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import StepButton from '@mui/material/StepButton';

const Step1 = ({ handleNext, handleSelectStep, index }: any) => {
  return (
    <>
      <StepButton onClick={handleSelectStep(0)}>{index}</StepButton>
      <StepContent>
        <Typography>{'AAAA'}</Typography>
        <Box sx={{ mb: 2 }}>
          <div>
            <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
              {0 === steps.length - 1 ? 'Finish' : 'Continue'}
            </Button>
            <Button disabled={0 === 0} onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
              Back
            </Button>
          </div>
        </Box>
      </StepContent>
    </>
  );
};

const Step2 = ({ handleNext, handleSelectStep }: any) => {
  return (
    <Step key={'2'}>
      <StepButton onClick={handleSelectStep(0)}>{'2'}</StepButton>
      <StepContent>
        <Typography>{'AA22222AA'}</Typography>
        <Box sx={{ mb: 2 }}>
          <div>
            <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
              {1 === steps.length - 1 ? 'Finish' : 'Continue'}
            </Button>
            <Button disabled={false} onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
              Back
            </Button>
          </div>
        </Box>
      </StepContent>
    </Step>
  );
};

const steps = [
  {
    label: 'Select campaign settings',
    description: `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.`
  },
  {
    label: 'Create an ad group',
    description: 'An ad group contains one or more ads which target a shared set of keywords.'
  },
  {
    label: 'Create an ad',
    description: `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`
  }
];

export default function VerticalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleSelectStep = (index) => () => {
    setActiveStep(index);
  };
  const handleNext = (index) => () => {
    setActiveStep((prevActiveStep) => {
      console.log('prevactive --- > ', prevActiveStep);
      if (prevActiveStep !== index) {
        return index;
      }
    });
  };

  const renderEl = () => (
    <>
      <Step1 handleSelectStep={handleSelectStep} handleNext={handleNext} index={0} />
      <Step2 handleSelectStep={handleSelectStep} handleNext={handleNext} index={1} />
    </>
  );

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={activeStep} orientation="vertical" nonLinear>
        {[1, 2].map((e) => (
          <Step key={e}>
            <Step1 key={e} index={e} handleSelectStep={handleSelectStep} handleNext={handleNext} />
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
