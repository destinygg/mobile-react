import React, { Component } from 'react';
import { View } from 'react-native';
import ChatView from '../chat/chat.js';
import styles from './styles.js';

class TwitchView extends Component {
    constructor() {
        super();
        this.state = {"hidden": false};
    }

    render() {
        let style = [styles.TwitchView];
        
        if (this.state.hidden) { style.push(styles.TwitchViewHidden); }

        return (
            <WebView
              source={}
              style={style}
            />
        );
    }

    shouldComponentUpdate() {
        return false;
    }
}

export class MainView extends Component {
    constructor(props) {
        super(props);
        this.chat = props.screenProps.chat;
    }

    render() {
        return (
            <View style={styles.MainView}>
                <TwitchView />
                <ChatView screenProps={{ chat: this.chat }} />
            </View>
        );
    }
}