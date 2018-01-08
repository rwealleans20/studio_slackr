// This file sets up the library used to connect Firebase to React.
// See https://github.com/tylermcginnis/re-base#api for documentation on how to
// use the libary.

import 'firebase/database';
import Rebase from 're-base';
import firebase from 'firebase/app';

var app = firebase.initializeApp({
  apiKey: "AIzaSyB5nA9CjIn5WIBxwiYljo7ELoBdIyEYODw",
  authDomain: "studio-slackr.firebaseapp.com",
  databaseURL: "https://studio-slackr.firebaseio.com",
  projectId: "studio-slackr",
  messagingSenderId: "215216937774"
});
var db = firebase.database(app);
export default Rebase.createClass(db); // base
