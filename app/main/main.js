import React, { Component, PureComponent } from 'react';
import { View, WebView, Dimensions, PanResponder, AsyncStorage, BackHandler, AppState, TouchableOpacity, Text, KeyboardAvoidingView, Platform, Animated, Keyboard } from 'react-native';
import { StackNavigator, SafeAreaView, NavigationActions } from 'react-navigation';
import { MobileChatView, MobileChatInput } from '../chat/window';
import styles from './styles';
import { ButtonList } from '../components'


const MIN_SWIPE_DISTANCE = 2;
const DEVICE_HEIGHT = parseFloat(Dimensions.get('window').height);
const THRESHOLD = DEVICE_HEIGHT - 150;
const VY_MAX = 0.1;

class TwitchView extends Component {
    constructor() {
        super();
    }

    render() {
        let twitchViewStyle = [styles.TwitchViewOuter];

        if (this.props.landscape) { 
            twitchViewStyle.push({ flex: 1 });
        } else {
            if (this.props.height) { twitchViewStyle.push({ flex: 0, height: this.props.height}); }            
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
        global.bugsnag.leaveBreadcrumb('TwitchView mounted.');                
    }
}

class CardDrawerNavList extends PureComponent {
    constructor(props) {
        super(props);
        this.routes = [
            { itemText: 'Stream', itemTarget: () => {
                if (this.props.onShowStream) {
                    this.props.onShowStream() 
                }
            }},
            { itemText: 'Chat', itemTarget: () => {
                if (this.props.onHideStream) {
                    this.props.onHideStream() 
                }
            }},
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
        this.state = {keyboardShown: false};
        this.height = null;
        this.offsets = null;
        this.openedY = this.props.interpolate.max;
        this.closedY = this.props.interpolate.min;
        this.translateY = this.props.translateY;
        this.keyboardShownTranslateY = this.props.keyboardShownTranslateY;
        this.panY = this.props.panY;
        this.opacityBinding = this.translateY.interpolate({
            inputRange: [
                this.props.interpolate.max,
                this.props.interpolate.min
            ],
            outputRange: [1, .1]
        });
        this.handleTopBinding = this.translateY.interpolate({
            inputRange: [
                this.props.interpolate.max,
                this.props.interpolate.min
            ],
            outputRange: [25, 0]
        });
        this.handleWidthBinding = this.translateY.interpolate({
            inputRange: [
                this.props.interpolate.max,
                this.props.interpolate.min
            ],
            outputRange: [1, 0.6]
        });
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
                    (this.state.keyboardShown) ? 
                        { 
                            transform: [{
                                translateY: this.keyboardShownTranslateY
                            }]
                        } : null
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
            </Animated.View>            
        )
    }

    openDrawer(options) {
        Animated.spring(this.panY, {
            toValue: this.openedY,
            friction: 10,
            useNativeDriver: true,
            ...options,
        }).start(() => {
            this._lastOpenValue = true;
            if (this.props.onOpen) {
                this.props.onOpen();
            }
        });
    }

    closeDrawer(options) {
        Animated.spring(this.panY, {
            toValue: this.closedY,
            friction: 10,
            useNativeDriver: true,
            ...options,
        }).start(() => {
            this._lastOpenValue = false;
            if (this.props.onClose) {
                this.props.onClose();
            }
        });
    }

    _onEndDrag(e, gesture) {

    }

