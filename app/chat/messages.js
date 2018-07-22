import { MobileChat } from './chat';

const { DATE_FORMATS } = require('../../lib/assets/chat/js/const');

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
            return <UserFlair name={e.toLowerCase()} title={f !== null ? f.label : e} key={index} />;
        });
    return features;
}

function buildTime(message) {
    const datetime = message.timestamp.format(DATE_FORMATS.FULL);
    const label = message.timestamp.format(DATE_FORMATS.TIME);
    return <Time>{label}</Time>;
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
        this.window = chat.mainwindow;
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
            key={this.window.getMessageKey()}
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
        const time = (MobileChat.current.mobileSettings.chatTimestamp)
            ? buildTime(this)
            : undefined;

        if (this.continued)
            this.classes.push(styles['msg-continue']);
        return this.wrap(
            time, null, null, buildMessageTxt(chat, this)
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
        if (this.message.indexOf(chat.me.username) != -1)
            this.classes.push(styles.mention)

        let ctrl = <MsgText>: </MsgText>;
        if (this.target)
            ctrl = <MsgText> whispered you ... </MsgText>;
        else if (this.slashme)
            ctrl = null;
        else if (this.continued)
            ctrl = <MsgText>> </MsgText>;

        const user = (this.continued) ?
            null :
            <UserBadge user={this.user} onPress={(username) => this.window.appendInputText(username)}>{buildFeatures(this.user)}</UserBadge>;

        const time = (MobileChat.current.mobileSettings.chatTimestamp)
            ? buildTime(this)
            : undefined;

        return this.wrap(
            time, user, ctrl, buildMessageTxt(chat, this)
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
    if (message.ui && message.ui.setState) {
        message.ui.setState({ comboClass: stepClass });
    }
}
const ChatEmoteMessageCountThrottle = throttle(63, ChatEmoteMessageCount)

class ChatEmoteMessage extends ChatMessage {

    constructor(emote, timestamp, count = 1) {
        super(emote, timestamp, MessageTypes.EMOTE)
        this.emotecount = count
    }

    html(chat = null) {
        this._text = formatters.get('emote').format(chat, this.message, this);
        const emote = <Emote name={this._text[0].emote} />;
        this.classes.unshift(styles[`msg-${this.type.toLowerCase()}`]);
        this.classes.unshift(styles[`msg-chat`]);

        const time = (MobileChat.current.mobileSettings.chatTimestamp)
            ? buildTime(this)
            : undefined;
            
        this.uiElem = <MobileChatEmoteMessage
            time={time}
            msg={this}
            emote={emote}
            ref={ref => this.ui = ref}
            key={this.window.getMessageKey()}
            count={this.emotecount}
        />
        return this.uiElem;
    }

    afterRender(chat = null) {
        if (this.ui && this.ui.setState) {
            this.ui.setState({ combo: this.emotecount });
        }
    }

    incEmoteCount() {
        ++this.emotecount
        if (this.ui && this.ui.setState) {
            this.ui.setState({ combo: this.emotecount });
        }
        ChatEmoteMessageCountThrottle(this)
    }

    completeCombo() {
        ChatEmoteMessageCount(this)
    }

}