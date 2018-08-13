"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_navigation_1 = require("react-navigation");
const window_1 = require("chat/components/window");
const styles_1 = __importDefault(require("styles"));
const BottomDrawer_1 = require("../components/BottomDrawer");
const CardDrawerNavList_1 = __importDefault(require("../components/CardDrawerNavList"));
const Ionicons_1 = __importDefault(require("react-native-vector-icons/Ionicons"));
function DEVICE_HEIGHT() {
    const dims = react_native_1.Dimensions.get('window');
    return (dims.height > dims.width) ? dims.height : dims.width;
}
class TwitchView extends react_1.Component {
    render() {
        let twitchViewStyle = [{
                flex: 0,
                height: 250,
                backgroundColor: '#000'
            }];
        if (this.props.landscape) {
            twitchViewStyle.push({ flex: 1 });
        }
        else {
            if (this.props.height) {
                twitchViewStyle.push({ flex: 0, height: this.props.height });
            }
        }
        return (react_1.default.createElement(react_native_1.View, { style: twitchViewStyle, collapsable: false },
            react_1.default.createElement(react_native_1.WebView, { source: { uri: `https://player.twitch.tv/?channel=destiny&playsinline=true` }, scrollEnabled: false, style: {
                    flex: 1,
                    backgroundColor: '#000',
                    overflow: 'hidden',
                }, allowsInlineMediaPlayback: true, mediaPlaybackRequiresUserAction: false, collapsable: false, startInLoadingState: true })));
    }
    componentDidMount() {
        // @ts-ignore
        global.bugsnag.leaveBreadcrumb('TwitchView mounted.');
    }
}
class MainView extends react_1.Component {
    constructor(props) {
        super(props);
        this.cardDrawer = null;
        this.inputElem = null;
        this._handleAppStateChange = (nextState) => {
            if (nextState === 'background') {
                if (this.state.twitchHeight) {
                    react_native_1.AsyncStorage.setItem('TwitchViewHeight', Math.floor(this.state.twitchHeight).toString());
                }
                react_native_1.AsyncStorage.setItem('InitRoute', (this.state.streamShown) ? 'Main' : 'Chat');
                this.chat.source.disconnect();
                this.chat.mainwindow.lines = [];
            }
            else if (nextState === 'active') {
                const histReq = new Request("https://www.destiny.gg/api/chat/history");
                fetch(histReq).then((r) => __awaiter(this, void 0, void 0, function* () {
                    const hist = yield r.json();
                    this.chat.withHistory(hist)
                        .connect("wss://www.destiny.gg/ws");
                }));
            }
        };
        this.chat = props.screenProps.chat;
        this.state = {
            height: undefined,
            twitchHeight: undefined,
            resizing: false,
            streamShown: true,
            drawerOpen: false,
            emoteDirShown: false,
            drawerPaddingHeight: 380,
            emoteFilter: '',
            inputFocused: false,
        };
    }
    applyPreviousResizeState() {
        react_native_1.AsyncStorage.getItem('TwitchViewHeight').then((twitchViewHeight) => {
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
        this.setState({ streamShown: false });
        this.cardDrawer && this.cardDrawer.closeDrawer();
    }
    showStream() {
        this.setState({ streamShown: true });
        this.cardDrawer && this.cardDrawer.closeDrawer();
    }
    toggleEmoteDir() {
        if (this.state.emoteDirShown) {
            react_native_1.Animated.timing(this.state.emoteDirOffset, {
                duration: 300,
                toValue: 0,
                useNativeDriver: true
            }).start(() => {
                this.setState({ emoteDirShown: false });
                if (!this.state.inputFocused)
                    this.cardDrawer && this.cardDrawer.toBottom();
            });
        }
        else {
            this.cardDrawer && this.cardDrawer.toTop();
            this.setState({
                emoteDirShown: true
            }, () => {
                react_native_1.Animated.timing(this.state.emoteDirOffset, {
                    duration: 300,
                    toValue: -45,
                    useNativeDriver: true
                }).start();
            });
        }
    }
    _onInputUpdate(val) {
        this.setState({ emoteFilter: val.split(' ').slice(-1)[0] });
    }
    _onEmoteChosen(emote) {
        this.inputElem && this.inputElem.replace && this.inputElem.replace(emote);
    }
    render() {
        let dividerStyle = [{
                height: 2,
                backgroundColor: 'transparent',
            }];
        if (this.state.resizing) {
            dividerStyle.push({
                backgroundColor: '#444',
                opacity: .5
            });
        }
        console.log(this.state.twitchHeight);
        return (react_1.default.createElement(react_navigation_1.SafeAreaView, { style: styles_1.default.View },
            react_1.default.createElement(react_native_1.View, { style: { width: '100%', height: DEVICE_HEIGHT() - 95, paddingBottom: 5 }, onLayout: (e) => {
                    this._onLayout(e.nativeEvent);
                } },
                (this.state.streamShown) &&
                    react_1.default.createElement(TwitchView, { height: this.state.twitchHeight, landscape: this.state.isLandscape }),
                (this.state.streamShown) &&
                    react_1.default.createElement(react_native_1.View, { style: dividerStyle }),
                (this.state.streamShown) &&
                    react_1.default.createElement(react_native_1.View, Object.assign({ style: {
                            height: (react_native_1.Platform.OS === 'ios') ? 12 : 16,
                            marginTop: (react_native_1.Platform.OS === 'ios') ? -12 : -16,
                            top: (react_native_1.Platform.OS === 'ios') ? 6 : 8,
                            zIndex: 1000,
                            width: (react_native_1.Platform.OS === 'ios') ? 24 : 30,
                            borderRadius: (react_native_1.Platform.OS === 'ios') ? 8 : 10,
                            backgroundColor: '#151515',
                            alignSelf: 'center',
                        } }, this.panResponder.panHandlers)),
                this.chat.mainwindow.uiElem,
                this.chat.mobileSettings.menuDrawerButton &&
                    react_1.default.createElement(Ionicons_1.default, { name: "menu", style: {
                            position: "absolute",
                            right: 5
                        }, onPress: () => {
                            if (this.cardDrawer !== null) {
                                this.cardDrawer.open
                                    ? this.cardDrawer.closeDrawer()
                                    : this.cardDrawer.openDrawer();
                            }
                        } })),
            this.state.height != null &&
                react_1.default.createElement(BottomDrawer_1.BottomDrawer, { ref: (ref) => this.cardDrawer = ref, onOpen: () => this._drawerOpened(), onClose: () => this._drawerClosed(), paddingHeight: this.state.drawerPaddingHeight, posSpy: this.state.drawerPosSpy, showHandle: this.chat.menuDrawerButton === false, style: this.state.isLandscape
                        ? {
                            alignSelf: "flex-end",
                            width: "100%",
                            maxWidth: 400
                        }
                        : {
                            alignSelf: "center",
                            width: "100%"
                        } },
                    react_1.default.createElement(window_1.EmoteDirectory, { translateY: this.state.emoteDirOffset, filter: this.state.emoteFilter, topOffset: this.state.drawerPaddingHeight, onSelect: (emote) => this._onEmoteChosen(emote) }),
                    react_1.default.createElement(window_1.MobileChatInput, { ref: (ref) => this.inputElem = ref, chat: this.chat, opacity: this.state.chatInputOpacity, shown: !this.state.drawerOpen, onChange: (val) => this._onInputUpdate(val), onEmoteBtnPress: () => {
                            this.chat.mobileSettings.emoteDirLoseFocus &&
                                this.toggleEmoteDir();
                        }, onFocus: () => this._inputFocused(), onBlur: () => this._inputBlurred() }),
                    !this.state.inputFocused &&
                        react_1.default.createElement(CardDrawerNavList_1.default, { navigation: this.props.navigation, onShowStream: () => this.showStream(), onHideStream: () => this.hideStream() }),
                    this.state.inputFocused &&
                        react_1.default.createElement(react_native_1.View, { style: { height: 100, backgroundColor: '#151515' } }))));
    }
    componentWillMount() {
        // @ts-ignore
        global.bugsnag.leaveBreadcrumb('Creating pan responder.');
        this.panResponder = react_native_1.PanResponder.create({
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
        global.bugsnag.leaveBreadcrumb('Pan responder created.');
    }
    _beginResize(gestureState) {
        this.setState({ resizing: true });
    }
    _resize(gestureState) {
        if (gestureState.moveY > 50 && gestureState.moveY < this.state.height - 75) {
            this.setState({ twitchHeight: gestureState.moveY - ((react_native_1.Platform.OS === 'ios') ? 45 : 10) });
        }
    }
    _endResize(gestureState) {
        let newState = {
            resizing: false,
        };
        if (gestureState.moveY > 50 && gestureState.moveY < this.state.height - 75) {
            newState.twitchHeight = gestureState.moveY - ((react_native_1.Platform.OS === 'ios') ? 45 : 10);
        }
        this.setState(newState);
    }
    _drawerOpened() {
        this.setState({ drawerOpen: true });
    }
    _drawerClosed() {
        this.setState({ drawerOpen: false });
    }
    _inputFocused() {
        this.cardDrawer && this.cardDrawer.toTop();
        this.setState({ inputFocused: true });
    }
    _inputBlurred() {
        this.cardDrawer && this.cardDrawer.toBottom();
        this.setState({ inputFocused: false });
    }
    _onLayout(e) {
        // @ts-ignore
        global.bugsnag.leaveBreadcrumb('MainView before onLayout.');
        const viewHeight = (e.layout.height > e.layout.width) ? e.layout.height : e.layout.width;
        const isLandscape = (e.layout.width > e.layout.height);
        if (this.state.height === null) {
            const interpolate = {
                min: 0,
                max: 265
            };
            const emoteDirOffset = new react_native_1.Animated.Value(0);
            const drawerPosSpy = new react_native_1.Animated.Value(0);
            this.setState({
                height: viewHeight,
                emoteDirOffset: emoteDirOffset,
                isLandscape: isLandscape,
                drawerPosSpy: drawerPosSpy,
                chatInputOpacity: drawerPosSpy.interpolate({
                    inputRange: [interpolate.min, interpolate.max],
                    outputRange: [1, 0]
                })
            });
        }
        // @ts-ignore
        global.bugsnag.leaveBreadcrumb('MainView after onLayout.');
    }
    componentDidMount() {
        // @ts-ignore 
        global.bugsnag.leaveBreadcrumb('MainView mounted.');
        react_native_1.AsyncStorage.getItem("InitRoute").then((route) => {
            switch (route) {
                case 'Chat':
                    this.setState({ streamShown: false });
                    break;
                case 'Messages':
                    this.props.navigation.navigate('MessageView', { backHandler: this.props.navigation.goBack });
                    break;
            }
        });
        react_native_1.AppState.addEventListener('change', this._handleAppStateChange);
        // @ts-ignore 
        global.bugsnag.leaveBreadcrumb('Added AppState listener.');
        react_native_1.BackHandler.addEventListener('hardwareBackPress', () => {
            if (this.props.screenProps.navState === 'MainNav' &&
                this.cardDrawer && this.cardDrawer.open) {
                this.cardDrawer.closeDrawer();
                return true;
            }
            return false;
        });
        this.chat.loadMobileSettings();
        this.applyPreviousResizeState();
    }
    componentWillUnmount() {
        react_native_1.AppState.removeEventListener('change', this._handleAppStateChange);
        if (this.state.twitchHeight) {
            react_native_1.AsyncStorage.setItem('TwitchViewHeight', Math.floor(this.state.twitchHeight).toString());
        }
    }
}
MainView.navigationOptions = {
    title: 'Stream'
};
exports.default = MainView;
