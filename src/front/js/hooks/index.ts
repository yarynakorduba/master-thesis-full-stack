import { isNil } from 'lodash';
import { useEffect, useState } from 'react';

type TUseInputStateResult<T> = [
  value: T,
  setInputValue: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
  setValue: (value: T) => void
];

export const useInputState = <T>(
  defaultValue: T,
  minMaxParams: any = {}
): TUseInputStateResult<T> => {
  const [value, setValue] = useState<T>();
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const setInputValue: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    if (e.target.value === '') return setValue('' as T);
    if (typeof defaultValue === 'number') {
      const newValue = +e.target.value as T;
      if (
        (isNil(minMaxParams.min) || newValue >= minMaxParams.min) &&
        (isNil(minMaxParams.max) || newValue <= minMaxParams.max)
      ) {
        return setValue(newValue);
      } else return;
    }
    if (typeof defaultValue === 'boolean') return setValue(!value as T);

    return setValue(e.target.value as T);
  };
  return [value as any, setInputValue, setValue];
};

export const setInputValue =
  (type, minMaxParams: any = {}, setValue) =>
  (e) => {
    if (e.target.value === '') return setValue('');
    if (type === 'number') {
      const newValue = +e.target.value;
      if (
        (isNil(minMaxParams.min) || newValue >= minMaxParams.min) &&
        (isNil(minMaxParams.max) || newValue <= minMaxParams.max)
      ) {
        return setValue(newValue);
      } else return;
    }

    return setValue(e.target.value);
  };
