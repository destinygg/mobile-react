import React, { Component } from 'react';
import {
    Animated,
    AppState,
    AsyncStorage,
    BackHandler,
    Dimensions,
    PanResponder,
    Platform,
    View,
    WebView,
    PanResponderInstance,
    PanResponderGestureState,
    ViewStyle
} from 'react-native';
import { SafeAreaView, NavigationScreenProps } from 'react-navigation';

import { EmoteDirectory, MobileChatInput } from 'chat/components/window';
import { BottomDrawer } from 'components/BottomDrawer';
import CardDrawerNavList from 'components/CardDrawerNavList';

import Ionicons from "react-native-vector-icons/Ionicons";

import { Palette } from 'assets/constants';

function DEVICE_HEIGHT() {
    const dims = Dimensions.get('window');
    console.log(dims);
    return dims.height;
}

class TwitchView extends Component<{landscape?: boolean, height?: number}> {
    render() {
        let twitchViewStyle: ViewStyle[] = [{
            flex: 0,
            height: 250,
            backgroundColor: '#000'
        }];

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
                    style={{
                        flex: 1,
                        backgroundColor: '#000',
                        overflow: 'hidden',
                    }}
                    allowsInlineMediaPlayback={true}
                    mediaPlaybackRequiresUserAction={false}
                    collapsable={false}
                    startInLoadingState={true}
                />
            </View> 
        );
    }

    componentDidMount() {
        // @ts-ignore
        global.bugsnag.leaveBreadcrumb('TwitchView mounted.');                
    }
}

interface MainViewState {
    height?: number;
    twitchHeight?: number;
    resizing: boolean;
    streamShown: boolean;
    drawerOpen: boolean;
    drawerOnTop: boolean;
    emoteDirShown: boolean;
    emoteFilter: string;
    emoteDirOffset?: Animated.Value;
    drawerPosSpy?: Animated.Value
    chatInputOpacity?: Animated.AnimatedWithChildren;
    inputFocused: boolean;
    isLandscape?: boolean;
}
export default class MainView extends Component<NavigationScreenProps, MainViewState> {
    chat: any;
    cardDrawer: BottomDrawer | null = null;
    inputElem: MobileChatInput | null = null;

    handleTopBinding?: Animated.AnimatedInterpolation;
    handleWidthBinding?: Animated.AnimatedInterpolation;
    handleOpacityBinding?: Animated.AnimatedInterpolation;

    backdropOpacity?: Animated.AnimatedInterpolation;

    private panResponder?: PanResponderInstance;
    static navigationOptions = {
        title: 'Stream'
    };

    constructor(props: NavigationScreenProps) {
        super(props);
        this.chat = props.screenProps!.chat;
        this.state = {
            height: undefined,
            twitchHeight: undefined, 
            drawerOnTop: false,
            resizing: false, 
            streamShown: true,
            drawerOpen: false,
            emoteDirShown: false,
            emoteFilter: '',
            inputFocused: false,
        };
    }

    applyPreviousResizeState() {
        AsyncStorage.getItem('TwitchViewHeight').then((twitchViewHeight: string | null) => {
            if (twitchViewHeight !== null) {
                const resize = Math.floor(Number(twitchViewHeight));
                // @ts-ignore
                global.bugsnag.leaveBreadcrumb('Applying resize state: ' + resize);
                this.setState({ twitchHeight: resize });
                // @ts-ignore
                global.bugsnag.leaveBreadcrumb('Resize state applied.');                
            }
        });
    }

    hideStream() {
        this.setState({streamShown: false});
        this.cardDrawer && this.cardDrawer.closeDrawer();
    }

    showStream() {
        this.setState({ streamShown: true });
        this.cardDrawer && this.cardDrawer.closeDrawer();        
    }

    toggleEmoteDir() {
        if (this.state.emoteDirShown) {
            Animated.timing(
                this.state.emoteDirOffset!,
                {
                    duration: 300,
                    toValue: 0,
                    useNativeDriver: true
                }
            ).start(() => {
                this.setState({ emoteDirShown: false });
                if (!this.state.inputFocused) this.cardDrawer && this.cardDrawer.toBottom();
            });
        } else {
            this.cardDrawer && this.cardDrawer.toTop();            
            this.setState(
                {
                    emoteDirShown: true
                },
                () => {
                    Animated.timing(
                        this.state.emoteDirOffset!,
                        {
                            duration: 300,
                            toValue: -45,
                            useNativeDriver: true
                        }
                    ).start();
                }
            );
        }
    }

    _onInputUpdate(val: string) {
        this.setState({ emoteFilter: val.split(' ').slice(-1)[0] });
    }

    _onEmoteChosen(emote: string) {
        this.inputElem && this.inputElem.replace && this.inputElem.replace(emote);
    }

