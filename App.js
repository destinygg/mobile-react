import React, { Component } from 'react';
import { StatusBar, View } from 'react-native';
//import InitNav from './app/navigation.js';
import ProfileNav from './app/profile/profile.js';


//const emotes = require('./emotes.json');

class App extends Component {
    constructor() {
        super();
        /*this.chat = new MobileChat()
                          .withEmotes(emotes)
                          .withGui()
                          .withWhispers();*/
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar barStyle='light-content' />
                <ProfileNav />
            </View>
        );
    }
}
// <InitNav screenProps={{ chat: this.chat }} />

export default App;