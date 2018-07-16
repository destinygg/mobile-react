import React, { Component, PureComponent } from 'react';
import {
    Animated,
    FlatList,
    Keyboard,
    Linking,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    ViewStyle,
    WebView,
    StyleSheet,
    Platform,
} from 'react-native';

const { EventEmitter } = require('../lib/assets/chat/js/emitter');
const { emoteImgs } = require('../images');
import { Emote } from './messages';
import styles from '../../styles';

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

interface EmoteDirectoryProps {
    filter: string;
    translateY?: Animated.Value;
    topOffset: number;
    onSelect: {(emote: string): any};
}

export class EmoteDirectory extends PureComponent<EmoteDirectoryProps> {
    emotes: string[];
    scrollView: ScrollView | null = null;
    constructor(props: EmoteDirectoryProps) {
        super(props);
        this.emotes = Array.from(Object.keys(emoteImgs)).sort();
    }

    render() {
        const children = 
            this.emotes
                .filter((emote) => {
                    return (emote.toLowerCase().indexOf(this.props.filter.toLowerCase()) === 0);
                }).map((emote) => {
                    return (
                        <TouchableOpacity 
                            style={{ 
                                marginLeft: 5,
                                marginRight: 5,
                                flex: 1,
                                justifyContent: 'center' 
                            }} 
                            key={emote} 
                            onPress={() => this.props.onSelect(emote)}
                        >
                            <View>
                                <Emote name={emote} emoteMenu={true} />
                            </View>
                        </TouchableOpacity>
                    );
                });
        return (
            <Animated.View 
                style={{
                    width: '100%',
                    position: 'absolute',
                    transform: [{
                        translateY: (this.props.translateY) ? this.props.translateY : 0
                    }],
                    top: this.props.topOffset
                }} 
                collapsable={false}
            >
                <View style={{
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    height: 70,
                    backgroundColor: '#151515'
                }}>
                    <View style={{
                        paddingLeft: 15,
                        paddingRight: 15,
                        marginTop: 15
                    }}>
                        <ScrollView 
                            showsHorizontalScrollIndicator={false} 
                            horizontal={true} 
                            keyboardShouldPersistTaps={'always'}
                            onContentSizeChange={() => {
                                if (this.scrollView && this.scrollView.scrollTo) {
                                    this.scrollView.scrollTo({ x: 0, animated: false });
                                }
                            }}
                            ref={ref => this.scrollView = ref}
                        >
                            {children}
                        </ScrollView>
                    </View>
                </View>
            </Animated.View>
        )
    }

    componentDidMount() {
        // @ts-ignore
        global.bugsnag.leaveBreadcrumb('EmoteDirectory mounted.');        
    }
}

interface MobileChatInputProps {
    onChange: {(text: string): any};
    chat: any;
    opacity?: Animated.AnimatedWithChildren;
    style?: ViewStyle;
    shown?: boolean;
    onEmoteBtnPress: { (): any };
    onFocus: { (): any };
    onBlur: {(): any};
}

export class MobileChatInput extends Component<MobileChatInputProps, {value: string}> {
    opacity?: Animated.Value;
    interpolate?: Animated.Value;
    input: TextInput | null = null;

    constructor(props: MobileChatInputProps) {
        super(props);
        this.state = {value: ""};
        this.opacity = undefined;
    }

    set(text: string) {
        this.setState({ value: text }); 
        if (this.props.onChange) {
            this.props.onChange(text);
        }
    }

    append(text: string) {
        const newVal = 
            this.state.value + (
                (this.state.value.length === 0 || this.state.value.slice(-1) == " ") ? 
                "" : 
                " "
            ) + text + " ";
        this.set(newVal);     
    }

    replace(text: string) {
        let oldVal = this.state.value.split(' ');
        oldVal[oldVal.length-1] = text;
        const newVal = oldVal.join(' ');
        this.set(newVal);
    }

    get(): string {
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
        return (
            <View 
                style={Object.assign({
                    flexDirection: 'row',
                    zIndex: 2000,
                    backgroundColor: '#151515',
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    paddingTop: 8,
                    paddingLeft: 5,
                    paddingRight: 5,
                }, this.props.style)}
                pointerEvents={(this.props.shown) ? 'auto' : 'none'}
            >
                <Animated.View 
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        opacity: this.props.opacity
                    }}
                >
                    <TouchableOpacity onPress={() => this.props.onEmoteBtnPress()}>
                        <Text style={{
                            fontFamily: 'ionicons',
                            color: '#888',
                            fontSize: 30,
                            paddingLeft: 12,
                            paddingRight: 10,
                            paddingTop: 15,
                            paddingBottom: 10
                        }}>
                            &#xf38e;
                        </Text>
                    </TouchableOpacity>
                    <View style={{
                        borderColor: "#222",
                        backgroundColor: "#181818",
                        borderWidth: StyleSheet.hairlineWidth,
                        borderRadius: (Platform.OS === 'ios') ? 17 : 19,
                        paddingLeft: 15,
                        paddingRight: 15,
                        marginLeft: 5,
                        marginTop: 10,
                        marginRight: 15,
                        flex: 1,
                        height: (Platform.OS === 'ios') ? 34 : 38
                    }}>
                        <TextInput
                            style={{
                                flex: 1,
                                fontSize: 12,
                                color: "#ccc",
                                height: 34
                            }}
                            placeholder={'Write something...'}
                            placeholderTextColor="#888"
                            onChangeText={(text) => this.set(text)}
                            onSubmitEditing={() => this.send()}
                            ref={ref => this.input = ref}
                            underlineColorAndroid='transparent'
                            value={this.state.value}
                            keyboardAppearance='dark'
                            onFocus={this.props.onFocus}
                            onBlur={this.props.onBlur}
                            autoCorrect={true}
                        />
                    </View>
                </Animated.View>
            </View>
        )
    }

    _handleKeyboardHidden = () => {
        this.blur();
    }

    componentDidMount() {
        // @ts-ignore
        global.bugsnag.leaveBreadcrumb('Text input mounted.');   
        Keyboard.addListener('keyboardDidHide', this._handleKeyboardHidden);
        this.props.chat.mainwindow.bindMobileInput(this);     
    }

    componentWillUnmount() {
        Keyboard.removeListener('keyboardDidHide', this._handleKeyboardHidden);
        this.props.chat.mainwindow.unbindMobileInput();             
    }
}