    componentWillMount() {
        this._panResponder = PanResponder.create({  // Ask to be the responder:
            onStartShouldSetPanResponder: (evt, gestureState) => false, 
            onStartShouldSetPanResponderCapture: (evt, gestureState) => false, 
            onMoveShouldSetPanResponder: ({ nativeEvent }, { moveY, dx, dy, y0 }) => {
                if (this.state.keyboardShown) {
                    return false;
                }

                if (moveY > this.closedY) {
                    return false;
                }

                if (this._lastOpenValue) {
                    return true;
                } else {
                    if (dy < 0) {
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
                const previouslyOpen = this._lastOpenValue;
                const isWithinVelocityThreshold = vy < VY_MAX && vy > -VY_MAX;
                
                if (!dx || !dy || Math.abs(dy) < MIN_SWIPE_DISTANCE) {
                    if (previouslyOpen) {
                        this.openDrawer({ velocity: vy });
                    } else {
                        this.closeDrawer({ velocity: vy });
                    }
                    return;                    
                }
                
                if (
                    (vy < 0) ||
                    vy <= -VY_MAX ||
                    (isWithinVelocityThreshold &&
                        previouslyOpen)
                ) {
                    console.log(2)                    
                    this.openDrawer({ velocity: vy });
                    return;                                        
                } else if (
                    (vy > 0) ||
                    vy > VY_MAX ||
                    (isWithinVelocityThreshold && !previouslyOpen)
                ) {
                    console.log(3)                    
                    this.closeDrawer({ velocity: vy });
                    return;                                        
                } else if (previouslyOpen) {
                    console.log(4)                    
                    this.openDrawer();
                    return;                                        
                } else {
                    console.log(5)                                       
                    this.closeDrawer();
                    return;                                        
                }
            }, 
            onPanResponderTerminate: (evt, gestureState) => {  // Another component has become the responder, so this gesture
            }, 
            onShouldBlockNativeResponder: (evt, gestureState) => {  // Returns whether this component should block native components from becoming the JS
                // responder. Returns true by default. Is currently only supported on android.
                return true;
            },
        });
    }

    _handleKeyboard = (e) => {
        const offset = e.endCoordinates.screenY - 20;
        if (offset < DEVICE_HEIGHT - 100) {
            this.setState({ keyboardShown: true });
            Animated.spring(this.keyboardShownTranslateY, {
                toValue: offset,
                bounciness: 0,
                speed: 20,
                useNativeDriver: true
            }).start();
        } else {
            this.closeDrawer();            
            Animated.spring(this.keyboardShownTranslateY, {
                toValue: this.closedY,
                bounciness: 0,
                speed: 20,
                useNativeDriver: true
            }).start(() => this.setState({ keyboardShown: false }));
        }

    }

    componentDidMount() {
        Keyboard.addListener('keyboardWillChangeFrame', this._handleKeyboard);
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
            twitchHeight: null, 
            resizing: false, 
            streamShown: true,
            drawerOpen: false,
            underlayOpacity: null,
            emoteDirShown: false,
            emoteFilter: '',
            settings: {
                mediaModal: null,
                emoteDirLoseFocus: null
            }
        };
        global.mainview = this;
        this.chat.loadMobileSettings((settings) => {
            this.applyMobileSettings(settings);
        });
        this.applyPreviousResizeState();
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
                this.setState({ twitchHeight: resize });
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

    blurInput() {
        if (this.inputElem && this.inputElem.blur) {
            this.inputElem.blur();
        }
    }

    
    hideEmoteDir() {
        if (this.state.emoteDirShown) {
            Animated.timing(
                this.state.emoteDirY,
                {
                    duration: 300,
                    toValue: 0
                }
            ).start(() => {
                this.setState({ emoteDirShown: false });
            });
        }
    }

    toggleEmoteDir() {
        this.cardDrawer.measureInWindow(() => {
            
        })
        if (this.state.emoteDirShown) {
            Animated.timing(
                this.state.emoteDirY,
                {
                    duration: 300,
                    toValue: 0
                }
            ).start(() => {
                this.setState({ emoteDirShown: false });
            });
        } else {
            this.setState({emoteFilter: this.state.value.split(' ').slice(-1)[0]});     
            Animated.timing(
                this.state.emoteDirY,
                {
                    duration: 300,
                    toValue: -55
                }
            ).start(() => {
                this.setState({ emoteDirShown: true });
            });
        }
    }

    _onInputUpdate(val) {
        this.setState({ emoteFilter: val.split(' ').slice(-1)[0] });
    }

    render() {
        console.log(this.state);
        let dividerStyle = [styles.TwitchViewDivider];     
        if (this.state.resizing) { 
            dividerStyle.push(styles.DividerResizing); 
        }
        return (
            <SafeAreaView style={styles.View}>
                <View
                    style={[styles.View]}
                    onLayout={(e) => {
                        this._onLayout(e.nativeEvent);
                    }}
                >
                    {(this.state.streamShown) &&
                        <TwitchView 
                            ref={(ref) => this.twitchView = ref} 
                            parent={this} 
                            resizing={this.state.resizing}
                            height={this.state.twitchHeight}
                        />
                    }
                    <View style={dividerStyle} />
                    <View style={styles.TwitchViewDividerHandle} {...this._panResponder.panHandlers} />
                    <KeyboardAvoidingView 
                        behavior='padding' style={styles.View}
                        keyboardVerticalOffset={this.state.bottomOffset + 10}
                    >
                        {this.props.screenProps.chat.mainwindow.uiElem}
                    </KeyboardAvoidingView>
                    <Animated.View 
                        style={[styles.DrawerUnderlay, {opacity: this.state.underlayOpacity}]} 
                        pointerEvents={(this.state.drawerOpen) ? 'auto' : 'none'}
                    />
                {this.state.height != null && 
                    <EmoteDirectory 
                        onSelect={(emote) => {
                            this.inputElem.replace(emote);
                            if (this.chat.mobileSettings.emoteDirLoseFocus) {
                                this.hideEmoteDir();                            
                            }
                        }} 
                        ref={(ref) => this.emoteDir = ref} 
                        filter={this.state.emoteFilter}
                        animated={this.state.emoteDirY}
                    />  &&
                    <CardDrawer 
                        ref={(ref) => this.cardDrawer = ref} 
                        interpolate={this.state.interpolate}
                        panY={this.state.panY}
                        translateY={this.state.translateY}
                        keyboardShownTranslateY={this.state.keyboardShownTranslateY}
                        parentHeight={this.state.height}
                        onShowStream={() => this.showStream()}                    
                        onHideStream={() => this.hideStream()}   
                        onOpen={() => this._drawerOpened()}                 
                        onClose={() => this._drawerClosed()}  
                        bottomOffset={this.state.bottomOffset}
                    >
                        <View style={{flexDirection: 'row'}}>
                                <MobileChatInput
                                    ref={(ref) => this.inputElem = ref}
                                    chat={this.chat}
                                    animationBinding={{
                                        binding: this.state.translateY,
                                        interpolate: [
                                            this.state.interpolate.min - 100,
                                            this.state.interpolate.min
                                        ]
                                    }}
                                    shown={!this.state.drawerOpen}
                                    style={{paddingBottom: this.state.bottomOffset}}
                                    onChange={(val) => this._onInputUpdate(val)}
                                />
                        </View>
                        <CardDrawerNavList screenProps={{ ...this.props.screenProps, mainView: this }} navigation={this.props.navigation} />
                    </CardDrawer>
                }
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
    }

    _resize(gestureState) {
        if (gestureState.moveY > 50 && gestureState.moveY < this.state.height - 75) {
            this.setState({ twitchHeight: gestureState.moveY - ((Platform.OS === 'ios') ? 45 : 10) });
        }
    }

    _endResize(gestureState) {
        let newState = {
            resizing: false
        }
        if (gestureState.moveY > 50 && gestureState.moveY < this.state.height - 75) {
            newState.twitchHeight = gestureState.moveY - ((Platform.OS === 'ios') ? 45 : 10) ;
        }
        this.setState(newState);            
    }

    _drawerOpened() {
        this.setState({drawerOpen: true});

    }

    _drawerClosed() {
        this.setState({drawerOpen: false});
    }

    _onLayout(e) {
        global.bugsnag.leaveBreadcrumb('MainView before onLayout.');  
        const viewHeight = (e.layout.height > e.layout.width) ? e.layout.height : e.layout.width;
        const bottomOffset = DEVICE_HEIGHT - viewHeight - e.layout.y;
        if (this.state.height === null) {
            const interpolate = {
                max: viewHeight - 300,
                min: viewHeight
            };
            const panY = new Animated.Value(viewHeight);
            const translateY = Animated.diffClamp(panY, interpolate.max, interpolate.min);            
            this.setState({ 
                height: viewHeight,
                panY: panY,
                translateY: translateY,
                keyboardShownTranslateY: new Animated.Value(viewHeight),
                interpolate: interpolate,
                bottomOffset: bottomOffset,
                underlayOpacity: translateY.interpolate({
                    inputRange: [interpolate.max, interpolate.min],
                    outputRange: [0.7, 0]
                })
            });
        }         
        global.bugsnag.leaveBreadcrumb('MainView after onLayout.');                        
    }

    _handleAppStateChange(nextState) {
        if (nextState === 'background') {
            if (this.state.twitchHeight) {
                AsyncStorage.setItem('TwitchViewHeight', Math.floor(this.state.twitchHeight).toString());                
            }
            AsyncStorage.setItem('InitRoute', this.props.navigation.state.routeName);
            this.chat.saveMobileSettings();
            this.chat.source.disconnect();
        } else {
            this.chat.source.connect("wss://www.destiny.gg/ws");
        }
    }

    componentDidMount() {
        global.bugsnag.leaveBreadcrumb('MainView mounted.');        
        AppState.addEventListener('change', (state) => this._handleAppStateChange(state));    
        global.bugsnag.leaveBreadcrumb('Added AppState listener.');                
        BackHandler.addEventListener('hardwareBackPress', () => {
            if (this.props.screenProps.navState === 'MainNav' && 
                this.cardDrawer && this.cardDrawer._lastOpenValue === 1) {
                    this.cardDrawer.closeDrawer();
                    return true;
            }
            return false;
        });  
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', (state) => this._handleAppStateChange(state));   
        Keyboard.removeListener('keyboardWillChangeFrame', this._handleKeyboardShown);
        if (this.state.twitchHeight) {            
            AsyncStorage.setItem('TwitchViewHeight', Math.floor(this.state.twitchHeight).toString());        
        }
    }
}