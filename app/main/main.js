import React, { Component, PureComponent } from 'react';
import { View, WebView, Dimensions, PanResponder, AsyncStorage, AppState, KeyboardAvoidingView, Platform, Animated, Keyboard, BackHandler } from 'react-native';
import { StackNavigator, SafeAreaView, NavigationActions } from 'react-navigation';
import { MobileChatView, MobileChatInput } from '../chat/window';
import styles from './styles';
import { ButtonList } from '../components'


const MIN_SWIPE_DISTANCE = 5;
const DEVICE_HEIGHT = parseFloat(Dimensions.get('window').height);
const THRESHOLD = DEVICE_HEIGHT - 150;
const VY_MAX = 0.1;

class TwitchView extends Component {
    constructor() {
        super();
        this.state = {height: null, resizing: false};
    }

    render() {
        let twitchViewStyle = [styles.TwitchViewOuter];

        if (this.props.landscape) { 
            twitchViewStyle.push({ flex: 1 });
        } else {
            if (this.state.height) { twitchViewStyle.push({ flex: 0, height: this.state.height}); }            
        }

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
            <View style={styles.CardDrawerNavList}>
                <ButtonList listItems={this.routes} listButtonStyle={{backgroundColor: '#151515'}} />
            </View>
        )
    }
}

class CardDrawer extends Component {
    constructor(props) {
        super(props);
        this.height = null;
        this.offsets = null;
        this.openedY = this.props.mainView.state.interpolate.max;
        this.closedY = this.props.mainView.state.interpolate.min;
        this.translateY = this.props.mainView.state.translateY;
        this.panY = this.props.mainView.state.panY;
        this.opacityBinding = this.translateY.interpolate({
            inputRange: [
                this.props.mainView.state.interpolate.max,
                this.props.mainView.state.interpolate.min
            ],
            outputRange: [1, .1]
        });
        this.handleTopBinding = this.translateY.interpolate({
            inputRange: [
                this.props.mainView.state.interpolate.max,
                this.props.mainView.state.interpolate.min
            ],
            outputRange: [15, 0]
        });
        this.handleWidthBinding = this.translateY.interpolate({
            inputRange: [
                this.props.mainView.state.interpolate.max,
                this.props.mainView.state.interpolate.min
            ],
            outputRange: [1, 0.6]
        });
        this.state = {top: 0, keyboardShown: false};
    }

