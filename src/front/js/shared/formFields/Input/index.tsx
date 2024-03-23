import React from 'react';
import { Field, InputLabel, InputElement } from './styles';

type TProps = {
  readonly label: string;
  readonly value: string | number;
  readonly onChange: (value: string | number) => void;
};

const Input = ({ label, value, onChange }: TProps) => {
  const handleChange = (ev) => {
    onChange(ev.target.value);
  };
  return (
    <Field>
      <InputLabel>{label}</InputLabel>
      <InputElement value={value} onChange={handleChange} />
    </Field>
  );
};

export default Input;
