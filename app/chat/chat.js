import React, { Component } from 'react';
import { View, TextInput, FlatList } from 'react-native';
import Chat from '../../lib/assets/chat/js/chat.js';
import ChatWindow from '../../lib/assets/chat/js/window.js';
import styles from './styles.js';
import { MobileMessageBuiler } from './messages.js';

class MobileChatInput extends Component {
    render() {
        return (
            <TextInput
                style={styles.ChatInput}
                placeholder={'Write something...'}
                placeholderTextColor="#888"
                onSubmitEditing={this.props.onSubmit}
            />
        )
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

POSSIBLE_MESSAGES = [
    {
        user: {
            username: 'criminal_cutie',
            features: ['subscriber']
        },
        text: 'FerretLOL FerretLOL FerretLOL FerretLOL'
    },
    {
        user: {
            username: 'RightToBearArmsLOL',
            features: ['subscriber', 'flair4']
        },
        text: `KILL YOURSELF NoTears KILL YOURSELF NoTears KILL YOURSELF NoTears`
    }
]

export default class MobileChatView extends Component {
    constructor(props) {
        super(props);
        //this.chat = props.screenProps.chat;
        this.state = {
            "messages": [
                {
                    user: {
                        username: 'criminal_cutie',
                        features: ['subscriber']
                    },
                    text: 'FerretLOL'
                }
            ],
            extraData: false
        }
        //this.chat.bindView(this);
        setInterval(() => {
            const message = getRandomInt(0,2);
            let messages = this.state.messages;
            messages.push(POSSIBLE_MESSAGES[message]);
            this.setState({ messages: messages, extraData: !this.state.extraData });
        }, 1000);
    }

    render() {
        return (
            <View style={[styles.View, styles.ChatView]}>
                <FlatList
                    data={this.state.messages}
                    style={styles.ChatViewList}
                    extraData={this.state.extraData}
                    renderItem={({ item }, index) => <MobileChatMessage message={item} key={index}/>}
                />
                <MobileChatInput onSubmit={() => this.send()} />
            </View>
        );
    }
}

class MobileWindow extends ChatWindow {
    constructor(name, type = '', label = '') {
        super()
        this.name = name
        this.label = label
        this.maxlines = 0
        this.linecount = 0
        this.locks = 0
        this.waspinned = true
        this.scrollplugin = null
        this.visible = false
        this.tag = null
        this.lastmessage = null
        this.ui = $(`<div id="chat-win-${name}" class="chat-output ${type} nano" style="display: none;">` +
            `<div class="chat-lines nano-content"></div>` +
            `<div class="chat-scroll-notify">More messages below</div>` +
            `</div>`)
        this.lines = this.ui.find('.chat-lines')
    }

    destroy() {
        this.ui.remove();
        this.scrollplugin.destroy();
        return this;
    }

    into(chat) {
        const normalized = this.name.toLowerCase()
        this.maxlines = chat.settings.get('maxlines')
        this.tag = chat.taggednicks.get(normalized) || tagcolors[Math.floor(Math.random() * tagcolors.length)]
        return this
    }

    show() {
        if (!this.visible) {
            this.visible = true
        }
    }

    hide() {
        if (this.visible) {
            this.visible = false
        }
    }

    addMessage(chat, message) {
        message.ui = $(message.html(chat))
        message.afterRender(chat)
        this.lastmessage = message
        this.lines.append(message.ui)
        this.linecount++
        this.cleanup()
    }

    getlines(sel) {
        return this.lines.children(sel);
    }

    removelines(sel) {
        const remove = this.lines.children(sel);
        this.linecount -= remove.length;
        remove.remove();
    }

    locked() {
        return this.locks > 0;
    }

    lock() {
        this.locks++;
        if (this.locks === 1) {
            this.waspinned = this.scrollplugin.isPinned();
        }
    }

    unlock() {
        this.locks--;
        if (this.locks === 0) {
            this.scrollplugin.updateAndPin(this.waspinned);
        }
    }

    // Rid excess chat lines if the chat is pinned
    // Get the scroll position before adding the new line / removing old lines
    cleanup() {
        if (this.scrollplugin.isPinned() || this.waspinned) {
            const lines = this.lines.children();
            if (lines.length >= this.maxlines) {
                const remove = lines.slice(0, lines.length - this.maxlines);
                this.linecount -= remove.length;
                remove.remove();
            }
        }
    }

    updateAndPin(pin = true) {
        this.scrollplugin.updateAndPin(pin);
    }

}

/* Subclass reimplementing all methods using jQuery. */
class MobileChat extends Chat {
    constructor() {
        super();
        this.messageBuilder = MobileMessageBuilder;
    }
    
    withGui() {

    }

    withWhispers() {

    }

    saveSettings() {

    }

    onPRIVMSG() {

    }

    cmdSTALK() {

    }

    cmdMENTIONS() {

    }

    cmdBANINFO() {

    }

    createConversation() {
        
    }
}