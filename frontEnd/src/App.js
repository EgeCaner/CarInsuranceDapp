import React, { Fragment } from 'react';
import {Route} from 'react-router-dom'
import {
  CssBaseline,
  withStyles,
} from '@material-ui/core'

import AppHeader from './AppHeader';
import Home from './pages/Home';
import allcars from './pages/allCars'
import addCars from './pages/addCar'
import changeCarOwner from './pages/changeOwner'
import addCarWithInsurace from './pages/addCarWithInsurance'
import allCarInsurances from './pages/allCarInsurances'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const styles = theme => ({
  main: {
    padding: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    },
  },
});

const App = ({ classes }) => (
  <Fragment>
    <CssBaseline />
    <AppHeader />
    <main className={classes.main}>
      <Home />
      {/* <Route exact path="/" component={Home} /> */}
      <Route path="/addCars" component={addCars}/>
      <Route path="/allCars" component={allcars}/>
      <Route path="/changeOwner" component={changeCarOwner}/>
      <Route path="/addCarWithInsurance" component={addCarWithInsurace}/>
      <Route path="/allCarInsurances" component={allCarInsurances}/>
      <ToastContainer autoClose={6000}/>
    </main>
  </Fragment>
);

export default withStyles(styles)(App);