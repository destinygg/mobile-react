"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const react_navigation_1 = require("react-navigation");
const styles_1 = __importDefault(require("styles"));
const { MobileChat } = require("../chat/chat");
class InitView extends react_1.Component {
    componentDidMount() {
        const { navigation } = this.props;
        if (MobileChat.current === undefined) {
            react_native_1.Alert.alert("Internal error.");
            return;
        }
        const meReq = new Request('https://www.destiny.gg/api/chat/me', {
            method: "GET",
            credentials: 'include'
        });
        const histReq = new Request("https://www.destiny.gg/api/chat/history");
        Promise.all([fetch(meReq), fetch(histReq)]).then((r) => __awaiter(this, void 0, void 0, function* () {
            const meRes = r[0];
            const histRes = r[1];
            if (meRes.ok) {
                const me = yield meRes.json();
                const hist = yield histRes.json();
                MobileChat.current
                    .withUserAndSettings(me)
                    .withHistory(hist)
                    .connect("wss://www.destiny.gg/ws");
                MobileChat.current.me = me;
                // @ts-ignore
                global.bugsnag.setUser(me.userId, me.username, me.username + '@destiny.gg');
                navigation.dispatch(react_navigation_1.NavigationActions.reset({
                    index: 0,
                    actions: [
                        react_navigation_1.NavigationActions.navigate({ routeName: 'MainNav' })
                    ]
                }));
            }
            else {
                navigation.dispatch(react_navigation_1.NavigationActions.reset({
                    index: 0,
                    actions: [
                        react_navigation_1.NavigationActions.navigate({ routeName: 'AuthView' })
                    ]
                }));
            }
        }), error => {
            react_native_1.Alert.alert('Network rejection', 'Check your network connection and retry.', [
                {
                    text: 'Retry', onPress: () => {
                        navigation.dispatch(react_navigation_1.NavigationActions.reset({
                            index: 0,
                            actions: [
                                react_navigation_1.NavigationActions.navigate({ routeName: 'InitView' })
                            ]
                        }));
                    }
                }
            ], { cancelable: false });
        });
    }
    render() {
        return (react_1.default.createElement(react_native_1.View, { style: styles_1.default.View }));
    }
}
exports.default = InitView;
