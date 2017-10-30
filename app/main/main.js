import React, { Component } from 'react';
import { View, WebView, Dimensions, PanResponder } from 'react-native';
import { MobileChatView } from '../chat/chat';
import styles from './styles';

class TwitchView extends Component {
    constructor() {
        super();
        this.state = {height: null, resizing: false};
    }

    render() {
        let style = [styles.MainView];

        if (this.state.height) { style.push({ flex: 0, height: this.state.height}); }

        return (
            <View style={style}>
                <WebView
                    source={{uri: `https://player.twitch.tv/?channel=vainglory`}}
                    scrollEnabled={false}
                    style={styles.TwitchView}
                    allowsInlineMediaPlayback={true}
                />
            </View> 
        );
    }
}

export default class MainView extends Component {
    constructor(props) {
        super(props);
        this.chat = props.screenProps.chat;
        this.state = {height: null, resizing: false};
    }

    render() {
        let dividerStyle = [styles.TwitchViewDivider];        
        if (this.state.resizing) { 
            dividerStyle.push(styles.DividerResizing); 
            dividerStyle.push({top: this.state.height});
        }
        return (
            <View style={[styles.MainView]}>
                <TwitchView ref={(ref) => this.twitchView = ref}/>
                <View style={dividerStyle}>
                    <View style={styles.TwitchViewDividerHandle} {...this._panResponder.panHandlers} />
                </View>
                {this.props.screenProps.chat.mainwindow.uiElem}
            </View>
        );
    }


    componentWillMount() {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => {
                this._beginResize(gestureState);
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

    _beginResize(gestureState) {
        this.setState({ resizing: true });
        this.twitchView.setState({ height: gestureState.moveY, resizing: true });
    }

    _resize(gestureState) {
        if (gestureState.moveY > 50) {
            this.twitchView.setState({ height: gestureState.moveY });
        }
    }

    _endResize(gestureState) {
        this.setState({ resizing: false });   
        let twitchState = {
            resizing: false
        }
        if (gestureState.moveY > 50) {
            twitchState.height = gestureState.moveY;
        }
        this.twitchView.setState(twitchState);
    }

    componentDidMount() {
        this.props.screenProps.chat.mainwindow.ui.sync();
    }
}