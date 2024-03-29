import styled from 'styled-components';

export const AppPage = styled.div`
  width: calc(100% - 0.5rem);
  min-height: calc(100vh - 0.5rem);
`;

export const Sidebar = styled.div`
  grid-column: 1;
  grid-row: 1;
  border-right: 1px solid ${(props) => props.theme.lightGray};
  padding: 0.75rem;
`;

export const Content = styled.div`
  grid-column: 2;
  grid-row: 1;
`;
