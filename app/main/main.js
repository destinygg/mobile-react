import React, { Component } from 'react';
import Chat from '../chat/chat.js';
import styles from './styles.js';

class TwitchView extends Component {
    constructor() {
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
    constructor() {
        super();
        // { "chatOnly": bool }
        this.state = {chatOnly: false};
    }

    render() {
        if (chatOnly) {
            return (
                <View style={styles.MainView}>
                    <Chat/>
                </View>
            );
        } else {
            return (
                <View style={styles.MainView}>
                    <TwitchView/>
                    <Chat/>
                </View>
            );
        }
    }
}