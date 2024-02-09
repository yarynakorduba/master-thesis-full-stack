import styled from 'styled-components';

export const NavContainer = styled.nav`
  height: 3rem;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  background: ${(props) => props.theme.lightGray};
`;

export const NavHeader = styled.h1`
  font-size: 1.25rem;
  margin: 0;
`;
