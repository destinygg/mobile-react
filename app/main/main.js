import React, { Component } from 'react';
import { View, WebView, Dimensions, PanResponder, AsyncStorage, AppState, Platform } from 'react-native';
import { SafeAreaView } from 'react-navigation';
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
            <View style={twitchViewStyle} collapsable={false}>
                <WebView
                    source={{uri: `https://player.twitch.tv/?channel=destiny&playsinline=true`}}
                    scrollEnabled={false}
                    style={styles.TwitchViewInner}
                    allowsInlineMediaPlayback={true}
                    mediaPlaybackRequiresUserAction={false}
                    collapsable={false}
                    startInLoadingState={true}
                />
            </View> 
        );
    }

    componentDidMount() {
        this.props.parent.applyPreviousResizeState();
        global.bugsnag.leaveBreadcrumb('TwitchView mounted.');                
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
        global.mainview = this;
    }

    applyPreviousResizeState() {
        AsyncStorage.getItem('TwitchViewHeight').then((twitchViewHeight) => {
            if (twitchViewHeight !== null) {
                global.bugsnag.leaveBreadcrumb('Applying resize state: ' + twitchViewHeight);
                this.twitchView.setState({ height: Number(twitchViewHeight) });
                global.bugsnag.leaveBreadcrumb('Resize state applied.');                
            }
        });
    }

    render() {
        let dividerStyle = [styles.TwitchViewDivider];     
        if (this.state.resizing) { 
            dividerStyle.push(styles.DividerResizing); 
        }
        return (
            <SafeAreaView style={[styles.MainView]} collapsable={false}>
                <View style={styles.View} onLayout={(e) => this._onLayout(e.nativeEvent)}>
                    <TwitchView ref={(ref) => this.twitchView = ref} parent={this}/>
                    <View style={dividerStyle} />
                    <View style={styles.TwitchViewDividerHandle} {...this._panResponder.panHandlers} />                
                    {this.props.screenProps.chat.mainwindow.uiElem}
                </View>
            </SafeAreaView>
        );
    }


    componentWillMount() {
        global.bugsnag.leaveBreadcrumb('Creating pan responder.')        
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
        global.bugsnag.leaveBreadcrumb('Pan responder created.')        
    }

    _beginResize(gestureState) {
        this.setState({ resizing: true });
        this.twitchView.setState({ resizing: true });
    }

    _resize(gestureState) {
        if (gestureState.moveY > 50 && gestureState.moveY < this.state.height - 50 && this.twitchView) {
            this.twitchView.setState({ height: gestureState.moveY - ((Platform.OS === 'ios') ? 45 : 10) });
        }
    }

    _endResize(gestureState) {
        this.setState({ resizing: false });   
        let twitchState = {
            resizing: false
        }
        if (gestureState.moveY > 50 && gestureState.moveY < this.state.height - 50) {
            twitchState.height = gestureState.moveY - ((Platform.OS === 'ios') ? 45 : 10) ;
        }
        if (this.twitchView) {
            this.twitchView.setState(twitchState);            
        }
    }

    _onLayout(e) {
        global.bugsnag.leaveBreadcrumb('MainView before onLayout.');                
        this.setState({height: e.layout.height});
        global.bugsnag.leaveBreadcrumb('MainView after onLayout.');                        
    }

    _handleAppStateChange = (nextState) => {
        if (nextState === 'background') {
            if (this.twitchView.state.height !== null) {
                AsyncStorage.setItem('TwitchViewHeight', this.twitchView.state.height.toString());                
            }
            AsyncStorage.setItem('InitRoute', this.props.navigation.state.routeName);
        }
    }

    componentDidMount() {
        global.bugsnag.leaveBreadcrumb('MainView mounted.');        
        AppState.addEventListener('change', this._handleAppStateChange);    
        global.bugsnag.leaveBreadcrumb('Added AppState listener.');                
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);   
        if (this.twitchView.state.height !== null) {            
            AsyncStorage.setItem('TwitchViewHeight', this.twitchView.state.height.toString());        
        }
    }
}