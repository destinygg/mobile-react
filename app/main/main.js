import React, { Component } from 'react';
import { View } from 'react-native';
import { MobileChatView } from '../chat/chat';
import styles from './styles';

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
              source={{html: `
                <iframe
                    src="http://player.twitch.tv/?destiny"
                    height="<height>"
                    width="<width>"
                    frameborder="<frameborder>"
                    scrolling="<scrolling>"
                    allowfullscreen="<allowfullscreen>">
                </iframe>
              `}}
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
                <MobileChatView screenProps={{ chat: this.chat }} />
            </View>
        );
    }
}