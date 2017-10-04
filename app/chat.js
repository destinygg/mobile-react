import React, { Component } from 'react';
import Chat from '../lib/assets/chat/js/chat.js';
import ChatWindow from '../lib/assets/chat/js/window.js';

class MobileChatEntry extends Component {
    /*
        { "id", "username", "mentioned" }
    */
    constructor(props) {
        super(props);
    }
    render() {
        let componentStyle = [styles.chatMessage];
        
        for (var i = 0; i < this.props.classes; i++
    }
}

class MobileChatView extends Component {
    constructor(props) {
        super(props);
        var me = fetch('/api/chat/me', { method: "GET" });
        var history = fetch('/api/chat/history', { method: "GET" });

        Promise.all([me, history]).then(values => {

        })
        this.state = {

        }
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
        this.mobileView =
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