import React from 'react';
import { filter, find, flatMap, flow, map } from 'lodash';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Grid, Typography } from '@mui/material';
import { TrendingFlatSharp, SyncAltSharp } from '@mui/icons-material';

import { ButtonContainer } from '../../../sharedComponents/charts/SparkLineChartsBlock/styles';
import Loader from '../../../sharedComponents/Loader';
import InfoOverlay from '../../../sharedComponents/InfoOverlay';
import AnalysisSection from './AnalysisSection';
import Example from '../../../sharedComponents/charts/NetworkChart';
import { useConfigData } from '../../../store/currentConfiguration/selectors';

type TProps = {
  readonly index: number;
  readonly isVisible: boolean;
  readonly causalityTestResult;
  readonly isCausalityTestLoading: boolean;
  readonly handleFetchGrangerDataCausalityTest;
};

// Granger’s causality test can be used to identify the relationship between variables prior to model building.
// This is important because if there is no relationship between variables, they can be excluded and modeled separately.
// Conversely, if a relationship exists, the variables must be considered in the modeling phase.

const CausalityTest = ({
  index,
  isVisible,
  causalityTestResult,
  isCausalityTestLoading,
  handleFetchGrangerDataCausalityTest,
}: TProps) => {
  const { valueProperties } = useConfigData();
  const nodes = map(valueProperties, ({ value, label }) => ({
    id: value,
    label,
  }));

  const edges = flatMap(causalityTestResult, (keyPair) => {
    console.log('RSU SOURCE', keyPair);
    return flow(
      (pair) => filter(pair, 'isCausal'),
      (pair) => map(pair, ({ source, target }) => ({ source, target })),
    )(keyPair);
  });

  const causalityTexts = map(causalityTestResult, (keyPair) => {
    const first = keyPair[0];
    const second = keyPair[1];

    const elementWithCausality = find(keyPair, 'isCausal');
    if (!elementWithCausality) return null;
    return (
      <Box sx={{ mt: 1, mb: 1 }}>
        {first.isCausal && second.isCausal ? (
          <>
            {first.source} <SyncAltSharp /> {first.target}
          </>
        ) : (
          <>
            {elementWithCausality.source} <TrendingFlatSharp />{' '}
            {elementWithCausality.target}
          </>
        )}
      </Box>
    );
  });

  if (!isVisible) return null;
  return (
    <AnalysisSection container md={12} flexDirection="column">
      <AnalysisSection.Header index={index}>
        Do selected variables have a{' '}
        <InfoOverlay id="causal-relationship" label="causal relautionship">
          <InfoOverlay.Popover>
            <Typography></Typography>
          </InfoOverlay.Popover>
        </InfoOverlay>
        ?
      </AnalysisSection.Header>

      <Grid item md={6}>
        <ButtonContainer>
          {isCausalityTestLoading && <Loader />}
          <Button size="small" onClick={handleFetchGrangerDataCausalityTest}>
            Run the causality test
          </Button>
        </ButtonContainer>
        <Typography variant="body1">
          {causalityTestResult ? causalityTexts : null}
        </Typography>
      </Grid>
      <Grid item md={6} flexGrow={1}>
        {causalityTestResult && (
          <Example width={500} height={500} nodes={nodes} edges={edges} />
        )}
      </Grid>
    </AnalysisSection>
  );
};

export default CausalityTest;
