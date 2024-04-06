import { Link } from "react-router-dom";
import { AppBar, Container, Toolbar, useTheme } from "@mui/material";
import { styled } from '@mui/material/styles';

// Styled Link component that looks like a Material-UI Button
const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: 'white',
  padding: theme.spacing(1, 2),
  margin: theme.spacing(0, 1),
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
}));

function Navbar() {
  const theme = useTheme();

  return (
    <AppBar color="primary">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <StyledLink to="/" theme={theme}>Home</StyledLink>
          <StyledLink to="/about" theme={theme}>About</StyledLink>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
