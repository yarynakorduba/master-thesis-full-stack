import styled from 'styled-components';

export const DataInfo = styled.p`
  font-size: 0.75rem;
`;

export const Content = styled.div`
  grid-column: 2;
  grid-row: 1;
  // display: grid;
  // grid-template-columns: 4fr 4fr;
  padding: 0.75rem;
`;

export const LineChartContainer = styled.div`
  // display: grid;
  // grid-template-columns: 5fr 2fr;
`;

export const Step = styled.div`
  display: grid;
  grid-template-columns: 4.5rem 5fr;
  grid-template-rows: auto 1fr;
  background: ${(props) => props.theme.lightGray1};
  padding: 0.5rem 0 0.5rem 0;
  border-radius: 0.5rem;
  box-shadow: 0px 0px 0px 0.5px ${(props) => props.theme.lightGray};
  margin-bottom: 0.75rem;
  min-height: 4.625rem;
`;

export const Analysis = styled.div`
  margin-left: 1rem;
`;

export const StepName = styled.div`
  grid-row: 1/3;
  grid-column: 1;
  font-size: 2rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

export const Question = styled.div`
  grid-row: 1;
  grid-column: 2;
  font-size: 1rem;
  line-height: 1.25;
  margin-bottom: 0.25rem;
  font-weight: 400;
`;

export const Test = styled.div`
  grid-row: 2;
  grid-column: 2/3;
  font-size: 0.875rem;
`;

export const Field = styled.div`
  margin: 0.25rem 0;
`;

export const InputLabel = styled.label`
  display: block;
  font-size: 0.75rem;
`;

export const Input = styled.input`
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

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const Subtitle = styled.div`
  padding-bottom: 0.5rem;
  font-weight: 400;
  font-size: 0.75rem;
`;
