import { useState } from 'react';

type TWhiteNoiseResponse = { readonly isWhiteNoise: boolean };
export type TWhiteNoiseResult = { [key: string]: TWhiteNoiseResponse } | undefined;
type TWhiteNoiseInfo = {
  readonly whiteNoiseResult: TWhiteNoiseResult;
  readonly isWhiteNoiseLoading: boolean;
  readonly handleFetchIsWhiteNoise: () => Promise<void>;
};

type TStationarityResponse = { readonly stationarity: number[]; readonly isStationary: boolean };
type TStationarityResult = { [key: string]: TStationarityResponse } | undefined;
type TStationarityInfo = {
  readonly stationarityTestResult: TStationarityResult;
  readonly isStationarityTestLoading: boolean;
  readonly handleFetchDataStationarityTest: () => Promise<void>;
};

type TUSeStepperResult = {
  readonly activeStep: number;
  readonly handleSelectStep: (stepIndex: number) => () => void;
  readonly handleNext: () => void;
};

export const useStepper = (): TUSeStepperResult => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const handleSelectStep = (index: number) => () => {
    setActiveStep(index);
  };
  const handleNext = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
  };
  return { activeStep, handleSelectStep, handleNext };
};
