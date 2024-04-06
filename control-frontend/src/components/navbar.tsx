import { Link } from "react-router-dom";
import { AppBar, Container, Toolbar, useTheme, Box } from "@mui/material";
import { styled } from '@mui/material/styles';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

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
  
  const navigate = useNavigate();

  const handleLogoout = () => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
      method: 'POST',
      credentials: 'include',
    }).then(response => {
      if (response.ok) {
        Cookies.remove("session_id");
        navigate('/');
      }
    })
  }

  return (
    <AppBar color="primary">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <StyledLink to="/" theme={theme}>Home</StyledLink>
          <StyledLink to="/about" theme={theme}>About</StyledLink>
          {
            Cookies.get("session_id") && (
              <Box sx={{ marginLeft: 'auto' }}> {/* Align "Log Out" link to the right 📏➡️ */}
              <StyledLink onClick={handleLogoout} to="/" theme={theme}>Log Out</StyledLink> {/* Log Out link 🔐🚪 */}
            </Box>
            )
          }
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
