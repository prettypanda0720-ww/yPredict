import React, {Component} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Switch, Route, Redirect} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Dapp from './components/Dapp';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as actionTypes from './actions/actionTypes';
import {connectWallet} from './actions/authenticationAction';
import AuthenticationService from './services/authenticationService';
import ErrorPage from './components/Authentication/error';
import RootLayout from './container/RootLayout';
import MetaMaskAuth from './components/Authentication/MetamaskAuth';

import {ROLE} from './constants/appConstant';
// import useFetchProfile from "./Hooks/useFetchProfile";
import localStorage from './services/storage';
import sessionStorage from './services/sessionStorage';

export const PublicRoute = ({component: Component, isAllowed = true, ...rest}) => {
  let userId = localStorage.get('userId');
  let walletId = localStorage.get('walletId');

  console.log('Routes userId - ', userId);
  console.log('Routes walletId - ', walletId);

  return (
    <Route
      {...rest}
      render={(props) => (
        <Component
          isAuthenticated={userId && walletId ? true : false}
          userId={walletId}
          walletId={walletId}
          {...props}
        />
      )}
    />
  );
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function Routes() {

  
  const walletId = localStorage.get('walletId');



  console.log('function Routes walletId - ', walletId);

  const dispatch = useDispatch();

  if (walletId) {
    dispatch({
      type: actionTypes.CONNECT_WALLET_SUCCESS,
      payload: {
        walletId: walletId,
      },
    });
  }

  const authenticationLoading = useSelector(
    (state) => state.authentication.authLoading, // make authLoading true whenever we are saving the user role
  );
  if (authenticationLoading) {
    // need to show loader when we are saving user role
    return (
      <div class="wrapper-loading">
        <div class="loader-spin"></div>
      </div>
    );
  }
  return (
    <div>
      <ToastContainer
        position="top-center"
        hideProgressBar={true}
        draggable={false}
        closeOnClick={false}
        autoClose={6000}
      />
      <Switch>
        <Route path="/" auth={true}>
          <Switch>
            <PublicRoute path="/" exact auth={true} component={RootLayout(Dashboard)} />
            {/* <PublicRoute path="/demoapp/dapp" exact auth={true} component={RootLayout(Dapp)} /> */}
            <PublicRoute path="/investors/" exact auth={true} component={RootLayout(Dapp)} /> 
            <PublicRoute path="/unauthorized" exact component={ErrorPage} />
            <Route component={ErrorPage} />
          </Switch>
        </Route>
      </Switch>
    </div>
  );
}
