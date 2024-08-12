import React, { ReactNode } from 'react';
import { filter, find, flow, identity, isEmpty, map } from 'lodash';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Grid, Typography, TextField } from '@mui/material';
import { TrendingFlatSharp, SyncAltSharp } from '@mui/icons-material';
import { useFormContext } from 'react-hook-form';

import {
  EAnalysisFormFields,
  TCausalityResult,
  TCausalityResultItem,
} from './types';
import Loader from '../../../sharedComponents/Loader';
import InfoOverlay from '../../../sharedComponents/InfoOverlay';
import AnalysisSection from './AnalysisSection';
import NetworkChart from '../../../sharedComponents/charts/NetworkChart';
import { useCausalityDataForNetworkGraph } from './hooks';
import { FIELD_LABEL_PROPS } from '../../../consts';
import CausalRelationshipsText from '../InfoOverlayTexts/CausalRelationshipsText';
import CausalityMaxLagOrderText from '../InfoOverlayTexts/CausalityMaxLagOrderText';

type TProps = {
  readonly index: number;
  readonly isVisible: boolean;
  readonly causalityTestResult: TCausalityResult | undefined;
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
  const formMethods = useFormContext();
  const {
    register,
    formState: { isSubmitting },
    getValues,
  } = formMethods;

  const graphData = useCausalityDataForNetworkGraph(causalityTestResult);

  const handleClick = () => {
    const values = getValues();
    handleFetchGrangerDataCausalityTest({
      maxLagOrder: +values.causalityMaxLagOrder,
    });
  };

  const causalityTexts: ReactNode[] = flow(
    (d) =>
      map(d || [], (keyPair): ReactNode | null => {
        const first = keyPair[0];
        const second = keyPair[1];

        const elementWithCausality = find<TCausalityResultItem>(
          keyPair,
          'isCausal',
        ) as TCausalityResultItem | undefined;
        if (!elementWithCausality) return null;
        return (
          <Box sx={{ mt: 1, mb: 1 }}>
            {elementWithCausality.source}{' '}
            {first.isCausal && second.isCausal ? (
              <SyncAltSharp />
            ) : (
              <TrendingFlatSharp />
            )}{' '}
            {elementWithCausality.target}
          </Box>
        );
      }),
    (d): ReactNode[] => filter<ReactNode>(d, identity),
  )(causalityTestResult);

  if (!isVisible) return null;
  return (
    <AnalysisSection container md={12} flexDirection="column">
      <AnalysisSection.Header index={index}>
        Check{' '}
        <InfoOverlay id="causal-relationships" label="causal relautionships">
          <InfoOverlay.Popover>
            <CausalRelationshipsText />
          </InfoOverlay.Popover>
        </InfoOverlay>{' '}
        between the variables
      </AnalysisSection.Header>
      <Grid item md={2}>
        <InfoOverlay
          id="max-lag-order-causality"
          label="Max lag order"
          {...FIELD_LABEL_PROPS}
        >
          <InfoOverlay.Popover>
            <CausalityMaxLagOrderText />
          </InfoOverlay.Popover>
        </InfoOverlay>

        <TextField
          size="small"
          type="number"
          sx={{ width: '100%' }}
          {...register(EAnalysisFormFields.causalityMaxLagOrder)}
          required
          inputProps={{ min: 0 }}
        />
      </Grid>
      <Grid item md={12}>
        {isCausalityTestLoading && <Loader />}
        <Button size="small" onClick={handleClick}>
          Run the causality test
        </Button>
      </Grid>
      {causalityTestResult && (
        <>
          <Grid item md={6}>
            <Typography variant="subtitle1">
              List of causal relationships:
            </Typography>
            <Typography variant="body1">
              {!isEmpty(causalityTexts)
                ? causalityTexts
                : 'No relationships detected'}
            </Typography>
          </Grid>
          {!isEmpty(causalityTexts) && (
            <Grid item md={6} flexGrow={1}>
              <Typography variant="subtitle1">
                Network of pairwise Granger causalities:
              </Typography>
              <NetworkChart
                width={500}
                height={50 * graphData.nodes.length}
                nodes={graphData.nodes}
                edges={graphData.edges}
              />
            </Grid>
          )}
        </>
      )}
    </AnalysisSection>
  );
};

export default CausalityTest;
