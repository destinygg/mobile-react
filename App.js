import React, { Component } from 'react';
import { StatusBar, View } from 'react-native';
import InitNav from './app/navigation';
import { MobileChat } from './app/chat/chat';
import styles from './app/styles';

const emotes = require('./lib/assets/emotes.json');

class App extends Component {
    constructor() {
        super();
        if (!this.chat) {
            this.chat = new MobileChat()
                .withEmotes(emotes);
        }
        this.state = {navState: null};
    }
    render() {
        return (
            <View style={styles.View}>
                <StatusBar barStyle='light-content' />
                <InitNav 
                    onNavigationStateChange={(prevState, currentState) => {
                        const currentScreen = currentState.routes[currentState.index].routeName;
                        const prevScreen = prevState.routes[prevState.index].routeName;
                        if (prevScreen !== currentScreen) {
                            this.setState({navState: currentScreen})
                        }
                    }}
                    screenProps={{ chat: this.chat, init: true, navState: this.state.navState }} 
                />                
            </View>
        );
    }
}

export default App;