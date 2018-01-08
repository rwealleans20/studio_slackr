// YIKES look at how long this file is!!! This is terrible. To add a feature to
// this app or fix a bug you would have to read through this whole file and
// then add to it -- making the problem worse!
// Let's take a different approach and instead start breaking up this massive
// component into smaller subcomponents that are easier to reason about.
// Find all the TODO comments in this file and follow their suggestions to
// clean up this component, fix issues, and add features!

// TODO only the imports for App should be here.
import './App.css';
import 'firebase/auth';
import Button from 'material-ui/Button';
import Input from 'material-ui/Input';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Menu, { MenuItem } from 'material-ui/Menu';
import React from 'react';
import base from './rebase';
import firebase from 'firebase/app';
import logo from './logo.svg';
import { CircularProgress } from 'material-ui/Progress';

// TODO move these css imports to their respective components once created.
import './AddMessageInput.css';
import './Channel.css';
import './ChannelList.css';
import './Header.css';
import './Message.css';


export default class App extends React.Component {
  constructor(props) {
    super(props);

    // TODO this state object got massive! It needs to be broken apart along
    // with the subcomponents
    this.state = {
      open: false,
      user: {},
      channels: {},
      loading: true,
      status: 'loading',
      newChannelName: '',
      newMessage: '',
    };
  }
  componentDidMount() {
    this.ref = base.syncState("channels", {
      context: this,
      state: 'channels',
      then: function() {
        this.setState({ loading: false });
        var channels = Object.keys(this.state.channels);
        if(channels.length > 0) {
          this.setState({ selected: channels[0] });
        }
      }
    });

    // TODO this code is only used by the Header
    base.initializedApp.auth().onAuthStateChanged(user => {
      if(user) {
        this.setState({ status: 'in', user: user });
      } else {
        this.setState({ status: 'out' });
      }
    });
  }
  setSelectedChannel(channel) {
    this.setState({selected: channel});
  }
  render() {
    // TODO this code to generate the header should be moved a component.
    var userStatus = <CircularProgress/>; // For loading state
    if(this.state.status === 'in') {
      userStatus = (<div onClick={this.handleOpen.bind(this)}>
        <img alt="user profile"
          className="Header-photo" src={this.state.user.photoURL} />
        <Menu anchorEl={this.state.anchorEl} open={this.state.open}
          onClose={this.handleClose.bind(this)}>
          <MenuItem onClick={this.handleSignOut}>Sign out</MenuItem>
        </Menu>
      </div>);
    } else if(this.state.status === 'out') {
      userStatus = (<Button raised color="primary" onClick={this.handleSignIn}>
        SIGN IN
      </Button>);
    }
    var Header = (
        <header className="Header">
          <img src={logo} className="Header-logo" alt="logo" />
          SLACKR
          <span className="Header-divider"></span>
          {userStatus}
        </header>
    );

    // TODO this seems like it could be a component too?
    var channelButtons = [];
    for(var channel in this.state.channels) {
      channelButtons.push(
        <ListItem key={channel}
          button disabled={this.state.selected === channel}
          onClick={this.setSelectedChannel.bind(this, channel)}>
          <ListItemText primary={this.state.channels[channel].name}/>
        </ListItem>
      );
    }
    var ChannelList = (
      <div className="ChannelList">
        <header className="ChannelList-header">Channels</header>
        <List className="ChannelButtons">{channelButtons}</List>
        <form onSubmit={this.TODO}>
          <Input placeholder="Add Channel" label="Channel Name"
            value={this.state.newChannelName} onChange={this.TODO}/>
          <Button type="submit">
            Add
          </Button>
        </form>
      </div>
    );

    // TODO this seems like it could be a component too?
    var messages = [];
    var currentChannel = this.state.channels[this.state.selected];
    if(currentChannel && currentChannel.messages) {
      var sorted = [];
      for(var m in currentChannel.messages) {
        sorted.push({key: m, val: currentChannel.messages[m]});
      }
      sorted.sort(function(a, b) {
        return a.val.timestamp > b.val.timestamp;
      });
      for(var i = 0; i < sorted.length; i++) {
        // TODO it would be nice to have a Message component
        messages.push(
          <div key={sorted[i].key} className="Message">
            <div>
              <span className="Message-author">{sorted[i].val.author}</span>
              <span className="Message-timestamp">
                {Date(sorted[i].val.timestamp)}
              </span>
            </div>
            <div className="Message-contents">{sorted[i].val.contents}</div>
          </div>
        );
      }
    }
    var MessageInput = (
      <form className="AddMessageInput" onSubmit={this.TODO}>
        <Input className="AddMessageInput-input" placeholder="Send Message"
          value={this.state.newMessage} onChange={this.TODO}
          autoFocus={true}/>
        <Button type="submit" raised color="primary">
          SEND
        </Button>
      </form>
    );
    var Channel = (
      <div className="Channel">
        <header className="Channel-header">
          {currentChannel && currentChannel.name}
        </header>
        <div className="Channel-messages">
          {messages}
          <div ref={this.setMessagesEnd.bind(this)}></div>
        </div>
        {MessageInput}
      </div>
    );

    return (
      <div className="App">
        {Header}
        <div className="App-body">
          {ChannelList}
          {Channel}
        </div>
      </div>
    );
  }

  // TODO these functions are only used by the Header
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

  // TODO move these functions to a component where they belong
  setMessagesEnd(el) {
    this.messageEnd = el;
  }
  componentDidUpdate() {
    this.messageEnd.scrollIntoView({behavior: 'instant'});
  }

  // TODO This function can be removed once all usages of it have been removed.
  TODO() {
    console.error('The caller of this function needs to be fixed!');
  }

}
