import React, { Component } from 'react';
import { View, WebView, Dimensions } from 'react-native';
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
                source={{uri: `https://player.twitch.tv/?channel=destiny"`}}
                style={style}
                scrollEnabled={false}
                allowsInlineMediaPlayback={true}
            />
        );
    }

    shouldComponentUpdate() {
        return false;
    }
}

export default class MainView extends Component {
    constructor(props) {
        super(props);
        this.chat = props.screenProps.chat;
    }

    render() {
        return (
            <View style={[styles.MainView]}>
                <TwitchView />
                {this.props.screenProps.chat.mainwindow.uiElem}
            </View>
        );
    }

    componentDidMount() {
        this.props.screenProps.chat.mainwindow.ui.sync();
    }
}