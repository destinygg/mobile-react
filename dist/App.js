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
const navigation_1 = __importDefault(require("navigation"));
const { MobileChat } = require('./chat/chat');
const styles_1 = __importDefault(require("styles"));
const emotes = require('./lib/assets/emotes.json');
class App extends react_1.Component {
    constructor(props) {
        super(props);
        if (!this.chat) {
            this.chat = new MobileChat()
                .withEmotes(emotes);
        }
        this.state = {};
    }
    render() {
        return (react_1.default.createElement(react_native_1.View, { style: styles_1.default.View },
            react_1.default.createElement(react_native_1.StatusBar, { barStyle: 'light-content' }),
            react_1.default.createElement(navigation_1.default, { onNavigationStateChange: (prevState, currentState) => {
                    const currentScreen = currentState.routes[currentState.index].routeName;
                    const prevScreen = prevState.routes[prevState.index].routeName;
                    if (prevScreen !== currentScreen) {
                        this.setState({ navState: currentScreen });
                    }
                }, screenProps: { init: true, navState: this.state.navState } })));
    }
}
exports.default = App;
