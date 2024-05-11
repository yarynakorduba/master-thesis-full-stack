import React, { useState } from 'react';
import { Content } from '../Configuration/styles';
import DatasetForm from './DatasetForm';
import { TTimeseriesData } from '../../types';
import { FormProvider, useForm } from 'react-hook-form';

const CreateConfiguration = () => {
  const [timeseriesData, setTimeseriesData] = useState<TTimeseriesData>([]);

  const formMethods = useForm({
    defaultValues: {
      prop: [{ value: undefined, label: undefined }],
    },
  });

  return (
    <Content>
      <FormProvider {...formMethods}>
        <DatasetForm
          timeseriesData={timeseriesData}
          setTimeseriesData={setTimeseriesData}
        />
      </FormProvider>
    </Content>
  );
};

export default CreateConfiguration;
