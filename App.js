import React, { Component } from 'react';
import { StatusBar, View } from 'react-native';
import InitNav from './app/navigation';
import { MobileChat, MobileChatView } from './app/chat/chat';


const emotes = require('./lib/assets/emotes.json');

class App extends Component {
    constructor() {
        super();
        this.chat = new MobileChat()
                          .withEmotes(emotes);
        global.chat = this.chat;
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar barStyle='light-content' />
                <InitNav screenProps={{ chat: this.chat }} />                
            </View>
        );
    }
}

export default App;