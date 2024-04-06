import { useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, Button, TextField, Tabs, Tab } from '@mui/material';

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

  const handleChange = (event: unknown, newValue: number) => {
    console.log(event);
    setTabValue(newValue);
  };

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
                  <TextField label="Email" variant="outlined" fullWidth margin="normal" />
                  <TextField label="Password" type="password" variant="outlined" fullWidth margin="normal" />
                  <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Login</Button>
                </form>
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <form>
                  <TextField label="Email" variant="outlined" fullWidth margin="normal" />
                  <TextField label="Password" type="password" variant="outlined" fullWidth margin="normal" />
                  <TextField label="Verify Password" type="password" variant="outlined" fullWidth margin="normal" />
                  <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Sign Up</Button>
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