    render() {
        return (
            <Animated.View style={
                [
                    styles.CardDrawer, 
                    { 
                        transform: [{
                            translateY: this.translateY
                        }]
                    },
                    {top: this.state.top}
                ]}
                {...this._panResponder.panHandlers}
            >
                <Animated.View style={[
                    styles.DrawerHandle, 
                    {
                        opacity: this.opacityBinding,
                        transform: [
                            {
                                translateY: this.handleTopBinding,
                            },
                            {
                                scaleX: this.handleWidthBinding
                            },
                        ],
                    }
                ]} 
                />
                    {this.props.children}
                    <Animated.View 
                        style={[
                            styles.CardDrawerUnderlay,
                            {
                                opacity: this.underlayOpacity
                            }
                        ]}
                        pointerEvents='none'
                    />
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

    openDrawer(options) {
        Animated.spring(this.panY, {
            toValue: this.openedY,
            bounciness: 0,
            restSpeedThreshold: 0.1,
            useNativeDriver: true,
            ...options,
        }).start(() => {
            this.props.mainView.chat.inputElem.hide();                                
            this._lastOpenValue = 1;
        });
    }

    closeDrawer(options) {
        Animated.spring(this.panY, {
            toValue: this.props.mainView.state.height,
            bounciness: 0,
            restSpeedThreshold: 1,
            useNativeDriver: true,
            ...options,
        }).start(() => {
            this.props.mainView.chat.inputElem.show();                                        
            this._lastOpenValue = 0;
        });
    }

    _onEndDrag(e, gesture) {

    }

    avoidKeyboard(height) {
        if ((this.props.mainView.state.height - height) > 100) {
            this.setState({top: -(this.props.mainView.state.height - height), keyboardShown: true});            
        } else {
            this.setState({top: 0, keyboardShown: false});                        
        }
    }

    componentWillMount() {
        this._panResponder = PanResponder.create({  // Ask to be the responder:
            onStartShouldSetPanResponder: (evt, gestureState) => false, 
            onStartShouldSetPanResponderCapture: (evt, gestureState) => false, 
            onMoveShouldSetPanResponder: (evt, { moveY, dx, dy }) => {
                if (this.state.keyboardShown) {
                    return false;
                }
                if (!dx || !dy || Math.abs(dy) < MIN_SWIPE_DISTANCE) {
                    return false;
                }
                // these prevent the user from dragging the invisible emote dir section
                if (this._lastOpenValue === 1 && moveY < this.openedY + 20) {
                    return false;
                }
                if (this._lastOpenValue === 0 && moveY < this.closedY + 20) {
                    return false
                }

                if (this._lastOpenValue === 1) {
                        this._isClosing = true;
                        return true;
                } else {
                    if (dy < 0) {
                        this._isClosing = false;
                        return true;
                    }

                    return false;
                }
            }, 
            onMoveShouldSetPanResponderCapture: (evt, { moveY, dx, dy }) => false, 
            onPanResponderGrant: (evt, gestureState) => {  // The gesture has started. Show visual feedback so the user knows
            }, 
            onPanResponderMove: Animated.event(
                [null, { moveY: this.panY }]
            ), 
            onPanResponderTerminationRequest: (evt, gestureState) => true, 
            onPanResponderRelease: (evt, { moveY, vy, dx, dy }) => {  // The user has released all touches while this view is the
                const previouslyOpen = this._isClosing;
                const isWithinVelocityThreshold = vy < VY_MAX && vy > -VY_MAX;

                if (!dx || !dy || Math.abs(dy) < MIN_SWIPE_DISTANCE) {
                    if (previouslyOpen) {
                        this.openDrawer({ velocity: (-1) * vy });
                    } else {
                        this.closeDrawer({ velocity: (-1) * vy });
                    }
                    return false;                    
                }
                
                if (
                    (vy < 0) ||
                    vy <= -VY_MAX ||
                    (isWithinVelocityThreshold &&
                        previouslyOpen)
                ) {
                    this.openDrawer({ velocity: (-1) * vy });
                } else if (
                    (vy > 0) ||
                    vy > VY_MAX ||
                    (isWithinVelocityThreshold && !previouslyOpen)
                ) {
                    this.closeDrawer({ velocity: (-1) * vy });
                } else if (previouslyOpen) {
                    this.openDrawer();
                } else {
                    this.closeDrawer();
                }
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

export default class MainView extends Component {
    static navigationOptions = {
        title: 'Stream'
    };

    constructor(props) {
        super(props);
        this.chat = props.screenProps.chat;
        this.state = {
            height: null, 
            resizing: false, 
            streamShown: true,
            settings: {
                mediaModal: null,
                emoteDirLoseFocus: null
            }
        };
        global.mainview = this;
    }

    applyMobileSettings(settings) {
        this.setState({settings: settings});
    }

    applyPreviousResizeState() {
        AsyncStorage.getItem('TwitchViewHeight').then((err, twitchViewHeight) => {
            if (err) {
                return;
            }
            if (twitchViewHeight !== null) {
                const resize = Math.floor(Number(twitchViewHeight));
                global.bugsnag.leaveBreadcrumb('Applying resize state: ' + resize);
                this.twitchView.setState({ height: resize});
                global.bugsnag.leaveBreadcrumb('Resize state applied.');                
            }
        });
    }

    hideStream() {
        this.setState({streamShown: false});
        this.cardDrawer.closeDrawer();
    }

    showStream() {
        this.setState({ streamShown: true });
        this.cardDrawer.closeDrawer();        
    }

    test() {
        this.cardDrawerNav.dispatch(NavigationActions.navigate({routeName: 'ProfileView'}))
    }

    blurInput() {
        if (this.chat.inputElem && this.chat.inputElem.blur) {
            this.chat.inputElem.blur();
        }
    }

    render() {
        let dividerStyle = [styles.TwitchViewDivider];     
        if (this.state.resizing) { 
            dividerStyle.push(styles.DividerResizing); 
        }
        return (
            <SafeAreaView style={[styles.MainView]} collapsable={false}>
                <KeyboardAvoidingView
                    behavior='height'
                    style={[styles.View]}
                    keyboardVerticalOffset={(Platform.OS === 'android') ? -400 : 0}
                    onLayout={(e) => {
                        if (this.cardDrawer && this.state.height) {
                            this.cardDrawer.avoidKeyboard(e.nativeEvent.layout.height);
                        }
                    }}
                >
                    <View
                        style={styles.View}
                        onLayout={(e) => {
                            this._onLayout(e.nativeEvent);
                        }}
                    >
                        {(this.state.streamShown) &&
                            <TwitchView ref={(ref) => this.twitchView = ref} parent={this}/>
                        }

                        <View style={dividerStyle} />
                        <View style={styles.TwitchViewDividerHandle} {...this._panResponder.panHandlers} />
                        {this.props.screenProps.chat.mainwindow.uiElem}
                    </View>
                    {this.state.height != null && 
                        <CardDrawer 
                            ref={(ref) => this.cardDrawer = ref} 
                            mainView={this}
                        >
                            <MobileChatInput
                                ref={(ref) => this.chat.inputElem = ref}
                                chat={this.chat}
                                animationBinding={{
                                    binding: this.state.translateY,
                                    interpolate: [
                                        this.state.interpolate.min - 100,
                                        this.state.interpolate.min
                                    ]
                                }}
                            />
                            <CardDrawerNavList screenProps={{ ...this.props.screenProps, mainView: this }} navigation={this.props.navigation} />
                        </CardDrawer>
                    }
                </KeyboardAvoidingView>
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
        const viewHeight = (e.layout.height > e.layout.width) ? e.layout.height : e.layout.width;
        if (this.state.height === null) {
            const interpolate = {
                max: viewHeight - 350,
                min: viewHeight - 90
            };
            const panY = new Animated.Value(viewHeight);
            this.setState({ 
                height: viewHeight,
                panY: panY,
                translateY: Animated.diffClamp(panY, interpolate.max, interpolate.min),
                interpolate: interpolate
            });
        }         
        global.bugsnag.leaveBreadcrumb('MainView after onLayout.');                        
    }

    _handleAppStateChange = (nextState) => {
        if (nextState === 'background') {
            if (this.twitchView && this.twitchView.state.height !== null) {
                AsyncStorage.setItem('TwitchViewHeight', Math.floor(this.twitchView.state.height).toString());                
            }
            AsyncStorage.setItem('InitRoute', this.props.navigation.state.routeName);
            this.chat.saveMobileSettings();
            this.chat.source.disconnect();
        }
    }

    componentDidMount() {
        global.bugsnag.leaveBreadcrumb('MainView mounted.');     
        this.chat.loadMobileSettings((settings) => {
            this.applyMobileSettings(settings);
        });   
        AppState.addEventListener('change', this._handleAppStateChange);    
        global.bugsnag.leaveBreadcrumb('Added AppState listener.');     
        BackHandler.addEventListener('hardwareBackPress', () => {
            if (this.props.screenProps.navState === 'MainNav' && 
                this.cardDrawer._lastOpenValue === 1) {
                    this.cardDrawer.closeDrawer();
                    return true;
            }
            return false;
        });           
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);   
        if (this.twitchView && this.twitchView.state.height !== null) {            
            AsyncStorage.setItem('TwitchViewHeight', Math.floor(this.twitchView.state.height).toString());        
        }
    }
}