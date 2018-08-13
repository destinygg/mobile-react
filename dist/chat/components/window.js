"use strict";
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
const { EventEmitter } = require('../lib/assets/chat/js/emitter');
const { emoteImgs } = require('../images');
const messages_1 = require("./messages");
const styles_1 = __importDefault(require("../../styles"));
const tagcolors = [
    "green",
    "yellow",
    "orange",
    "red",
    "purple",
    "blue",
    "sky",
    "lime",
    "pink",
    "black"
];
const mediaExts = [
    'jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg',
    'webm', 'mkv', 'flv', 'gifv', 'avi', 'wmv',
    'mov', 'mp4', 'm4v', 'mpg', 'mpeg', '3gp'
];
class EmoteDirectory extends react_1.PureComponent {
    constructor(props) {
        super(props);
        this.scrollView = null;
        this.emotes = Array.from(Object.keys(emoteImgs)).sort();
    }
    render() {
        const children = this.emotes
            .filter((emote) => {
            return (emote.toLowerCase().indexOf(this.props.filter.toLowerCase()) === 0);
        }).map((emote) => {
            return (react_1.default.createElement(react_native_1.TouchableOpacity, { style: {
                    marginLeft: 5,
                    marginRight: 5,
                    flex: 1,
                    justifyContent: 'center'
                }, key: emote, onPress: () => this.props.onSelect(emote) },
                react_1.default.createElement(react_native_1.View, null,
                    react_1.default.createElement(messages_1.Emote, { name: emote, emoteMenu: true }))));
        });
        return (react_1.default.createElement(react_native_1.Animated.View, { style: {
                width: '100%',
                position: 'absolute',
                transform: [{
                        translateY: (this.props.translateY) ? this.props.translateY : 0
                    }],
                top: this.props.topOffset
            }, collapsable: false },
            react_1.default.createElement(react_native_1.View, { style: {
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    height: 70,
                    backgroundColor: '#151515'
                } },
                react_1.default.createElement(react_native_1.View, { style: {
                        paddingLeft: 15,
                        paddingRight: 15,
                        marginTop: 15
                    } },
                    react_1.default.createElement(react_native_1.ScrollView, { showsHorizontalScrollIndicator: false, horizontal: true, keyboardShouldPersistTaps: 'always', onContentSizeChange: () => {
                            if (this.scrollView && this.scrollView.scrollTo) {
                                this.scrollView.scrollTo({ x: 0, animated: false });
                            }
                        }, ref: ref => this.scrollView = ref }, children)))));
    }
    componentDidMount() {
        // @ts-ignore
        global.bugsnag.leaveBreadcrumb('EmoteDirectory mounted.');
    }
}
exports.EmoteDirectory = EmoteDirectory;
class MobileChatInput extends react_1.Component {
    constructor(props) {
        super(props);
        this.input = null;
        this._handleKeyboardHidden = () => {
            this.blur();
        };
        this.state = { value: "" };
        this.opacity = undefined;
    }
    set(text) {
        this.setState({ value: text });
        if (this.props.onChange) {
            this.props.onChange(text);
        }
    }
    append(text) {
        const newVal = this.state.value + ((this.state.value.length === 0 || this.state.value.slice(-1) == " ") ?
            "" :
            " ") + text + " ";
        this.set(newVal);
    }
    replace(text) {
        let oldVal = this.state.value.split(' ');
        oldVal[oldVal.length - 1] = text;
        const newVal = oldVal.join(' ');
        this.set(newVal);
    }
    get() {
        return this.state.value;
    }
    focus() {
        if (this.input && !this.input.isFocused()) {
            this.input.requestAnimationFrame(this.input.focus);
        }
    }
    send() {
        this.props.chat.send(this.state.value);
        this.set('');
    }
    blur() {
        if (this.input && this.input.isFocused()) {
            this.input.blur();
        }
    }
    render() {
        return (react_1.default.createElement(react_native_1.View, { style: Object.assign({
                flexDirection: 'row',
                zIndex: 2000,
                backgroundColor: '#151515',
                borderTopLeftRadius: 25,
                borderTopRightRadius: 25,
                paddingTop: 8,
                paddingLeft: 5,
                paddingRight: 5,
            }, this.props.style), pointerEvents: (this.props.shown) ? 'auto' : 'none' },
            react_1.default.createElement(react_native_1.Animated.View, { style: {
                    flex: 1,
                    flexDirection: 'row',
                    opacity: this.props.opacity
                } },
                react_1.default.createElement(react_native_1.TouchableOpacity, { onPress: () => this.props.onEmoteBtnPress() },
                    react_1.default.createElement(react_native_1.Text, { style: {
                            fontFamily: 'ionicons',
                            color: '#888',
                            fontSize: 30,
                            paddingLeft: 12,
                            paddingRight: 10,
                            paddingTop: 15,
                            paddingBottom: 10
                        } }, "\uF38E")),
                react_1.default.createElement(react_native_1.View, { style: {
                        borderColor: "#222",
                        backgroundColor: "#181818",
                        borderWidth: react_native_1.StyleSheet.hairlineWidth,
                        borderRadius: (react_native_1.Platform.OS === 'ios') ? 17 : 19,
                        paddingLeft: 15,
                        paddingRight: 15,
                        marginLeft: 5,
                        marginTop: 10,
                        marginRight: 15,
                        flex: 1,
                        height: (react_native_1.Platform.OS === 'ios') ? 34 : 38
                    } },
                    react_1.default.createElement(react_native_1.TextInput, { style: {
                            flex: 1,
                            fontSize: 12,
                            color: "#ccc",
                            height: 34
                        }, placeholder: 'Write something...', placeholderTextColor: "#888", onChangeText: (text) => this.set(text), onSubmitEditing: () => this.send(), ref: ref => this.input = ref, underlineColorAndroid: 'transparent', value: this.state.value, keyboardAppearance: 'dark', onFocus: this.props.onFocus, onBlur: this.props.onBlur, autoCorrect: true })))));
    }
    componentDidMount() {
        // @ts-ignore
        global.bugsnag.leaveBreadcrumb('Text input mounted.');
        react_native_1.Keyboard.addListener('keyboardDidHide', this._handleKeyboardHidden);
        this.props.chat.mainwindow.bindMobileInput(this);
    }
    componentWillUnmount() {
        react_native_1.Keyboard.removeListener('keyboardDidHide', this._handleKeyboardHidden);
        this.props.chat.mainwindow.unbindMobileInput();
    }
}
exports.MobileChatInput = MobileChatInput;
class MobileChatView extends react_1.Component {
    constructor(props) {
        super(props);
        this.messageList = null;
        this.state = {
            messages: [],
            extraData: true,
            mediaModalShown: false
        };
        this.pinned = true;
        this.height = 0;
    }
    render() {
        return (react_1.default.createElement(react_native_1.View, { style: [
                styles_1.default.View,
                {
                    flex: 1,
                    paddingTop: 0,
                    paddingRight: 10,
                    paddingLeft: 10,
                }
            ] },
            react_1.default.createElement(react_native_1.FlatList, { data: this.state.messages, style: styles_1.default.ChatViewList, extraData: this.state.extraData, renderItem: item => {
                    return item.item;
                }, ref: (ref) => this.messageList = ref, onLayout: (e) => {
                    this.height = e.nativeEvent.layout.height;
                    this.scrollToEnd();
                }, onScroll: (e) => this._onScroll(e), inverted: true, scrollsToTop: false }),
            react_1.default.createElement(react_native_1.Modal, { animationType: 'slide', transparent: true, visible: this.state.mediaModalShown, onRequestClose: () => {
                    this.setState({ mediaModalShown: false });
                } },
                react_1.default.createElement(react_native_1.View, { style: styles_1.default.MediaModal },
                    react_1.default.createElement(react_native_1.TouchableWithoutFeedback, { onPress: () => this.setState({ mediaModalShown: false }) },
                        react_1.default.createElement(react_native_1.View, { style: { position: 'absolute', height: '100%', width: '100%' } })),
                    react_1.default.createElement(react_native_1.View, { style: styles_1.default.MediaModalInner },
                        react_1.default.createElement(react_native_1.WebView, { source: { uri: this.mediaModalUri }, allowsInlineMediaPlayback: true, scalesPageToFit: true }))))));
    }
    _onScroll(e) {
        if (e.nativeEvent.contentOffset.y < 300) {
            this.pinned = true;
        }
        else {
            this.pinned = false;
        }
    }
    isPinned() {
        return this.pinned;
    }
    pin() {
        this.pinned = true;
    }
    sync() {
        if (this.pinned) {
            this.setState({ messages: [].concat(this.props.window.lines) });
        }
    }
    showMediaModal(uri) {
        this.mediaModalUri = uri;
        this.setState({ mediaModalShown: true });
    }
    componentDidMount() {
        // @ts-ignore
        global.bugsnag.leaveBreadcrumb('ChatView mounted.');
        this.sync();
    }
    scrollToEnd() {
        if (this.messageList && this.pinned) {
            //this.messageList.scrollTo(0);
        }
    }
}
exports.MobileChatView = MobileChatView;
class MobileWindow extends EventEmitter {
    constructor(name, type = '', label = '') {
        super();
        this.name = name;
        this.label = label;
        this.maxlines = 100;
        this.tag = null;
        this.lastmessage = null;
        this.chat = null;
        this.locks = 0;
        this.visible = true;
        this.lines = [];
        this.messageKey = 0;
        this.ui = null;
        this.background = false;
        this.mobileInput = undefined;
    }
    openLink(uri) {
        const extension = uri.split('.').slice(-1)[0];
        if (uri.indexOf('://') == -1) {
            uri = 'http://' + uri;
        }
        if (mediaExts.indexOf(extension) != -1 && this.chat.mobileSettings.mediaModal) {
            if (this.ui && this.ui.showMediaModal) {
                this.ui.showMediaModal(uri);
            }
        }
        else {
            react_native_1.Linking.openURL(uri);
        }
    }
    censor(nick) {
        const c = this.getlines(nick.toLowerCase());
        for (let i = 0; i < c.length; i++) {
            if (this.settings.get('showremoved')) {
                c[i].addClass('msg-censored');
            }
            else {
                this.lines.splice(this.lines.indexOf(c[i]), 1);
            }
        }
        if (this.ui) {
            this.ui.sync();
        }
    }
    appendInputText(text) {
        if (this.mobileInput) {
            this.mobileInput.append(text);
        }
    }
    bindMobileInput(input) {
        this.mobileInput = input;
    }
    unbindMobileInput() {
        this.mobileInput = undefined;
    }
    getMessageKey() {
        const key = this.messageKey;
        this.messageKey++;
        return key;
    }
    destroy() {
        this.lines = [];
        if (this.ui) {
            this.ui.sync();
        }
        return this;
    }
    into(chat) {
        const normalized = this.name.toLowerCase();
        this.tag = chat.taggednicks.get(normalized) || tagcolors[Math.floor(Math.random() * tagcolors.length)];
        chat.addWindow(normalized, this);
        this.chat = chat;
        this.uiElem = react_1.default.createElement(MobileChatView, { window: this, ref: (ref) => this.ui = ref });
        return this;
    }
    locked() {
        return this.locks > 0;
    }
    lock() {
        this.locks++;
        if (this.locks === 1) {
            if (this.ui) {
                this.waspinned = this.ui.isPinned();
            }
        }
    }
    unlock() {
        this.locks--;
    }
    enterBg() {
        this.background = true;
    }
    exitBg() {
        this.background = false;
        this.ui.sync();
    }
    addMessage(chat, message) {
        this.lastmessage = message;
        message.ui = message.html(chat);
        this.lines.unshift(message.ui);
        message.afterRender(chat);
        this.cleanup();
        if (this.ui && !this.background) {
            this.ui.sync();
        }
    }
    getlines(sel) {
        return this.lines.filter((line) => {
            if (line.props.msg.user !== null) {
                return line.props.msg.user.nick === sel;
            }
            return false;
        });
    }
    removelines(sel) {
        for (let i = 0; i < this.lines.length; i++) {
            if (this.lines[i].props.msg.user === sel) {
                this.lines.splice(i, 1);
            }
        }
        if (this.ui) {
            this.ui.sync();
        }
    }
    // Rid excess chat lines if the chat is pinned
    // Get the scroll position before adding the new line / removing old lines
    cleanup() {
        if (this.ui && (this.ui.isPinned() || this.waspinned)) {
            if (this.lines.length >= this.maxlines) {
                this.lines.splice(-1, this.lines.length - this.maxlines);
                if (!this.background) {
                    this.ui.sync();
                    this.ui.scrollToEnd();
                }
            }
        }
    }
    updateAndPin(pin = true) {
        if (this.ui) {
            if (pin) {
                this.ui.pin();
            }
        }
    }
}
exports.default = MobileWindow;
