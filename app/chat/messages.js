import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import styles from './styles.js';
import { emoteImgs, icons } from './images.js';
import UserFeatures from '../../lib/assets/chat/js/features.js';
import { UrlFormatter } from '../../lib/assets/chat/js/formatters.js';


const emoteDir = require('../../lib/assets/emotes.json');

const destinyEmotes = Array.from(emoteDir['destiny']);
const twitchEmotes = Array.from(emoteDir['twitch']);

const gemoteregex = new RegExp(`\b`);
let twitchemoteregex;

const MessageTypes = {
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
formatters.set('url', new UrlFormatter())
formatters.set('green', new GreenTextFormatter())
formatters.set('emote', new EmoteFormatter())
formatters.set('mentioned', new MentionedUserFormatter())

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
        .map(e => {
            const f = UserFeatures.valueOf(e);
            return <UserFlair name={e.toLowerCase()} title={f !== null ? f.label : e} />;
        });
    return features;
}

function buildTime(message) {
    const datetime = message.timestamp.format(DATE_FORMATS.FULL);
    const label = message.timestamp.format(DATE_FORMATS.TIME);
    return <Time title="${datetime}">${label}</Time>;
}

class EmoteFormatter {
    format(chat, msg, message=null) {
        if (!gemoteregex || !twitchemoteregex) {
            const emoticons = destinyEmotes.join('|');
            const twitchemotes = twitchEmotes.join('|');
            gemoteregex = new RegExp(`\b${emoticons}\b`);
            twitchemoteregex = new RegExp(`\b${twitchemotes}\b`);
        }
        //let regex = (message && message.user && message.user.hasFeature(UserFeatures.SUBSCRIBERT0)) || (!message || !message.user) ? twitchemoteregex : gemoteregex;
        let regex = gemoteregex;
        let result;
        let formatted = [];

        while ((result = regex.exec(msg)) !== null) {
            const before = msg.substring(0, result.index);

            if (before !== "") {
                formatted.push({ "string": before, "greenText": msg.greenText });
            }

            formatted.push({ "emote": result[0] });

            msg = msg.substring(result.index + result[0].length);
        }
        return formatted;
    }
}

class MentionedUserFormatter {

    format(chat, msg, message = null) {
        if (message && message.mentioned && message.mentioned.length > 0) {
            let formatted = [];
            
            for (let i = 0; i < msg.length; i++) {
                if (!('string' in msg[i])) {
                    formatted.push(msg[i]);
                    continue;
                }
                let regex = new RegExp(`\b${message.mentioned.join('|')}\b`)
                let result;
                let match = false;

                while ((result = regex.exec(msg[i])) !== null) {
                    match = true;
                    const before = msg[i].substring(0, result.index);

                    if (before !== "") {
                        formatted.push({string: before, greenText: msg.greenText});
                    }

                    formatted.push({ mention: result[0] });
                    msg[i] = msg[i].substring(result.index + result[0].length);
                }

                if (!match) {
                    formatted.push(msg[i]);
                }                    
            }
            return formatted;            
        }
        return msg;
    }
}

class GreenTextFormatter {

    format(chat, msg, message = null) {
        if (message.user && msg.indexOf('&gt;') === 0) {
            if (message.user.hasAnyFeatures(
                UserFeatures.SUBSCRIBER,
                UserFeatures.SUBSCRIBERT0,
                UserFeatures.SUBSCRIBERT1,
                UserFeatures.SUBSCRIBERT2,
                UserFeatures.SUBSCRIBERT3,
                UserFeatures.SUBSCRIBERT4,
                UserFeatures.NOTABLE,
                UserFeatures.TRUSTED,
                UserFeatures.CONTRIBUTOR,
                UserFeatures.COMPCHALLENGE,
                UserFeatures.ADMIN,
                UserFeatures.MODERATOR
            ))
                msg.greenText = true;
        } else {
            msg.greenText = false;
        }
        return msg;
    }

}

class UserFlair extends Component {
    getFeature() {
        if (this.props.name in icons) {
            return icons[this.props.name];
        }
    }
    render() {
        return (
            <Image style={styles.Flair} source={this.getFeature()} />
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
            <View style={{ flexDirection: 'row' }}>
                {features}
                <Text style={messageStyles}>{this.props.user.username}: </Text>
            </View>
        )
    }
}

class Emote extends Component {
    render() {
        return (
            <Image style={styles.Emote} source={emoteImgs.get(this.props.name)} />
        );
    }
}

export class MobileChatMessage extends Component {
    constructor(props) {
        super(props);
    }
    render() {

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
                {this.props.formatted}
            </View>
        );
    }
}

class MobileMessageBuilder {

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

    wrap(content, classes = [], attr = {}) {
        classes.push(this.classes);
        classes.unshift(`msg-${this.type.toLowerCase()}`);
        classes.unshift(`msg-chat`);
        attr['class'] = classes.join(' ');
        return $('<div></div>', attr).html(content)[0].outerHTML;
    }

    html(chat = null) {
        return this.wrap(this.message);
    }

    afterRender(chat = null) { }

}