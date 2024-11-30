import { styled } from '@mui/material/styles';

import SelectComponent from 'react-select';

export const Dropzone = styled('div')`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  border-width: 2px;
  border-radius: 2px;
  border-style: dashed;
  background-color: ${(props) => props.theme.palette.primary.contrastText};
  border-color: ${(props) => props.theme.palette.primary.main};
  outline: none;
  transition: border 0.24s ease-in-out;

  & p {
    margin: 0;
  }
`;
