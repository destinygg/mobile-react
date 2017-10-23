import React, { Component } from 'react';
import { View, WebView, Dimensions } from 'react-native';
import { MobileChatView } from '../chat/chat';
import styles from './styles';

class TwitchView extends Component {
    constructor() {
        super();
        this.state = {height: null, resizing: false};
    }

    render() {
        let style = [styles.TwitchView];
        let dividerStyle = [styles.TwitchViewDivider];
        
        if (this.state.height) { style.push({height: this.state.height}); }
        if (this.state.resizing) { dividerStyle.push(style.DividerResizing); }

        return (
            <View style={style}>
                <WebView
                    source={{uri: `https://player.twitch.tv/?channel=destiny"`}}
                    scrollEnabled={false}
                    allowsInlineMediaPlayback={true}
                />
                <View style={dividerStyle}>
                    <View style={styles.TwitchViewDividerHandle} />
                </View>
            </View>
        );
    }

    _beginResize() {
        this.setState({ resizing: true });
    }

    _resize(gestureState) {
        this.setState({ height: gestureState.moveY });
    }

    _endResize(gestureState) {
        this.setState({
            resizing: false,
            height: gestureState.moveY
        });
    }

    componentWillMount() {
        this._panResponder = PanResponder.create({ 
            onStartShouldSetPanResponder: (evt, gestureState) => true, 
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true, 
            onMoveShouldSetPanResponder: (evt, gestureState) => true, 
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true, 
            onPanResponderGrant: (evt, gestureState) => {  
                this._beginResize();
            }, 
            onPanResponderMove: (evt, gestureState) => {  
                this._resize(gestureState);
            }, 
            onPanResponderTerminationRequest: (evt, gestureState) => true, 
            onPanResponderRelease: (evt, gestureState) => {  
                this._endResize(gestureState);
            }, 
            onPanResponderTerminate: (evt, gestureState) => {
                this._endResize(gestureState);
            }
        });
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