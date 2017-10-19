import React, { Component } from 'react';
import { StatusBar, View } from 'react-native';
//import InitNav from './app/navigation';
//import ProfileNav from './app/profile/profile';
import { MobileChat, MobileChatView } from './app/chat/chat';


//const emotes = require('./emotes.json');

class App extends Component {
    constructor() {
        super();
        /*this.chat = new MobileChat()
                          .withEmotes(emotes)
                          .withGui();*/
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar barStyle='light-content' />
                <MobileChatView />
            </View>
        );
    }
}
// <InitNav screenProps={{ chat: this.chat }} />

export default App;