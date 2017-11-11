import React, { Component } from 'react';
import { StatusBar, View } from 'react-native';
import InitNav from './app/navigation';
import { MobileChat } from './app/chat/chat';
import styles from './app/styles';

const emotes = require('./lib/assets/emotes.json');

class App extends Component {
    constructor() {
        super();
        this.chat = new MobileChat()
                          .withEmotes(emotes);
    }
    render() {
        return (
            <View style={styles.View}>
                <StatusBar barStyle='light-content' />
                <InitNav screenProps={{ chat: this.chat, init: true }} />                
            </View>
        );
    }
}

export default App;