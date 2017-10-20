import Chat from '../../lib/assets/chat/js/chat';
import MobileWindow from './window';

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

/* Subclass reimplementing all methods using jQuery. */
export class MobileChat extends Chat {
    constructor() {
        super();
        this.mainwindow = new MobileWindow('main').into(this);
    }

    censor(nick) {
        const c = this.mainwindow.getlines(nick.toLowerCase());

        for (let i = 0; i < c.length; i++) {
            if (this.settings.get('showremoved')) {                
                c[i].addClass('msg-censored');
            } else {
                this.mainwindow.lines.splice(this.mainwindow.lines.indexOf(c[i]), 1);
            }
        }
        this.mainwindow.ui.sync();
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

    removeMessageByNick(nick) {
        this.mainwindow.removelines(nick.toLowerCase);
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

    cmdTAG(parts) {
        if (parts.length === 0) {
            if (this.taggednicks.size > 0) {
                MessageBuilder.info(`Tagged nicks: ${[...this.taggednicks.keys()].join(',')}. Available colors: ${tagcolors.join(',')}`).into(this);
            } else {
                MessageBuilder.info(`No tagged nicks. Available colors: ${tagcolors.join(',')}`).into(this);
            }
            return;
        }
        if (!nickregex.test(parts[0])) {
            MessageBuilder.error('Invalid nick - /tag <nick> <color>').into(this);
            return;
        }
        const n = parts[0].toLowerCase();
        if (n === this.user.username.toLowerCase()) {
            MessageBuilder.error('Cannot tag yourself').into(this);
            return;
        }
        const color = parts[1] && tagcolors.indexOf(parts[1]) !== -1 ? parts[1] : tagcolors[Math.floor(Math.random() * tagcolors.length)];
        const lines = this.mainwindow.getlines(n);

        for (let i = 0; i < lines.length; i++) {
            lines[i].removeClass(Chat.removeClasses('msg-tagged'))
                    .addClass(`msg-tagged msg-tagged-${color}`);
        }
        this.taggednicks.set(n, color);
        MessageBuilder.info(`Tagged ${this.user.username} as ${color}`).into(this);

        this.settings.set('taggednicks', [...this.taggednicks]);
        this.applySettings();
    }

    cmdUNTAG(parts) {
        if (parts.length === 0) {
            if (this.taggednicks.size > 0) {
                MessageBuilder.info(`Tagged nicks: ${[...this.taggednicks.keys()].join(',')}. Available colors: ${tagcolors.join(',')}`).into(this);
            } else {
                MessageBuilder.info(`No tagged nicks. Available colors: ${tagcolors.join(',')}`).into(this);
            }
            return;
        }
        if (!nickregex.test(parts[0])) {
            MessageBuilder.error('Invalid nick - /untag <nick> <color>').into(this);
            return;
        }
        const n = parts[0].toLowerCase();
        this.taggednicks.delete(n);
        const lines = this.mainwindow.getlines(n);
        
        for (let i = 0; i < lines.length; i++) {
            lines[i].removeClass(Chat.removeClasses('msg-tagged'));
        }
        MessageBuilder.info(`Un-tagged ${n}`).into(this);
        this.settings.set('taggednicks', [...this.taggednicks]);
        this.applySettings();
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
    redrawWindowIndicators() {}
}