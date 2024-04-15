import { isNil } from 'lodash';
import { useState } from 'react';

type TUseInputStateResult<T> = [
  value: T,
  setInputValue: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
  setValue: (value: T) => void
];
export const useInputState = <T>(
  defaultValue: T,
  minMaxParams: any = {}
): TUseInputStateResult<T> => {
  const [value, setValue] = useState<T>(defaultValue);

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
  return [value, setInputValue, setValue];
};
