import React, { Component } from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
// Containers
import Full from './containers/Full/'
// Styles
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Main styles for this application
import './scss/style.scss'
// Temp fix for reactstrap
import './scss/core/_dropdown-menu-right.scss'

import {getUserGroups, isPage401} from "./utilities/helpers";
import Keycloak from 'keycloak-js';
import decode from 'jwt-decode'
import Base64 from 'base-64';
import Page401 from "./views/Errors/Page401";
import settings from './settings.json'
import {KC_URL} from './utilities/constants';
import i18n from './i18n';

const { clientId, realm } = settings.keycloak;

class Auth extends Component {

  constructor(props) {
    super(props);
    this.state = {
      keycloak: null,
      authenticated: false,
      readyToRedirect: false,
      redirectToFull : false,
      userDetails: null,
      tokenDetails: null
    };
  }

  componentDidMount() {
    const keycloak = Keycloak({
      url:KC_URL,
      realm:realm,
      clientId:clientId
    });
    keycloak.init({onLoad: 'login-required'}).success(authenticated => {
      if(authenticated){
        this.setState({keycloak: keycloak, authenticated: authenticated})
        //Set token in local storage
        localStorage.setItem('token', keycloak.token);
        const tokenDetails = decode(keycloak.token)
        const groups = getUserGroups(tokenDetails);
        const pageStatus = isPage401(groups);
        if (pageStatus) { // is Page401 then show page401
          keycloak.loadUserInfo().success((userInfo) => {
            if (localStorage.getItem('isReloaded') === '0' || !localStorage.getItem('isReloaded')) {
              window.location.reload();
              localStorage.setItem('isReloaded', '1');
            } else {
              this.setState({
                redirectTo404: true,
                userDetails: userInfo,
                keycloak: keycloak
              },()=>{
                this.setState({
                  readyToRedirect: true
                })
              })
            }
          });
        } else { // User has permission and therefore, allowed to access it.
          keycloak.loadUserInfo().success( (userInfo)=> {
            localStorage.setItem('isReloaded', '0');
            localStorage.setItem('userInfo', Base64.encode(JSON.stringify(userInfo)))
            this.setState({
              redirectToFull : true,
              keycloak: keycloak,
              userDetails: userInfo,
              tokenDetails:tokenDetails
            },()=>{
              this.setState({
                readyToRedirect: true
              })
            })
          });
        }
      } else {
        keycloak.login();
      }
    })
  }
  render() {
    if (this.state.keycloak) {
      if (this.state.authenticated){
        if(this.state.redirectTo404 && this.state.readyToRedirect){
          return (
            <HashRouter>
              <Switch>
                <Route path="/" render={(props) => <Page401 kc={this.state.keycloak}
                                                            userDetails={this.state.userDetails}
                                                            {...props} /> } />
              </Switch>
            </HashRouter>
          );
        } else if(this.state.redirectToFull && this.state.readyToRedirect){
          return (
            <HashRouter>
              <Switch>
                <Route path="/" render={(props) => <Full
                  kc={this.state.keycloak}
                  userDetails={this.state.userDetails}
                  resources={this.state.tokenDetails} {...props} /> } />
              </Switch>
            </HashRouter>
          );
        }
      }
    }
    return (
      <div className="page-loader">
       <div className="loading" data-app-name={i18n.t('DPS')}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }
}

export default Auth