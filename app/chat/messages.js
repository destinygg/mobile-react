import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import styles from './styles';
import { emoteImgs, icons } from './images';
import { UrlFormatter, GreenTextFormatter, EmoteFormatter, MentionedUserFormatter } from './formatters'
import UserFeatures from '../../lib/assets/chat/js/features';
import { DATE_FORMATS } from '../../lib/assets/chat/js/const';
import moment from 'moment';
import throttle from 'throttle-debounce/throttle'

export const MessageTypes = {
    STATUS: 'STATUS',
    ERROR: 'ERROR',
    INFO: 'INFO',
    COMMAND: 'COMMAND',
    BROADCAST: 'BROADCAST',
    UI: 'UI',
    CHAT: 'CHAT',
    USER: 'USER',
    EMOTE: 'EMOTE'
}

const formatters = new Map()
//formatters.set('url', new UrlFormatter())
formatters.set('green', new GreenTextFormatter())
formatters.set('emote', new EmoteFormatter())
//formatters.set('mentioned', new MentionedUserFormatter())

function buildMessageTxt(chat, message) {
    // TODO we strip off the `/me ` of every message -- must be a better way to do this
    let msg = message.message.substring(0, 4).toLowerCase() === '/me ' ? message.message.substring(4) : message.message
    formatters.forEach(f => msg = f.format(chat, msg, message))
    return msg;
}
function buildFeatures(user) {
    const features = [...user.features || []]
        .filter(e => !UserFeatures.SUBSCRIBER.equals(e))
        .sort((a, b) => {
            let a1, a2;

            a1 = UserFeatures.SUBSCRIBERT4.equals(a);
            a2 = UserFeatures.SUBSCRIBERT4.equals(b);
            if (a1 > a2) return -1; if (a1 < a2) return 1;

            a1 = UserFeatures.SUBSCRIBERT3.equals(a);
            a2 = UserFeatures.SUBSCRIBERT3.equals(b);
            if (a1 > a2) return -1; if (a1 < a2) return 1;

            a1 = UserFeatures.SUBSCRIBERT2.equals(a);
            a2 = UserFeatures.SUBSCRIBERT2.equals(b);
            if (a1 > a2) return -1; if (a1 < a2) return 1;

            a1 = UserFeatures.SUBSCRIBERT1.equals(a);
            a2 = UserFeatures.SUBSCRIBERT1.equals(b);
            if (a1 > a2) return -1; if (a1 < a2) return 1;

            a1 = UserFeatures.SUBSCRIBERT0.equals(a);
            a2 = UserFeatures.SUBSCRIBERT0.equals(b);
            if (a1 > a2) return -1; if (a1 < a2) return 1;

            a1 = UserFeatures.BOT2.equals(a) || UserFeatures.BOT.equals(a);
            a2 = UserFeatures.BOT2.equals(a) || UserFeatures.BOT.equals(b);
            if (a1 > a2) return -1; if (a1 < a2) return 1;

            a1 = UserFeatures.VIP.equals(a);
            a2 = UserFeatures.VIP.equals(b);
            if (a1 > a2) return -1; if (a1 < a2) return 1;

            a1 = UserFeatures.CONTRIBUTOR.equals(a) || UserFeatures.TRUSTED.equals(a);
            a2 = UserFeatures.CONTRIBUTOR.equals(b) || UserFeatures.TRUSTED.equals(b);
            if (a1 > a2) return -1; if (a1 < a2) return 1;

            a1 = UserFeatures.NOTABLE.equals(a);
            a2 = UserFeatures.NOTABLE.equals(b);
            if (a1 > a2) return -1; if (a1 < a2) return 1;

            if (a > b) return -1; if (a < b) return 1;
            return 0;
        })
        .map((e, index) => {
            const f = UserFeatures.valueOf(e);
            return <UserFlair name={e.toLowerCase()} title={f !== null ? f.label : e} key={index}/>;
        });
    return features;
}

function buildTime(message) {
    const datetime = message.timestamp.format(DATE_FORMATS.FULL);
    const label = message.timestamp.format(DATE_FORMATS.TIME);
    return <Time title={datetime}>{label}</Time>;
}

