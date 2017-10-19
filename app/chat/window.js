import EventEmitter from '../../lib/assets/chat/js/emitter';

export default class MobileWindow extends EventEmitter {
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
