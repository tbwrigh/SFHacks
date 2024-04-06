import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Button, TextField, Tabs, Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Buffer } from 'buffer';
import Cookies from 'js-cookie';

function TabPanel(props: { children?: React.ReactNode, index: number, value: number }) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function HomePage() {
  const [tabValue, setTabValue] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');

  const navigate = useNavigate();

  const handleChange = (event: unknown, newValue: number) => {
    console.log(event);
    setTabValue(newValue);
  };

  const handleLogin = () => {

    const headers = new Headers();
    headers.append("Authorization", "Basic " + Buffer.from(email + ":" + password, 'binary').toString('base64'));

    // Call API to login with basic auth
    fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
      method: 'POST',
      headers: headers
    }).then(response => {
      if (response.ok) {
        setEmail('');
        setPassword('');
        response.json().then(data => {
          Cookies.set('session_id', data.session_id);
          navigate('/courses');
        })
      } else {
        setPassword('');
      }
    }).catch(error => {
      console.error('Error:', error);
    })
  }

  const handleSignUp = () => {
    if (password !== verifyPassword) {
      setPassword('');
      setVerifyPassword('');
      return;
    }

    // Call API to sign up
    fetch(`${import.meta.env.VITE_BACKEND_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        "username": email, 
        "password": password 
      })
    }).then(response => {
      if (response.ok) {
        setEmail('');
        setPassword('');
        setVerifyPassword('');
        setTabValue(0);
      } else {
        setPassword('');
        setVerifyPassword('');
      }
    }).catch(error => {
      console.error('Error:', error);
    })
  }

  useEffect(() => {
    if (Cookies.get('session_id')) {
      navigate('/courses');
    }
  }, [navigate]);

  return (
    <Box sx={{ flexGrow: 1, overflow: 'hidden', padding: 3 }}>
      <Grid container spacing={2} alignItems="center" justifyContent="center" style={{ minHeight: '80vh' }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to Our Platform!
          </Typography>
          <Typography>
            Discover a place where you can explore, learn, and grow. Join our community and start your journey today.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Tabs value={tabValue} onChange={handleChange} aria-label="login sign-up tabs" centered>
                <Tab label="Login" />
                <Tab label="Sign Up" />
              </Tabs>
              <TabPanel value={tabValue} index={0}>
                <form>
                  <TextField label="Email" variant="outlined" fullWidth margin="normal" value={email} onChange={(e) => {setEmail(e.target.value)}} />
                  <TextField label="Password" type="password" variant="outlined" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)}/>
                  <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleLogin}>Login</Button>
                </form>
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <form>
                  <TextField label="Email" variant="outlined" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)}/>
                  <TextField label="Password" type="password" variant="outlined" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)}/>
                  <TextField label="Verify Password" type="password" variant="outlined" fullWidth margin="normal" value={verifyPassword} onChange={(e) => setVerifyPassword(e.target.value)}/>
                  <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleSignUp}>Sign Up</Button>
                </form>
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default HomePage;
