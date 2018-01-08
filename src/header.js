import React from 'react';
import logo from './logo.svg';
import { CircularProgress } from 'material-ui/Progress';
import Menu, { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';
import base from './rebase';
import firebase from 'firebase/app';


export default class Header extends React.Component {

    constructor(props) {
        super(props);

        // TODO this state object got massive! It needs to be broken apart along
        // with the subcomponents
        this.state = {
            open: false,
            user: {},
            status: 'loading',
            anchorEl: {},
        };
    }

componentDidMount() {

    // TODO this code is only used by the Header
    base.initializedApp.auth().onAuthStateChanged(user => {
      if(user) {
        this.setState({ status: 'in', user: user });
      } else {
        this.setState({ status: 'out' });
      }
    });
  }

    handleSignIn() {
        base.initializedApp.auth()
            .signInWithRedirect(new firebase.auth.GoogleAuthProvider());
    }
    handleSignOut() {
        base.initializedApp.auth().signOut();
    }
    handleOpen(event) {
        this.setState({ open: true, anchorEl: event.currentTarget });
    }
    handleClose() {
        this.setState({ open: false });
    }

    render() {
        // TODO this code to generate the header should be moved a component.
        var userStatus = <CircularProgress/>; // For loading state
        if (this.state.status === 'in') {
            userStatus = (<div onClick={this.handleOpen.bind(this)}>
        <img alt="user profile"
          className="Header-photo" src={this.state.user.photoURL} />
        <Menu anchorEl={this.state.anchorEl} open={this.state.open}
          onClose={this.handleClose.bind(this)}>
          <MenuItem onClick={this.handleSignOut}>Sign out</MenuItem>
        </Menu>
      </div>);
        }
        else if (this.state.status === 'out') {
            userStatus = (<Button raised color="primary" onClick={this.handleSignIn}>
        SIGN IN
      </Button>);
        }

        return (
            <header className="Header">
            <img src={logo} className="Header-logo" alt="logo" />
          SLACKR
            <span className="Header-divider"></span>
          {userStatus}
            </header>
        )
    }
}