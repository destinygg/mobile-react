import React, { Component, PureComponent } from 'react';
import { View, TextInput, Animated, FlatList, Keyboard, AsyncStorage, AppState, KeyboardAvoidingView, Text, ScrollView, TouchableOpacity, ActivityIndicator, TouchableHighlight, Platform, RefreshControl, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import styles from './styles';
import EventEmitter from '../../lib/assets/chat/js/emitter';
import { emoteImgs } from './images';
import { Emote } from './messages';

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

class EmoteDirectory extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {filter: ''};
        this.emotes = Array.from(emoteImgs.keys()).sort();
        this.height = new Animated.Value(0);
    }

    filter(string) {
        this.setState({filter: string.toLowerCase()});
    }

    render() {
        const children = 
            this.emotes
                .filter((emote) => {
                    return (emote.toLowerCase().indexOf(this.state.filter) === 0);
                }).map((emote) => {
                    return (
                        <TouchableHighlight style={{ marginLeft: 5, marginRight: 5, flex: 1, justifyContent: 'center' }} key={emote} onPress={() => this.props.onSelect(emote)}>
                            <View>
                                <Emote name={emote} emoteMenu={true} />
                            </View>
                        </TouchableHighlight>
                    );
                });
        return (
            <Animated.View style={[styles.EmoteDirectory, {height: this.height}]} collapsable={false}>
                <ScrollView horizontal={true} keyboardShouldPersistTaps={'always'}>
                    {children}
                </ScrollView>
            </Animated.View>
        )
    }

    componentDidMount() {
        global.bugsnag.leaveBreadcrumb('EmoteDirectory mounted.');        
    }
}

export class MobileChatInput extends Component {
    constructor(props) {
        super(props);
        this.state = {value: "", emoteDirShown: false};
        this.input = null;
    }

    set(text) {
        this.setState({ value: text }); 
        if (this.state.emoteDirShown) {
            this.emoteDir.filter(text.split(' ').slice(-1)[0]);     
        }
    }

    append(text) {
        const newVal = 
            this.state.value + (
                (this.state.value.length === 0 || this.state.value.slice(-1) == " ") ? 
                "" : 
                " "
            ) + text + " ";
        this.set(newVal);     
    }

    get() {
        return this.state.value;
    }

    focus() {
        if (!this.input.isFocused()) {
            this.input.requestAnimationFrame(this.input.focus);
        }
    }

    send() {
        this.props.chat.send(this.state.value);
        this.set('');
    }

    blur() {
        if (this.input.isFocused()) {
            this.input.blur();
        }
    }


    hideEmoteDir() {
        if (this.state.emoteDirShown) {
            Animated.timing(
                this.emoteDir.height,
                {
                    duration: 300,
                    toValue: 0
                }
            ).start(() => this.setState({ emoteDirShown: false }));
        }
    }

    toggleEmoteDir() {
        if (this.state.emoteDirShown) {
            Animated.timing(
                this.emoteDir.height,
                {
                    duration: 300,
                    toValue: 0
                }
            ).start(() => this.setState({ emoteDirShown: false }));
        } else {
            this.emoteDir.filter(this.state.value.split(' ').slice(-1)[0]);                 
            Animated.timing(
                this.emoteDir.height,
                {
                    duration: 300,
                    toValue: 50
                }
            ).start(() => this.setState({ emoteDirShown: true }));
        }
    }

    render() {
        return (
            <View style={styles.ChatInputOuter}>
                <EmoteDirectory onSelect={(emote) => this.append(emote)} ref={(ref) => this.emoteDir = ref} />                                                                                        
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => this.toggleEmoteDir()}>
                        <Text style={{
                            fontFamily: 'ionicons',
                            color: '#888',
                            fontSize: 30,
                            paddingLeft: 10,
                            paddingRight: 10,
                            paddingTop: 10,
                            paddingBottom: 10
                        }}>
                            &#xf38e;
                        </Text>
                    </TouchableOpacity>
                    <TextInput
                        style={styles.ChatInput}
                        placeholder={'Write something...'}
                        placeholderTextColor="#888"
                        onChangeText={(text) => this.set(text)}
                        onSubmitEditing={() => this.send()}
                        ref={ref => this.input = ref}
                        underlineColorAndroid='#222'
                        value={this.state.value}
                        keyboardAppearance='dark'
                    />
                </View>
            </View>
        )
    }

    componentDidMount() {
        global.bugsnag.leaveBreadcrumb('Text input mounted.');   
        Keyboard.addListener('keyboardDidHide', () => {
            this.blur();
        })             
    }
}

export class MobileChatView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            extraData: true,
            emoteDirShown: false
        }
        this.pinned = true;
        this.messageList = null;
        this.height = 0;
    }

    render() {
        return (
            <View style={[styles.View, styles.ChatView]}>
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
                />
            </View>
        );
    }

    _onScroll(e) {
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

    componentDidMount() {
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
    constructor(name, type = '', label = '') {
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
    }

    censor(nick) {
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
        const normalized = this.name.toLowerCase()
        this.tag = chat.taggednicks.get(normalized) || tagcolors[Math.floor(Math.random() * tagcolors.length)]
        chat.addWindow(normalized, this)
        this.chat = chat;
        this.uiElem = <MobileChatView chat={this.chat} window={this} ref={(ref) => this.ui = ref} />;   
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

    addMessage(chat, message) {
        this.lastmessage = message        
        message.ui = message.html(chat)
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
                line.props.msg.user.nick === sel;
            }
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
            if (pin) {this.ui.pin();}
        }
    }

}

export class ChatViewWrapper extends Component {
    static navigationOptions = {
        title: 'Chat',
    };

    constructor(props) {
        super(props);
        if (this.props.screenProps.init === true) {
            this.props.screenProps.init = false;
            AsyncStorage.getItem("InitRoute").then((route) => {
                if (['MainView', 'ChatView', 'MessageView'].indexOf(route) != -1) {
                    this.props.navigation.navigate(route);                
                }
            });
        }
    }

    _handleAppStateChange = (nextState) => {
        if (nextState === 'background') {
            AsyncStorage.setItem('InitRoute', this.props.navigation.state.routeName);
        }
    }

    render() {
        return (
            <SafeAreaView style={[styles.View]}>{this.props.screenProps.chat.mainwindow.uiElem}</SafeAreaView>
        )
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);          
    }
}
