"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const styles_1 = __importDefault(require("./styles"));
const { UserFeatures } = require('../../lib/assets/chat/js/features');
const { EmoteFormatter, GreenTextFormatter, UrlFormatter } = require('./formatters');
const { emoteImgs, icons } = require('./images');
exports.MessageTypes = {
    STATUS: 'STATUS',
    ERROR: 'ERROR',
    INFO: 'INFO',
    COMMAND: 'COMMAND',
    BROADCAST: 'BROADCAST',
    UI: 'UI',
    CHAT: 'CHAT',
    USER: 'USER',
    EMOTE: 'EMOTE'
};
const formatters = new Map();
formatters.set('green', new GreenTextFormatter());
formatters.set('emote', new EmoteFormatter());
formatters.set('url', new UrlFormatter());
//formatters.set('mentioned', new MentionedUserFormatter())
/* Chat elements do not use Views so as to use Text's inline-block-style layout.
   This means that elements may have spaces hard-coded, as Text does not allow
   for much layout control. */
class UserFlair extends react_1.Component {
    getFeature() {
        if (this.props.name in icons) {
            return icons[this.props.name];
        }
        else {
            return null;
        }
    }
    render() {
        const feature = this.getFeature();
        if (feature !== null) {
            return (react_1.default.createElement(react_native_1.Image, { style: styles_1.default.Flair, source: feature }));
        }
        else {
            return null;
        }
    }
}
exports.UserFlair = UserFlair;
class Time extends react_1.Component {
    render() {
        return (react_1.default.createElement(react_native_1.Text, { style: styles_1.default.Time },
            this.props.children,
            " "));
    }
}
exports.Time = Time;
class UserBadge extends react_1.Component {
    constructor(props) {
        super(props);
        this.style = [styles_1.default.UserBadge];
        let admin = false;
        for (let i = 0; i < this.props.user.features.length; i++) {
            if (this.props.user.features[i] == UserFeatures.ADMIN) {
                admin = true;
            }
            else {
                this.style.push(styles_1.default[this.props.user.features[i]]);
            }
        }
        if (admin)
            this.style.push(styles_1.default['admin']);
    }
    render() {
        return (react_1.default.createElement(react_native_1.Text, { onPress: () => this.props.onPress(this.props.user.username) },
            this.props.children,
            react_1.default.createElement(react_native_1.Text, { key: 'userBadgeText', style: this.style }, this.props.user.username)));
    }
}
exports.UserBadge = UserBadge;
class Emote extends react_1.Component {
    constructor() {
        super(...arguments);
        this.image = null;
        this.setNativeProps = (nativeProps) => {
            this.image && this.image.setNativeProps(nativeProps);
        };
    }
    render() {
        const emoteStyle = (this.props.emoteMenu) ? styles_1.default.EmoteMenuItem : styles_1.default.Emote;
        return (react_1.default.createElement(react_native_1.Image, { style: emoteStyle, source: emoteImgs.get(this.props.name), ref: ref => this.image = ref }));
    }
}
exports.Emote = Emote;
class MsgText extends react_1.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let msgStyles = [styles_1.default.MsgText];
        if (this.props.greenText) {
            msgStyles.push(styles_1.default.greenText);
        }
        if (this.props.link) {
            msgStyles.push(styles_1.default.Link);
        }
        if (this.props.link) {
            return (react_1.default.createElement(react_native_1.Text, { onPress: () => {
                    if (this.props.emit) {
                        this.props.emit.openLink(this.props.link);
                    }
                }, style: msgStyles }, this.props.link + ' '));
        }
        else {
            return (react_1.default.createElement(react_native_1.Text, { style: msgStyles }, this.props.children));
        }
    }
}
class MobileChatMessage extends react_1.PureComponent {
    constructor(props) {
        super(props);
        this.formatted = [];
        for (let i = 0; i < this.props.text.length; i++) {
            if ('string' in this.props.text[i]) {
                this.formatted.push(react_1.default.createElement(MsgText, { key: i, greenText: this.props.text[i].greenText }, this.props.text[i].string));
                continue;
            }
            else if ('emote' in this.props.text[i]) {
                this.formatted.push(react_1.default.createElement(Emote, { key: i, name: this.props.text[i].emote }));
                continue;
            }
            else if ('url' in this.props.text[i]) {
                this.formatted.push(react_1.default.createElement(MsgText, { key: i, link: this.props.text[i].url, emit: this.props.msg.window }));
            }
        }
    }
    render() {
        return (react_1.default.createElement(react_native_1.Text, { style: this.props.msg.classes, onLayout: (e) => {
                this.props.msg.height = e.nativeEvent.layout.height;
            } },
            this.props.time,
            this.props.user,
            react_1.default.createElement(react_native_1.Text, null, this.props.ctrl),
            this.formatted));
    }
}
exports.MobileChatMessage = MobileChatMessage;
class MobileChatEmoteMessage extends react_1.PureComponent {
    constructor(props) {
        super(props);
        this.state = { combo: this.props.count };
    }
    render() {
        let combo = [];
        if (this.state.combo > 1) {
            combo.push(react_1.default.createElement(react_native_1.Text, { key: 'ComboCount', style: [this.state.comboClass, styles_1.default.ComboCount] }, this.state.combo));
            combo.push(react_1.default.createElement(react_native_1.Text, { key: 'ComboX', style: [this.state.comboClass, styles_1.default.ComboX] }, "x"));
            combo.push(react_1.default.createElement(react_native_1.Text, { key: 'ComboCombo', style: styles_1.default.ComboCombo }, " C-C-C-COMBO"));
        }
        return (react_1.default.createElement(react_native_1.Text, { onLayout: (e) => {
                this.props.msg.height = e.nativeEvent.layout.height;
            } },
            this.props.time,
            this.props.emote,
            combo));
    }
}
exports.MobileChatEmoteMessage = MobileChatEmoteMessage;
