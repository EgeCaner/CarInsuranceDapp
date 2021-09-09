import React from 'react';
import {Link} from 'react-router-dom';

import {
  AppBar,
  Toolbar,
  Button,
} from '@material-ui/core';

const AppHeader = () => (
  <AppBar position="static">
    <Toolbar>
      <Button color="inherit" component={Link} to="/">Home</Button>
      <Button color="inherit" component={Link} to="/addCars">Add-Car</Button>
      <Button color="inherit" component={Link} to="/allCars">All-Cars</Button>
      <Button color="inherit" component={Link} to="/changeOwner">Change-Owner</Button>
      <Button color="inherit" component={Link} to="/allHTLC">All-HTLC</Button>
      <Button color="inherit" component={Link} to="/allCarInsurances">All-Car-Insurances</Button>
      <Button color="inherit" component={Link} to="/addCarWithInsurance">Add-Car-With-Insurance</Button>
    </Toolbar>
  </AppBar>
);

export default AppHeader;