import styled from "styled-components";

export const AppPage = styled.div`
  width: calc(100% - 0.5rem);
  padding: 0.25rem;
  min-height: calc(100vh - 0.5rem);
  display: grid;
  grid-template-columns: 1fr 6fr;
  gap: 0.25rem;
`;

export const Sidebar = styled.div`
  grid-column: 1;
  grid-row: 1;
  border: 1px solid gray;
`;

export const Content = styled.div`
  grid-column: 2;
  grid-row: 1;
  border: 1px solid gray;

  display: grid;
  grid-template-columns: 4fr 1fr 4fr;
`;
