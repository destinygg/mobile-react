import React, { Component } from 'react';
import { View, TextInput, Animated, FlatList, AsyncStorage, AppState, KeyboardAvoidingView, Text, ScrollView, TouchableOpacity, ActivityIndicator, TouchableHighlight, Platform, RefreshControl, Dimensions } from 'react-native';
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

class EmoteDirectory extends Component {
    constructor(props) {
        super(props);
        this.emotes = Array.from(emoteImgs.keys()).sort();
        this.children = this.emotes.map((emote) => {
            return (
                <TouchableHighlight style={{margin: 5}} key={emote} onPress={() => this.props.onSelect(emote)}>
                    <Emote name={emote} emoteMenu={true}/>
                </TouchableHighlight>
            );
        });
        this.flex = new Animated.Value(0.0001);
    }

    render() {
        return (
            <Animated.View style={[styles.EmoteDirectory, {flex: this.flex}]} collapsable={false}>
                <ScrollView>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
                        {this.children}
                    </View>
                </ScrollView>
            </Animated.View>
        )
    }

    componentDidMount() {
        global.bugsnag.leaveBreadcrumb('EmoteDirectory mounted.');        
    }
}

class MobileChatInput extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ""};
        this.input = null;
    }

    focus() {
        if (!this.input.isFocused()) {
            this.input.requestAnimationFrame(this.input.focus);
        }
    }

    blur() {
        if (this.input.isFocused()) {
            this.input.blur();
        }
    }

    render() {
        return (
            <View style={styles.ChatInputOuter}>
                <View style={{ justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => this.props.toggleEmoteDir()}>
                        <Text style={{
                            fontFamily: 'ionicons',
                            color: '#888',
                            fontSize: 20,
                            marginLeft: 5,
                            marginRight: 5,
                            marginTop: 2
                        }}>
                            &#xf38e;
                    </Text>
                    </TouchableOpacity>
                </View>
                <TextInput
                    style={styles.ChatInput}
                    placeholder={'Write something...'}
                    placeholderTextColor="#888"
                    onChangeText={this.props.onChangeText}
                    onSubmitEditing={this.props.onSubmit}
                    ref={ref => this.input = ref}
                    underlineColorAndroid='#222'
                    value={this.state.value}
                    keyboardAppearance='dark'
                    onFocus={() => this.props.hideEmoteDir()}
                />
            </View>
        )
    }

    componentDidMount() {
        global.bugsnag.leaveBreadcrumb('Text input mounted.');                
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
        this.input = "";
        this.inputElem = null;
        this.messageList = null;
        this.height = 0;
    }

    changeInputText(text) {
        this.input = text;
        this.inputElem.setState({value: this.input});            
    }

    appendText(text) {
        this.input = this.input + ((this.input.length === 0 || this.input.slice(-1) == " ") ? "" : " ") + text + " ";
        this.inputElem.setState({value: this.input});     
        this.inputElem.focus();               
    }

    hideEmoteDir() {
        if (this.state.emoteDirShown) {
            Animated.timing(
                this.emoteDir.flex,
                {
                    duration: 300,
                    toValue: 0.0001
                }
            ).start(() => this.setState({ emoteDirShown: false }));
        }
    }

    toggleEmoteDir() {
        if (this.state.emoteDirShown) {
            Animated.timing(
                this.emoteDir.flex,
                {
                    duration: 300,
                    toValue: 0.0001
                }
            ).start(() => this.setState({ emoteDirShown: false }));
        } else {
            Animated.timing(
                this.emoteDir.flex,
                {
                    duration: 300,
                    toValue: 1
                }
            ).start(() => this.setState({ emoteDirShown: true }));
            this.inputElem.blur();
        }
    }

    render() {
        return (
            <KeyboardAvoidingView
                behavior='padding'
                style={[styles.View, styles.ChatView]}
                keyboardVerticalOffset={(Platform.OS ==='android') ? -400 : 0}
            >
                <View style={[styles.View]}>
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
                    <EmoteDirectory onSelect={(emote) => this.appendText(emote)} ref={(ref) => this.emoteDir = ref} />                                                                            
                </View>
                <MobileChatInput 
                    ref={(ref) => this.inputElem = ref}
                    onChangeText={(text) => this.changeInputText(text)}
                    onSubmit={() => this.send()}
                    value={this.input}
                    toggleEmoteDir={() => this.toggleEmoteDir()}
                    hideEmoteDir={() => this.hideEmoteDir()}
                />
            </KeyboardAvoidingView>
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

    send() {
        this.props.chat.control.emit('SEND', this.input.trim());
        this.inputElem.input.clear();
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

    addMessage(chat, message) {
        this.lastmessage = message        
        message.ui = message.html(chat)
        this.lines.unshift(message.ui);
        message.afterRender(chat);        
        this.cleanup();                
        if (this.ui) {            
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
                this.lines.splice(0, this.lines.length - this.maxlines);
                this.ui.sync();
                this.ui.scrollToEnd();
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
