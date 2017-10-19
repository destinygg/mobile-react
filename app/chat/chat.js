import React, { Component } from 'react';
import { View, TextInput, FlatList } from 'react-native';
import Chat from '../../lib/assets/chat/js/chat';
import ChatWindow from '../../lib/assets/chat/js/window';
import styles from './styles';
import { MobileMessageBuiler } from './messages';

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

export class MobileChatView extends Component {
    constructor(props) {
        super(props);
        this.chat = props.screenProps.chat;
        this.state = {
            "messages": [],
            extraData: false
        }
        /* I suspect that both the MobileChatView in the main view as well as 
           the separate one will stay mounted, so we will have to keep the one
           that is in-view bound to the chat instance, i.e. chat.bindView(ChatView);

           i'd instead like to try passing around a MobileChatView instance that is
           associated with the Chat itself, and rendering it in 2 diff places.
        */
    }

    render() {
        return (
            <View style={[styles.View, styles.ChatView]}>
                <FlatList
                    data={this.state.messages}
                    style={styles.ChatViewList}
                    extraData={this.state.extraData}
                    renderItem={item => item}
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
        this.ui = ui;
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
        message.ui = message.html(chat)
        message.afterRender(chat)
        this.lastmessage = message
        this.ui.addMessage(message.ui);
        this.linecount++
        this.cleanup()
    }

    getlines(sel) {
        return this.ui.getLines(sel);
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
export class MobileChat extends Chat {
    constructor() {
        super();
        this.messageBuilder = MobileMessageBuilder;
    }
    
    withGui() {

    }

    withHistory() {
        if (history && history.length > 0) {
            this.backlogloading = true;
            history.forEach(line => this.source.parseAndDispatch({ data: line }));
            this.backlogloading = false;
            this.mainwindow.updateAndPin();
        }
        return this;
    }

    saveSettings() {

    }

    onPRIVMSG() {
        const normalized = data.nick.toLowerCase()
        if (!this.ignored(normalized, data.data)) {
            if (!this.whispers.has(normalized))
                this.whispers.set(normalized, { nick: data.nick, unread: 0, open: false })
            
                const conv = this.whispers.get(normalized),
                user = this.users.get(normalized) || new ChatUser(data.nick),
                messageid = data.hasOwnProperty('messageid') ? data['messageid'] : null

                if (this.settings.get('showhispersinchat'))
                    this.messageBuilder.whisper(data.data, user, this.user.username, data.timestamp, messageid).into(this)
        }
    }

    cmdSTALK() {
        if (parts[0] && /^\d+$/.test(parts[0])) {
            parts[1] = parts[0];
            parts[0] = this.user.username;
        }
        if (!parts[0] || !nickregex.test(parts[0].toLowerCase())) {
            this.messageBuilder.error('Invalid nick - /stalk <nick> <limit>').into(this);
            return;
        }
        if (this.busystalk) {
            this.messageBuilder.error('Still busy stalking').into(this);
            return;
        }
        if (this.nextallowedstalk && this.nextallowedstalk.isAfter(new Date())) {
            this.messageBuilder.error(`Next allowed stalk ${this.nextallowedstalk.fromNow()}`).into(this);
            return;
        }
        this.busystalk = true;
        const limit = parts[1] ? parseInt(parts[1]) : 3;
        this.messageBuilder.info(`Getting messages for ${[parts[0]]} ...`).into(this);
        fetch(`/api/chat/stalk?username=${encodeURIComponent(parts[0])}&limit=${limit}`)
            .then(r => {
                this.nextallowedstalk = moment().add(10, 'seconds');
                this.busystalk = false;
                if (r.status !== 200) {
                    this.messageBuilder.error(`No messages for ${parts[0] } received. Try again later`).into(this);
                    return;
                }

                let d = r.text();
                if (!d || !d.lines || d.lines.length === 0) {
                    this.messageBuilder.info(`No messages for ${parts[0]}`).into(this);
                } else {
                    const date = moment.utc(d.lines[d.lines.length - 1]['timestamp'] * 1000).local().format(DATE_FORMATS.FULL);
                    this.messageBuilder.info(`Stalked ${parts[0]} last seen ${date}`).into(this);
                    d.lines.forEach(a => this.messageBuilder.historical(a.text, new ChatUser(d.nick), a.timestamp * 1000).into(this))
                    this.messageBuilder.info(`End of stalk (https://dgg.overrustlelogs.net/${parts[0]})`).into(this);
                }
            })
            .catch(e => {
                this.nextallowedstalk = moment().add(10, 'seconds');
                this.busystalk = false;
                this.messageBuilder.error(`Could not complete request.`).into(this)
            });
    }

    cmdMENTIONS() {
        if (parts[0] && /^\d+$/.test(parts[0])) {
            parts[1] = parts[0];
            parts[0] = this.user.username;
        }
        if (!parts[0]) parts[0] = this.user.username;
        if (!parts[0] || !nickregex.test(parts[0].toLowerCase())) {
            this.messageBuilder.error('Invalid nick - /mentions <nick> <limit>').into(this);
            return;
        }
        if (this.busymentions) {
            this.messageBuilder.error('Still busy getting mentions').into(this);
            return;
        }
        if (this.nextallowedmentions && this.nextallowedmentions.isAfter(new Date())) {
            this.messageBuilder.error(`Next allowed mentions ${this.nextallowedmentions.fromNow()}`).into(this);
            return;
        }
        this.busymentions = true;
        const limit = parts[1] ? parseInt(parts[1]) : 3;
        this.messageBuilder.info(`Getting mentions for ${[parts[0]]} ...`).into(this);
        fetch(`/api/chat/mentions?username=${encodeURIComponent(parts[0])}&limit=${limit}`)
            .then(r => {
                if (r.status !== 200) {
                    this.messageBuilder.error(`No messages for ${parts[0]} received. Try again later`).into(this);
                    return;
                }

                let d = r.text();
                this.nextallowedmentions = moment().add(10, 'seconds');
                this.busymentions = false;
                if (!d || d.length === 0) {
                    this.messageBuilder.info(`No mentions for ${parts[0]}`).into(this);
                } else {
                    const date = moment.utc(d[d.length - 1].date * 1000).local().format(DATE_FORMATS.FULL);
                    this.messageBuilder.info(`Mentions for ${parts[0]} last seen ${date}`).into(this);
                    d.forEach(a => this.messageBuilder.historical(a.text, new ChatUser(a.nick), a.date * 1000).into(this))
                    this.messageBuilder.info(`End of stalk (https://dgg.overrustlelogs.net/mentions/${parts[0]})`).into(this);
                }
            })
            .catch(e => {
                this.nextallowedmentions = moment().add(10, 'seconds');
                this.busymentions = false;
                this.messageBuilder.error(`No mentions for ${parts[0]} received. Try again later`).into(this)
            });
    }

    cmdBANINFO() {
        this.messageBuilder.info('Loading ban info ...').into(this);
        fetch(`/api/chat/me/ban`)
            .then(r => {
                if (r.status !== 200) {
                    this.messageBuilder.error('Error loading ban info.').into(this);
                    return;
                }

                let d = r.text();
                if (d === 'bannotfound') {
                    this.messageBuilder.info(`You have no active bans. Thank you.`).into(this);
                    return;
                }
                const b = $.extend({}, banstruct, d);
                const by = b.username ? b.username : 'Chat';
                const start = moment(b.starttimestamp).format(DATE_FORMATS.FULL);
                if (!b.endtimestamp) {
                    this.messageBuilder.info(`Permanent ban by ${by} starting ${start}.`).into(this);
                } else {
                    const end = moment(b.endtimestamp).calendar();
                    this.messageBuilder.info(`Temporary ban by ${by} starting ${start} and ending ${end}`).into(this);
                }
                if (b.reason) {
                    const m = this.messageBuilder.message(b.reason, new ChatUser(by), b.starttimestamp)
                    m.historical = true
                    m.into(this)
                }
                this.messageBuilder.info(`End of ban information`).into(this);
            })
    }
}