    render() {
        let dividerStyle: ViewStyle[] = [{
            height: 2,
            backgroundColor: 'transparent',
        }];     
        if (this.state.resizing) { 
            dividerStyle.push({
                backgroundColor: Palette.handleLine,
                opacity: .5
            }); 
        }
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: Palette.background}}>
                <View style={{flex: 1}}
                    onLayout={(e: any) => {
                        this._onLayout(e.nativeEvent);
                    }}
                >
                <View
                    style={{
                        width: '100%', 
                        flex: 1,
                        marginBottom: 75
                    }}
                >
                        {(this.state.streamShown) &&
                            <TwitchView 
                                height={this.state.twitchHeight}
                                landscape={this.state.isLandscape}
                            />
                        }
                        {(this.state.streamShown) &&
                            <View style={dividerStyle} />
                        }
                        {(this.state.streamShown) &&                        
                            <View 
                                style={{
                                    height: (Platform.OS === 'ios') ? 12 : 16,
                                    marginTop: (Platform.OS === 'ios') ? -12 : -16,
                                    top: (Platform.OS === 'ios') ? 6 : 8,
                                    zIndex: 1000,
                                    width: (Platform.OS === 'ios') ? 24 : 30,
                                    borderRadius: (Platform.OS === 'ios') ? 8 : 10,
                                    backgroundColor: Palette.drawerBg,
                                    alignSelf: 'center',
                                }} 
                                {...this.panResponder!.panHandlers} 
                            />
                        }
                        {this.chat.mainwindow.uiElem}
                </View>
                {this.state.height != null &&
                        <BottomDrawer 
                            ref={(ref) => this.cardDrawer = ref} 
                            onOpen={() => this._drawerOpened()}                 
                            onClose={() => this._drawerClosed()} 
                            onDrag={e => {
                                if (e.nativeEvent.state === "start") {
                                    this.setState({drawerOnTop: true});
                                }
                            }} 
                            posSpy={this.state.drawerPosSpy!}
                            style={this.state.isLandscape
                                ? {
                                    alignSelf: "flex-end",
                                    width: "100%",
                                    maxWidth: 500,
                                    top: this.state.height - ((this.chat.mobileSettings.menuDrawerButton === false) ? 120 : 115),
                                    position: "absolute",
                                    zIndex: this.state.drawerOnTop || this.state.emoteDirShown ? 10 : -1
                                }
                                : {
                                    alignSelf: "center",
                                    width: "100%",
                                    top: this.state.height - ((this.chat.mobileSettings.menuDrawerButton === false) ? 120 : 115),
                                    position: "absolute",
                                    zIndex: this.state.drawerOnTop || this.state.emoteDirShown ? 10 : -1
                                }
                            }
                        >               
                            <MobileChatInput
                                ref={(ref: any) => this.inputElem = ref}
                                chat={this.chat}
                                opacity={this.state.chatInputOpacity}
                                handleTop={this.handleTopBinding}
                                handleWidth={this.handleWidthBinding}
                                handleOpacity={this.handleOpacityBinding}
                                showHandle={this.chat.mobileSettings.menuDrawerButton === false}
                                shown={!this.state.drawerOpen}
                                onChange={(val: string) => this._onInputUpdate(val)}
                                onEmoteBtnPress={() => {
                                    this.toggleEmoteDir();
                                }}
                                onMenuBtnPress={() => {
                                    if (this.cardDrawer !== null) {
                                        this.setState({drawerOnTop: true});
                                        this.cardDrawer.openDrawer();
                                    }
                                }}
                                onFocus={() => this._inputFocused()}
                                onBlur={() => this._inputBlurred()}
                            >
                                <EmoteDirectory
                                    translateY={this.state.emoteDirOffset}
                                    filter={this.state.emoteFilter}
                                    onSelect={(emote: string) => this._onEmoteChosen(emote)}
                                />
                            </MobileChatInput>
                            {!this.state.inputFocused &&
                                <CardDrawerNavList
                                    navigation={this.props.navigation}
                                    onShowStream={() => this.showStream()}
                                    onHideStream={() => this.hideStream()}
                                />
                            }
                            {this.state.inputFocused &&
                                <View style={{height: 100, backgroundColor: Palette.drawerBg}} />
                            }
                        </BottomDrawer>
                }
                <Animated.View
                    style={{
                        height: "100%",
                        width: "100%",
                        position: "absolute",
                        top: 0,
                        backgroundColor: "#000",
                        opacity: this.backdropOpacity
                    }}
                    pointerEvents={"none"}
                />
                </View>
            </SafeAreaView>                         
        );
    }


    componentWillMount() {
        // @ts-ignore
        global.bugsnag.leaveBreadcrumb('Creating pan responder.')        
        this.panResponder = PanResponder.create({
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
        // @ts-ignore
        global.bugsnag.leaveBreadcrumb('Pan responder created.')        
    }

    _beginResize(gestureState: PanResponderGestureState) {
        this.setState({ resizing: true });
    }

    _resize(gestureState: PanResponderGestureState) {
        if (gestureState.moveY > 50 && gestureState.moveY < this.state.height! - 75) {
            this.setState({ twitchHeight: gestureState.moveY - ((Platform.OS === 'ios') ? 45 : 10) });
        }
    }

    _endResize(gestureState: PanResponderGestureState) {
        let newState: any = {
            resizing: false,
        }
        if (gestureState.moveY > 50 && gestureState.moveY < this.state.height! - 75) {
            newState.twitchHeight = gestureState.moveY - ((Platform.OS === 'ios') ? 45 : 10) ;
        }
        this.setState(newState);            
    }

    _drawerOpened() {
        this.setState({drawerOpen: true});

    }

    _drawerClosed() {
        this.setState({drawerOpen: false, drawerOnTop: false});
    }

    _inputFocused() {
        this.cardDrawer && this.cardDrawer.toTop();
        this.setState({inputFocused: true});
    }

    _inputBlurred() {
        this.cardDrawer && this.cardDrawer.toBottom();
        this.setState({ inputFocused: false });        
    }

    _onLayout(e: any) {
        // @ts-ignore
        global.bugsnag.leaveBreadcrumb('MainView before onLayout.');  
        const viewHeight = e.layout.height;
        const dim = Dimensions.get("window");
        const isLandscape = dim.width > dim.height;
        if (this.state.height === undefined) {
            const interpolate = {
                min: -265,
                max: 0
            };
            const emoteDirOffset = new Animated.Value(0);        
            const drawerPosSpy = new Animated.Value(0);

            this.handleTopBinding = drawerPosSpy.interpolate({
                inputRange: [interpolate.min, interpolate.max],
                outputRange: [10, 0],
                extrapolate: "clamp"
            });
            this.handleWidthBinding = drawerPosSpy.interpolate({
                inputRange: [interpolate.min, interpolate.max],
                outputRange: [1, 0.6],
                extrapolate: "clamp"
            });
            this.handleOpacityBinding = drawerPosSpy.interpolate({
                inputRange: [interpolate.min, interpolate.max],
                outputRange: [1, 0.4],
                extrapolate: "clamp"
            })
            this.backdropOpacity = drawerPosSpy.interpolate({
                inputRange: [interpolate.min, interpolate.max],
                outputRange: [0.7, 0],
                extrapolate: "clamp"
            })
            this.setState({ 
                height: viewHeight,
                emoteDirOffset: emoteDirOffset,
                isLandscape: isLandscape,
                drawerPosSpy: drawerPosSpy,
                chatInputOpacity: drawerPosSpy.interpolate({
                    inputRange: [interpolate.min/3, interpolate.max],
                    outputRange: [0, 1],
                    extrapolate: "clamp"
                })
            });
        } else {
            this.setState({height: viewHeight, isLandscape: isLandscape});
        }      
        // @ts-ignore
        global.bugsnag.leaveBreadcrumb('MainView after onLayout.');                        
    }

    _handleAppStateChange = (nextState: string) => {
        if (nextState === 'background') {
            if (this.state.twitchHeight) {
                AsyncStorage.setItem('TwitchViewHeight', Math.floor(this.state.twitchHeight).toString());                
            }
            AsyncStorage.setItem('InitRoute', (this.state.streamShown) ? 'Main' : 'Chat');
            this.chat.source.disconnect();
            this.chat.mainwindow.lines = [];
        } else if (nextState === 'active') {
            const histReq = new Request("https://www.destiny.gg/api/chat/history");
            fetch(histReq).then(async r => {
                const hist = await r.json();
                this.chat.withHistory(hist)
                    .connect("wss://www.destiny.gg/ws");
            })

        }
    }

    componentDidMount() {
        // @ts-ignore 
        global.bugsnag.leaveBreadcrumb('MainView mounted.');     
        AsyncStorage.getItem("InitRoute").then((route) => {
            switch (route) {
                case 'Chat': 
                    this.setState({streamShown: false});
                    break;
                case 'Messages':
                    this.props.navigation.navigate('MessageView', {backHandler: this.props.navigation.goBack});
                    break;
            }
        });   
        AppState.addEventListener('change', this._handleAppStateChange);   
        // @ts-ignore 
        global.bugsnag.leaveBreadcrumb('Added AppState listener.');                
        BackHandler.addEventListener('hardwareBackPress', () => {
            if (this.props.screenProps!.navState === 'MainNav' && 
                this.cardDrawer && this.cardDrawer.open) {
                    this.cardDrawer.closeDrawer();
                    return true;
            }
            return false;
        });  
        this.applyPreviousResizeState();
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);   
        if (this.state.twitchHeight) {            
            AsyncStorage.setItem('TwitchViewHeight', Math.floor(this.state.twitchHeight).toString());        
        }
    }
}