import EventEmitter from '../../lib/assets/chat/js/emitter';

export default class MobileWindow extends EventEmitter {
    constructor(name, type = '', label = '') {
        super()
        this.name = name
        this.label = label
        this.maxlines = 0
        this.tag = null
        this.lastmessage = null
        this.locks = 0
        this.visible = true;
        this.ui = ui;
        this.lines = [];
    }

    destroy() {
        this.lines = [];
        this.ui.sync();
        return this;
    }

    into(chat) {
        const normalized = this.name.toLowerCase()
        this.maxlines = chat.settings.get('maxlines')
        this.tag = chat.taggednicks.get(normalized) || tagcolors[Math.floor(Math.random() * tagcolors.length)]
        chat.addWindow(normalized, this)
        return this
    }

    locked() {
        return this.locks > 0;
    }

    lock() {
        this.locks++;
        if (this.locks === 1) {
            this.waspinned = this.ui.isPinned();
        }
    }

    unlock() {
        this.locks--;
        if (this.locks === 0) {
            this.ui.updateAndPin(this.waspinned);
        }
    }

    addMessage(chat, message) {
        message.ui = message.html(chat)
        message.afterRender(chat)
        this.lastmessage = message
        this.lines.push(message.ui);
        this.ui.sync(this.lines);
        this.cleanup()
    }

    getlines(sel) {
        return this.ui.getLines(sel);
    }

    removelines(sel) {
        this.ui.removeLines(sel);
    }

    // Rid excess chat lines if the chat is pinned
    // Get the scroll position before adding the new line / removing old lines
    cleanup() {
        if (this.ui.isPinned() || this.waspinned) {
            if (lines.length >= this.maxlines) {
                this.lines.slice(0, lines.length - this.maxlines);
                this.ui.sync();
            }
        }
    }

    updateAndPin(pin = true) {
        if (pin) {this.ui.pin();}
    }

}
