import React, { Component } from 'react';
import styles from './styles.js';

class MessageView extends Component {
    constructor() {
        super();
        fetch("https://destiny.gg/api/messages/inbox").then(messages)
        this.state = { "messages": [] };
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