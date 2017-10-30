import React, { Component } from 'react';
import { View, TextInput, FlatList, KeyboardAvoidingView, Text, ActivityIndicator, Platform, RefreshControl } from 'react-native';
import styles from './styles';
import EventEmitter from '../../lib/assets/chat/js/emitter';

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

class MobileChatInput extends Component {
    render() {
        return (
            <TextInput
                style={styles.ChatInput}
                placeholder={'Write something...'}
                placeholderTextColor="#888"
                onChangeText={this.props.onChangeText}
                onSubmitEditing={this.props.onSubmit}
                ref={ref => this.input = ref}
                underlineColorAndroid='#222'
            />
        )
    }
}

export class MobileChatView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            extraData: true
        }
        this.pinned = true;
        this.input = null;
        this.inputElem = null;
        this.messageList = null;
        this.props.window.debounced = false;
    }

    render() {
        return (
            <KeyboardAvoidingView
                behavior='padding'
                style={[styles.View, styles.ChatView]}
                keyboardVerticalOffset={(Platform.OS ==='android') ? -400 : 0}
            >
                { 
                    (() => {
                        if (!this.props.window.debounced) {
                            return <ActivityIndicator size='large' style={{marginTop:25}}/>;
                        }
                    })()
                }

                <FlatList
                    data={this.state.messages}
                    style={(this.props.window.debounced) ? styles.ChatViewList : {opacity: 0}}
                    extraData={this.state.extraData}
                    renderItem={item => {
                        return item.item;
                    }}
                    ref={(ref) => this.messageList = ref}
                    onScrollBeginDrag={(e) => {
                        this.pinned = false;
                    }}
                    onMomentumScrollEnd={(e) => this._onScrollEnd(e)}
                    onScrollEndDrag={(e) => this._onScrollEnd(e)}
                    inverted={true}
                    onLayout={(e) => {
                        this.height = e.nativeEvent.layout.height;
                    }}
                />
                <MobileChatInput 
                    ref={(ref) => this.inputElem = ref}
                    onChangeText={(text) => this.input = text}
                    onSubmit={() => this.send()}
                />
            </KeyboardAvoidingView>
        );
    }

    _onScrollEnd(e) {
        if (e.nativeEvent.contentOffset.y < 50) {
            this.pinned = true;
            this.messageList.scrollToOffset(
                { offset: 0, animated: true }
            );
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
        this.setState({ messages: [].concat(this.props.window.lines).reverse() });
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
        this.debounced = false;
        this.messageKey = 0;
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
        this.lines.push(message.ui);
        message.afterRender(chat);        
        this.cleanup();                
        if (this.ui && this.ui.isPinned()) {            
            this.ui.sync();
        }
    }

    getlines(sel) {
        return this.lines.filter((line) => {
            line.props.msg.user === sel;
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
    render() {
        return (
            <View style={[styles.View, styles.ChatWrapper]}>{this.props.screenProps.chat.mainwindow.uiElem}</View>
        )
    }

    componentDidMount() {
        this.props.screenProps.chat.mainwindow.ui.sync();
    }
}
