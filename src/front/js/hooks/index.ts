import { useState } from 'react';

type TUseInputStateResult<T> = [
  value: T,
  setInputValue: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
  setValue: (value: T) => void
];
export const useInputState = <T>(defaultValue: T): TUseInputStateResult<T> => {
  const [value, setValue] = useState<T>(defaultValue);

  const setInputValue: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    if (typeof defaultValue === 'number') return setValue(+e.target.value as T);
    if (typeof defaultValue === 'boolean') return setValue(!value as T);

    return setValue(e.target.value as T);
  };
  return [value, setInputValue, setValue];
};
