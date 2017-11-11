import React, { Component } from 'react';
import { View, SafeAreaView, WebView, Dimensions, PanResponder, AsyncStorage, AppState, Platform } from 'react-native';
import { MobileChatView } from '../chat/chat';
import styles from './styles';

class TwitchView extends Component {
    constructor() {
        super();
        this.state = {height: null, resizing: false};
    }

    render() {
        let twitchViewStyle = [styles.TwitchViewOuter];

        if (this.state.height) { twitchViewStyle.push({ flex: 0, height: this.state.height}); }

        return (
            <View style={twitchViewStyle}>
                <WebView
                    source={{uri: `https://player.twitch.tv/?channel=destiny&playsinline=true`}}
                    scrollEnabled={false}
                    style={styles.TwitchViewInner}
                    allowsInlineMediaPlayback={true}
                    mediaPlaybackRequiresUserAction={false}
                />
            </View> 
        );
    }
}

export default class MainView extends Component {
    static navigationOptions = {
        title: 'Stream'
    };

    constructor(props) {
        super(props);
        this.chat = props.screenProps.chat;
        this.state = {height: null, resizing: false};
        this.applyPreviousResizeState();
    }

    applyPreviousResizeState() {
        AsyncStorage.getItem('TwitchViewHeight').then((twitchViewHeight) => {
            if (twitchViewHeight !== null) {
                this.twitchView.setState({ height: Number(twitchViewHeight) });
            }
        });
    }

    render() {
        let dividerStyle = [styles.TwitchViewDivider];        
        if (this.state.resizing) { 
            dividerStyle.push(styles.DividerResizing); 
            dividerStyle.push({top: this.state.height});
        }
        return (
            <SafeAreaView style={[styles.MainView]}>
                <TwitchView ref={(ref) => this.twitchView = ref}/>
                <View style={dividerStyle} />
                <View style={styles.TwitchViewDividerHandle} {...this._panResponder.panHandlers} />                
                {this.props.screenProps.chat.mainwindow.uiElem}
            </SafeAreaView>
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
        this.twitchView.setState({ resizing: true });
    }

    _resize(gestureState) {
        if (gestureState.moveY > 50) {
            this.twitchView.setState({ height: gestureState.moveY - ((Platform.OS === 'ios') ? 45 : 0) });
        }
    }

    _endResize(gestureState) {
        this.setState({ resizing: false });   
        let twitchState = {
            resizing: false
        }
        if (gestureState.moveY > 50) {
            twitchState.height = gestureState.moveY - ((Platform.OS === 'ios') ? 45 : 0) ;
        }
        this.twitchView.setState(twitchState);
    }


    _handleAppStateChange = (nextState) => {
        if (nextState === 'background') {
            AsyncStorage.setItem('TwitchViewHeight', this.twitchView.state.height.toString());
            AsyncStorage.setItem('InitRoute', this.props.navigation.state.routeName);
        }
    }

    componentDidMount() {
        this.props.screenProps.chat.mainwindow.ui.sync();
        AppState.addEventListener('change', this._handleAppStateChange);       
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);   
        AsyncStorage.setItem('TwitchViewHeight', this.twitchView.state.height.toString());        
    }
}