class UserFlair extends Component {
    getFeature() {
        if (this.props.name in icons) {
            return icons[this.props.name];
        } else {
            return null;
        }
    }
    render() {
        const feature = this.getFeature();
        if (feature !== null) {
            return (
                <Image style={styles.Flair} source={feature} />
            );
        } else {
            return null;
        }
    }
}

class Time extends Component {
    render() {
        return (
            <Text style={styles.Time}>{this.props.children}</Text>
        )
    }
}

class UserBadge extends Component {
    constructor(props) {
        super(props);
        this.style = [styles.UserBadge];
        for (let i = 0; i < this.props.user.features.length; i++) {
            this.style.push(styles[this.props.user.features[i]]);
        }
    }
    render() {
        return (
            <Text>
                {this.props.children}
                <Text key='userBadgeText' style={this.style}>{this.props.user.username}</Text>
            </Text>
        )
    }
}

class Emote extends Component {
    render() {
        return (
            <View style={{width: 15, height: 20}}>
                <Image style={styles.Emote} source={emoteImgs.get(this.props.name)} />
            </View>
        );
    }
}

class MsgText extends Component {
    render() {
        return (
            <Text style={styles.MsgText}>{this.props.children}</Text>
        )
    }
}

export class MobileChatMessage extends Component {
    constructor(props) {
        super(props);
        this.formatted = [];
        for (let i = 0; i < this.props.text.length; i++) {
            if ('string' in this.props.text[i]) {
                this.formatted.push(<MsgText key={i}>{this.props.text[i].string}</MsgText>);
                continue;
            } else if ('emote' in this.props.text[i]) {
                this.formatted.push(<Emote key={i} name={this.props.text[i].emote} />);
                continue;
            } else if ('mention' in this.props.text[i]) {
                this.formatted.push(<Mention key={i} user={this.props.text[i].mention}/>);
                continue;
            } else if ('greenText' in this.props.text[i]) {
                this.formatted.push(<GreenText key={i}>{this.props.text[i].greenText}</GreenText>);
                continue;
            }
        }
    }
    render() {
        return (
            <Text style={this.props.msg.classes}>
                {this.props.time}
                {this.props.user}
                <Text>{this.props.ctrl}</Text>
                {this.formatted}
            </Text>
        );
    }
}

export class MobileChatEmoteMessage extends Component {
    render() {
        let combo = [];
        if (this.state.combo > 1) {
            combo.push(<Text style={[this.state.comboClass, comboCount]}>{this.state.combo}</Text>);
            combo.push(<Text style={[this.state.comboClass, comboX]}> X</Text>);
            combo.push(<Text style={this.state.comboClass}> Hits</Text>);
            combo.push(<Text style={comboCombo}> C-C-C-COMBO</Text>);
        }
        return (
            <Text>{this.props.emote}{combo}</Text>
        )
    }
}

export class MobileMessageBuilder {

    static element(message, classes = []) {
        return new ChatUIMessage(message, classes)
    }

    static status(message, timestamp = null) {
        return new ChatMessage(message, timestamp, MessageTypes.STATUS)
    }

    static error(message, timestamp = null) {
        return new ChatMessage(message, timestamp, MessageTypes.ERROR)
    }

    static info(message, timestamp = null) {
        return new ChatMessage(message, timestamp, MessageTypes.INFO)
    }

    static broadcast(message, timestamp = null) {
        return new ChatMessage(message, timestamp, MessageTypes.BROADCAST)
    }

    static command(message, timestamp = null) {
        return new ChatMessage(message, timestamp, MessageTypes.COMMAND)
    }

    static message(message, user, timestamp = null) {
        return new ChatUserMessage(message, user, timestamp)
    }

    static emote(emote, timestamp, count = 1) {
        return new ChatEmoteMessage(emote, timestamp, count);
    }

    static whisper(message, user, target, timestamp = null, id = null) {
        const m = new ChatUserMessage(message, user, timestamp);
        m.id = id;
        m.target = target;
        return m;
    }

    static historical(message, user, timestamp = null) {
        const m = new ChatUserMessage(message, user, timestamp);
        m.historical = true;
        return m;
    }

}

class ChatUIMessage {

    constructor(message, classes = []) {
        /** @type String */
        this.type = MessageTypes.UI
        /** @type String */
        this.message = message
        /** @type Array */
        this.classes = classes
        /** @type JQuery */
        this.ui = null
    }

