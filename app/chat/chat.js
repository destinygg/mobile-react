import React, { Component } from 'react';
import { FlatList } from 'react-native';
import Chat from '../lib/assets/chat/js/chat.js';
import ChatWindow from '../lib/assets/chat/js/window.js';
import style from './styles.js';
import emoteStyles from './emotes.js';
import features from '../../lib/assets/chat/features.js';

const emotes = require('../../lib/assets/emotes.json');

const destinyEmoteSet = new Set(emotes['destiny']);
const twitchEmoteSet = new Set(emotes['twitch']);

const gemoteregex = new RegExp(`\b`);

const emotes = new Map(destinyEmoteSet.concat(twitchEmoteSet).map(
    (item) => [item, require(`../../lib/assets/emotes/emoticons/${item}.png`)]
));

function getFeature(name) {
    let feature = features.valueOf(name);
    if (feature) {
        return `../../lib/assets/chat/icons/icons/${feature.id}.png`;
    }
}

function formatMessage(str){
    if(!gemoteregex || !twitchemoteregex) {
        const emoticons = [...destinyEmoteSet].join('|');
        const twitchemotes = [...twitchEmoteSet].join('|');
        gemoteregex = new RegExp(`\b${emoticons}\b`);
        twitchemoteregex = new RegExp(`\b${twitchemotes}\b`);
    }
    //let regex = (message && message.user && message.user.hasFeature(UserFeatures.SUBSCRIBERT0)) || (!message || !message.user) ? twitchemoteregex : gemoteregex;
    let regex = gemoteregex;
    let result;
    let formatted = [];

    while ((result = re.exec(str)) !== null) {
        const before = str.substring(0, result.index);

        if (before !== "") {
            formatted.push({"string": before});            
        }

        formatted.push({"emote": result[0]});

        str = str.substring(result.index + result[0].length);
    }
    return formatted;
}

class UserFeature extends Component {
    render() {
        return (
            <Image source={ features.valueOf() } />
        )
    }
}

class Emote extends Component {
    render() {
        return (
            <Image source={ emotes.get(this.props.name) } /> 
        )
    }
}

export default class MobileChatView extends Component {
    constructor(props) {
        super(props);
        this.chat = props.screenProps.chat;
        this.state = {
            "messages": [],
        }
        this.chat.bindView(this);
    }

    render() {
        return (
            <FlatList
                data={this.state.messages}
                style={styles.ChatView}
                renderItem={({ item }) => <MobileChatMessage {...item} />}
            />
        )
    }
}

class MobileChatMessage extends Component {
    /*
        { "id", "username", "classes" }
    */
    constructor(props) {
        super(props);
    }
    render() {
        let messageFeatures = [];
        
        for (var i = 0; i < this.props.classes; i++) {
            messageFeatures.push(this.props.classes[i]);
        }

        const formatted = formatMessage(this.props.message).map((message) => {
            if ('string' in message) {
                return <Text>{message.string}</Text>
            } else if ('emote' in message) {
                return <Emote name={message.emote} />
            }
        });
        
        return(
            <View style={styles.ChatMessage}>{formatted}</View>
        )
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