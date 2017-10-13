import React, { Component } from 'react';
import { View, TextInput, FlatList, Text, Image } from 'react-native';
import Chat from '../../lib/assets/chat/js/chat.js';
import ChatWindow from '../../lib/assets/chat/js/window.js';
import styles from './styles.js';
import features from '../../lib/assets/chat/js/features.js';
import { emoteImgs, icons } from './images.js';

const emoteDir = require('../../lib/assets/emotes.json');

const destinyEmotes = Array.from(emoteDir['destiny']);
const twitchEmotes = Array.from(emoteDir['twitch']);

const gemoteregex = new RegExp(`\b`);
let twitchemoteregex;

function formatMessage(str){
    if(!gemoteregex || !twitchemoteregex) {
        const emoticons = destinyEmotes.join('|');
        const twitchemotes = twitchEmotes.join('|');
        gemoteregex = new RegExp(`\b${emoticons}\b`);
        twitchemoteregex = new RegExp(`\b${twitchemotes}\b`);
    }
    //let regex = (message && message.user && message.user.hasFeature(UserFeatures.SUBSCRIBERT0)) || (!message || !message.user) ? twitchemoteregex : gemoteregex;
    let regex = gemoteregex;
    let result;
    let formatted = [];

    while ((result = regex.exec(str)) !== null) {
        const before = str.substring(0, result.index);

        if (before !== "") {
            formatted.push({"string": before});            
        }

        formatted.push({"emote": result[0]});

        str = str.substring(result.index + result[0].length);
    }
    return formatted;
}

class UserFlair extends Component {
    getFeature() {
        if (this.props.name in icons) {
            return icons[this.props.name];
        }
    }
    render() {
        return (
            <Image style={styles.Flair} source={ this.getFeature() } />
        );
    }
}

class UserBadge extends Component {
    render() {
        let features = [];
        let messageStyles = [styles.MessageText, styles.UserText];
        
        for (var i = 0; i < this.props.user.features.length; i++) {
            switch (this.props.user.features[i]) {
                case "protected": {
                    break;
                } 
                case "vip": {
                    break;
                }
                case "moderator": {
                    break;
                } 
                case "admin": {
                    break;
                } 
                case "flair7": {
                    break;
                }
                case "subscriber": {
                    messageStyles.push(styles.Subscriber);
                }
                default: {
                    features.push(<UserFlair key={features.length} name={this.props.user.features[i]} />)
                    break;
                }
            }
        }

        return (
            <View style={{flexDirection: 'row'}}>
                {features}
                <Text style={messageStyles}>{this.props.user.username}: </Text>
            </View>
        )
    }
}

class Emote extends Component {
    render() {
        return (
            <Image style={styles.Emote} source={ emoteImgs.get(this.props.name) } /> 
        );
    }
}

class MobileChatMessage extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let messageFeatures = [];

        /*for (var i = 0; i < this.props.message.classes; i++) {
            messageFeatures.push(this.props.message.classes[i]);
        }*/

        const formatted = formatMessage(this.props.message.text).map((message, index) => {
            if ('string' in message) {
                return <Text style={styles.MessageText} key={index}>{message.string}</Text>
            } else if ('emote' in message) {
                return <Emote key={index} name={message.emote} />
            }
        });

        return (
            <View style={styles.ChatMessage}>
                {this.props.timeStamp === true
                    ? <Text style={styles.Timestamp}>this.props.message.timestamp</Text>
                    : null
                }
                <UserBadge user={this.props.message.user} />
                {formatted}
            </View>
        );
    }
}

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
    constructor(name, type='', label=''){
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
        this.ui = $(`<div id="chat-win-${name}" class="chat-output ${type} nano" style="display: none;">`+
                        `<div class="chat-lines nano-content"></div>`+
                        `<div class="chat-scroll-notify">More messages below</div>`+
                     `</div>`)
        this.lines = this.ui.find('.chat-lines')
    }

    destroy(){
        this.ui.remove();
        this.scrollplugin.destroy();
        return this;
    }

    into(chat){
        const normalized = this.name.toLowerCase()
        this.maxlines = chat.settings.get('maxlines')
        this.scrollplugin = new ChatScrollPlugin(chat, this.ui)
        this.tag = chat.taggednicks.get(normalized) || tagcolors[Math.floor(Math.random()*tagcolors.length)]
        chat.addWindow(normalized, this)
        return this
    }

    addMessage(chat, message){
        this.lastmessage = message
        this.lines.append(message.ui)
        this.linecount++
        this.cleanup()
        // trigger bound view re-render
    }

    getlines(sel){
        return this.lines.children(sel);
    }

    removelines(sel){
        const remove = this.lines.children(sel);
        this.linecount -= remove.length;
        remove.remove();
    }

    // Rid excess chat lines if the chat is pinned
    // Get the scroll position before adding the new line / removing old lines
    cleanup(){
        if(this.scrollplugin.isPinned() || this.waspinned) {
            const lines = this.lines.children();
            if(lines.length >= this.maxlines){
                const remove = lines.slice(0, lines.length - this.maxlines);
                this.linecount -= remove.length;
                remove.remove();
            }
        }
    }
}

/* Subclass reimplementing all methods using jQuery. */
class MobileChat extends Chat {
    constructor() {
        super();
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