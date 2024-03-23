import styled from 'styled-components';

export const Field = styled.div`
  margin: 0.25rem 0;
`;

export const InputLabel = styled.label`
  display: block;
  font-size: 0.75rem;
`;

export const InputElement = styled.input`
  display: block;
  margin: 0;
  padding: 1.125em 1.125em 1.25em;
  background-color: #fff;
  border: 1px solid rgba(27, 31, 35, 0.15);
  border-radius: 4px;
  -webkit-appearance: none;
  box-sizing: border-box;
  width: 10rem;
  height: 0.8rem;
  font-size: 0.75rem;
  color: #353538;
  font-weight: 600;
  font-family: inherit;
  transition:
    box-shadow 0.2s linear,
    border-color 0.25s ease-out;
`;
