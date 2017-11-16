import React, { Component, PureComponent } from 'react';
import { View, WebView, Dimensions, PanResponder, AsyncStorage, AppState, Platform, Animated } from 'react-native';
import { StackNavigator, SafeAreaView, NavigationActions } from 'react-navigation';
import { MobileChatView, MobileChatInput } from '../chat/window';
import styles from './styles';
import { ButtonList } from '../components'
import ProfileNav from '../profile/profile';
import MessageNav from '../messages/messages';
import DonateNav from '../donate/donate';
import AboutView from '../about/about'

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

class CardDrawerNavList extends PureComponent {
    constructor(props) {
        super(props);
        this.routes = [
            { itemText: 'Stream', itemTarget: () => this.props.screenProps.mainView.showStream() },
            { itemText: 'Chat', itemTarget: () => this.props.screenProps.mainView.hideStream() },
            { itemText: 'Messages', itemTarget: () => this.props.navigation.navigate('MessageView') },
            { itemText: 'Donate', itemTarget: () => this.props.navigation.navigate('DonateView') },
            { itemText: 'Profile', itemTarget: () => this.props.navigation.navigate('ProfileView')}
        ];
    }
    render() {
        return (
            <View style={{backgroundColor: '#151515'}}>
                <ButtonList listItems={this.routes} listButtonStyle={{backgroundColor: '#151515'}} />
            </View>
        )
    }
}

class CardDrawer extends Component {
    constructor(props) {
        super(props);
        this.panY = new Animated.Value(this.props.mainView.state.height);
        this.translateY = Animated.diffClamp(this.panY, this.props.mainView.state.height - 300, this.props.mainView.state.height - 60 );        
        this.height = null;
        this.offsets = null;
    }

    render() {
        return (
            <Animated.View style={[styles.CardDrawer, { 
                    transform: [{
                        translateY: this.translateY
                }]}]}
                {...this._panResponder.panHandlers}
            >
                {this.props.children}
            </Animated.View>            
        )
    }

    _onLayout(e) {
        this.height = e.nativeEvent.layout.height;
        this.offsets = {
            hidden: -(this.height) + 15, 
            input: -(this.height) + 50,
            full: 0
        }
    }

    _onStartDrag(e, gesture) {

    }

    _onMove(e, gesture) {
    }

    _onEndDrag(e, gesture) {

    }

    maybeOpen(gesture) {
        console.log(gesture.vy);
        if (gesture.vy < -0.15) {
            Animated.spring(this.panY, {
                toValue: this.props.mainView.state.height - 300,
                friction: 10,
                tension: -(gesture.vy*100)
            }).start();
        } else {
            Animated.spring(this.panY, {
                toValue: this.props.mainView.state.height,
                friction: 10,
                tension: 40
            }).start();
        }
    }

    componentWillMount() {
        this._panResponder = PanResponder.create({  // Ask to be the responder:
            onStartShouldSetPanResponder: (evt, gestureState) => false, 
            onStartShouldSetPanResponderCapture: (evt, gestureState) => false, 
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                if (Math.abs(gestureState.dy) > 50) {
                    return true;
                } else {
                    return false;
                }                
            }, 
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => false, 
            onPanResponderGrant: (evt, gestureState) => {  // The gesture has started. Show visual feedback so the user knows
                this.props.mainView.chat.mainwindow.enterBg()
            }, 
            onPanResponderMove: Animated.event(
                [null, { moveY: this.panY }]
            ), 
            onPanResponderTerminationRequest: (evt, gestureState) => true, 
            onPanResponderRelease: (evt, gestureState) => {  // The user has released all touches while this view is the
                // responder. This typically means a gesture has succeeded
                this.props.mainView.chat.mainwindow.exitBg()     
                this.maybeOpen(gestureState);           
            }, 
            onPanResponderTerminate: (evt, gestureState) => {  // Another component has become the responder, so this gesture
                // should be cancelled
            }, 
            onShouldBlockNativeResponder: (evt, gestureState) => {  // Returns whether this component should block native components from becoming the JS
                // responder. Returns true by default. Is currently only supported on android.
                return true;
            },
        });
    }
}

const CardDrawerNav = StackNavigator({
    NavList: { screen: CardDrawerNavList },
    MessageView: {
        screen: MessageNav,
        navigationOptions: {
            title: 'Messages'
        }
    },
    DonateView: { screen: DonateNav },
    ProfileView: { screen: ProfileNav },
    About: { screen: AboutView }
}, {
    initialRouteName: 'NavList',
    headerMode: 'none',
    cardStyle: { backgroundColor: '#151515' }
});

export default class MainView extends Component {
    static navigationOptions = {
        title: 'Stream'
    };

    constructor(props) {
        super(props);
        this.chat = props.screenProps.chat;
        this.state = {height: null, resizing: false, streamShown: true};
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

    hideStream() {
        this.setState({streamShown: false});
    }

    showStream() {
        this.setState({ streamShown: true });
    }

    test() {
        this.cardDrawerNav.dispatch(NavigationActions.navigate({routeName: 'ProfileView'}))
    }

    render() {
        let dividerStyle = [styles.TwitchViewDivider];     
        if (this.state.resizing) { 
            dividerStyle.push(styles.DividerResizing); 
        }
        return (
            <SafeAreaView style={[styles.MainView]} collapsable={false}>
                <View style={styles.View} onLayout={(e) => this._onLayout(e.nativeEvent)}>
                    {(() => {
                        if (this.state.streamShown) {
                            return (
                                <View>
                                    <TwitchView ref={(ref) => this.twitchView = ref} parent={this} />
                                    <View style={dividerStyle} />
                                    <View style={styles.TwitchViewDividerHandle} {...this._panResponder.panHandlers} />   
                                </View>
                            )
                        }
                    })()}
                    {this.props.screenProps.chat.mainwindow.uiElem}
                </View>
                {this.state.height != null && 
                    <CardDrawer ref={(ref) => this.cardDrawer = ref} mainView={this}>
                        <MobileChatInput
                            ref={(ref) => this.chat.inputElem = ref}
                            chat={this.chat}
                        />
                        <CardDrawerNav screenProps={{ ...this.props.screenProps, mainView: this }} />
                    </CardDrawer>
                }
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
                AsyncStorage.setItem('TwitchViewHeight', Math.floor(this.twitchView.state.height).toString());                
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
            AsyncStorage.setItem('TwitchViewHeight', Math.floor(this.twitchView.state.height).toString());        
        }
    }
}