    into(chat, window = null) {
        chat.addMessage(this, window);
        return this;
    }

    wrap(time, user, ctrl, text) {
        this.classes.unshift(styles[`msg-${this.type.toLowerCase()}`]);
        this.classes.unshift(styles[`msg-chat`]);
        this.uiElem = <MobileChatMessage
                        msg={this} 
                        time={time} 
                        user={user} 
                        ctrl={ctrl} 
                        text={text}
                        ref={ref => this.ui = ref}
                    />;
        return this.uiElem;
    }

    html(chat = null) {
        return this.wrap(this.message);
    }

    afterRender(chat = null) { }

}

class ChatMessage extends ChatUIMessage {

    constructor(message, timestamp = null, type = MessageTypes.CHAT) {
        super(message);
        this.user = null;
        this.type = type;
        this.continued = false;
        this.timestamp = timestamp ? moment.utc(timestamp).local() : moment();
    }

    html(chat = null) {
        if (this.continued)
            this.classes.push(styles['msg-continue']);
        return this.wrap(
            buildTime(this), null, null, buildMessageTxt(chat, this)
        );
    }
}

class ChatUserMessage extends ChatMessage {

    constructor(message, user, timestamp = null) {
        super(message, timestamp, MessageTypes.USER);
        this.user = user;
        this.id = null;
        this.isown = false;
        this.highlighted = false;
        this.historical = false;
        this.target = null;
        this.tag = null;
        this.slashme = false;
        this.mentioned = [];
    }

    html(chat = null) {
        if (this.isown)
            this.classes.push(styles['msg-own']);
        if (this.slashme)
            this.classes.push(styles['msg-me']);
        if (this.historical)
            this.classes.push(styles['msg-historical']);
        if (this.highlighted)
            this.classes.push(styles['msg-highlight']);
        if (this.continued && !this.target)
            this.classes.push(styles['msg-continue']);
        if (this.tag)
            this.classes.push(styles[`msg-tagged`]);
            this.classes.push(styles[`msg-tagged-${this.tag}`]);
        if (this.target)
            this.classes.push(styles[`msg-whisper`]);

        let ctrl = <MsgText>: </MsgText>;
        if (this.target)
            ctrl = <MsgText> whispered you ... </MsgText>;
        else if (this.slashme)
            ctrl = null;
        else if (this.continued)
            ctrl = <MsgText>> </MsgText>;

        const user = (this.continued) ?
                    null : 
                    <UserBadge user={this.user}>{buildFeatures(this.user)}</UserBadge>;
        return this.wrap(
            buildTime(this), user, ctrl, buildMessageTxt(chat, this)
        );
    }

}

function ChatEmoteMessageCount(message) {
    if (!message || !message._combo)
        return;
    let stepClass = ''
    if (message.emotecount >= 50)
        stepClass = ' x50'
    else if (message.emotecount >= 30)
        stepClass = ' x30'
    else if (message.emotecount >= 20)
        stepClass = ' x20'
    else if (message.emotecount >= 10)
        stepClass = ' x10'
    else if (message.emotecount >= 5)
        stepClass = ' x5'
    if (!message._combo)
        console.error('no combo', message._combo)
    message.ui.setState({ comboClass: stepClass });
}
const ChatEmoteMessageCountThrottle = throttle(63, ChatEmoteMessageCount)

class ChatEmoteMessage extends ChatMessage {

    constructor(emote, timestamp, count = 1) {
        super(emote, timestamp, MessageTypes.EMOTE)
        this.emotecount = count
    }   

    html(chat = null) {
        this._text = formatters.get('emote').format(chat, this.message, this);
        const emote = <Emote name={this._text} />;
        this.classes.unshift(styles[`msg-${this.type.toLowerCase()}`]);
        this.classes.unshift(styles[`msg-chat`]);
        this.uiElem = <MobileChatEmoteMessage 
                            time={buildTime(this)} 
                            emote={emote} 
                            ref={ref => this.ui = ref}
                        />
        return this.uiElem;
    }

    afterRender(chat = null) {
        this.ui.setState({ combo: this.emotecount });
    }

    incEmoteCount() {
        ++this.emotecount
        this.ui.setState({ combo: this.emotecount });        
        ChatEmoteMessageCountThrottle(this)
    }

    completeCombo() {
        ChatEmoteMessageCount(this)
    }

}