interface MobileChatViewProps {
    window: any;
}

export class MobileChatView extends Component<MobileChatViewProps, {
    messages: JSX.Element[],
    extraData: boolean,
    mediaModalShown: boolean
}> {
    pinned: boolean;
    messageList: FlatList<JSX.Element> | null = null;
    height: number;
    mediaModalUri?: string;
    constructor(props: MobileChatViewProps) {
        super(props);
        this.state = {
            messages: [],
            extraData: true,
            mediaModalShown: false
        }
        this.pinned = true;
        this.height = 0;
    }

    render() {
        return (
            <View style={[
                styles.View, 
                {
                    flex: 1,
                    paddingTop: 0,
                    paddingRight: 10,
                    paddingLeft: 10,
                }
            ]}>
                <FlatList
                    data={this.state.messages}
                    style={styles.ChatViewList}
                    extraData={this.state.extraData}
                    renderItem={item => {
                        return item.item;
                    }}
                    ref={(ref) => this.messageList = ref}
                    onLayout={(e) => {
                        this.height = e.nativeEvent.layout.height;
                        this.scrollToEnd();
                    }}
                    onScroll={(e) => this._onScroll(e)}
                    inverted={true}
                    scrollsToTop={false}
                />
                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={this.state.mediaModalShown}
                    onRequestClose={() => {
                        this.setState({mediaModalShown: false})
                    }}
                >    
                    <View style={styles.MediaModal}>
                        <TouchableWithoutFeedback
                            onPress={() => this.setState({mediaModalShown: false})}
                        >
                            <View style={{position: 'absolute', height: '100%', width: '100%'}}/>
                        </TouchableWithoutFeedback> 
                        <View style={styles.MediaModalInner}>
                            <WebView 
                                source={{uri: this.mediaModalUri}}
                                allowsInlineMediaPlayback={true}
                                scalesPageToFit={true}
                            />
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }

    _onScroll(e: any) {
        if (e.nativeEvent.contentOffset.y < 300) {
            this.pinned = true;            
        } else {
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

    showMediaModal(uri: string) {
        this.mediaModalUri = uri;
        this.setState({mediaModalShown: true});
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

export default class MobileWindow extends EventEmitter {
    name: string;
    label: string;
    maxlines: number;
    tag: string | null;
    lastmessage: any;
    chat: any;
    locks: number;
    visible: boolean;
    lines: any[];
    messageKey: number;
    ui: any;
    background: boolean;
    mobileInput?: MobileChatInput;
    uiElem?: JSX.Element;
    settings!: Map<string, any>;
    waspinned!: boolean;
    constructor(name: string, type = '', label = '') {
        super()
        this.name = name
        this.label = label
        this.maxlines = 100;
        this.tag = null
        this.lastmessage = null
        this.chat = null;
        this.locks = 0
        this.visible = true;
        this.lines = [];
        this.messageKey = 0;
        this.ui = null;
        this.background = false;
        this.mobileInput = undefined;
    }

    openLink(uri: string) {
        const extension = uri.split('.').slice(-1)[0];

        if (uri.indexOf('://') == -1) {
            uri = 'http://' + uri;
        }

        if (mediaExts.indexOf(extension) != -1 && this.chat.mobileSettings.mediaModal) {
            if (this.ui && this.ui.showMediaModal) {
                this.ui.showMediaModal(uri);
            }
        } else {
            Linking.openURL(uri);
        }
    }

    censor(nick: string) {
        const c = this.getlines(nick.toLowerCase());
        
        for (let i = 0; i < c.length; i++) {
            if (this.settings.get('showremoved')) {                
                c[i].addClass('msg-censored');
            } else {
                this.lines.splice(this.lines.indexOf(c[i]), 1);
            }
        }
        if (this.ui) {
            this.ui.sync();            
        }
    }

    appendInputText(text: string) {
        if (this.mobileInput) {
            this.mobileInput.append(text);
        }
    }

    bindMobileInput(input: MobileChatInput) {
        this.mobileInput = input;
    }

    unbindMobileInput() {
        this.mobileInput = undefined;
    }

    getMessageKey(): number {
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

    into(chat: any) {
        const normalized = this.name.toLowerCase()
        this.tag = chat.taggednicks.get(normalized) || tagcolors[Math.floor(Math.random() * tagcolors.length)]
        chat.addWindow(normalized, this)
        this.chat = chat;
        this.uiElem = <MobileChatView 
                        window={this} 
                        ref={(ref) => this.ui = ref} 
                      />;   
        return this
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

    addMessage(chat: any, message: any) {
        this.lastmessage = message        
        message.ui = message.html(chat)
        this.lines.unshift(message.ui);
        message.afterRender(chat);        
        this.cleanup();                
        if (this.ui && !this.background) {            
            this.ui.sync();
        }
    }

    getlines(sel: string): any {
        return this.lines.filter((line) => {
            if (line.props.msg.user !== null) {
                return line.props.msg.user.nick === sel;
            }
            return false
        });
    }

    removelines(sel: string) {
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
            if (pin) {this.ui.pin();}
        }
    }

}