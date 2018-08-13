"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ButtonList_1 = __importDefault(require("./forms/ButtonList"));
const react_2 = __importDefault(require("react"));
const react_native_1 = require("react-native");
class CardDrawerNavList extends react_1.PureComponent {
    constructor(props) {
        super(props);
        this.routes = [
            {
                name: 'Stream',
                onPress: () => {
                    if (this.props.onShowStream) {
                        this.props.onShowStream();
                    }
                },
                style: { backgroundColor: "#151515" }
            },
            {
                name: 'Chat',
                onPress: () => {
                    if (this.props.onHideStream) {
                        this.props.onHideStream();
                    }
                },
                style: { backgroundColor: "#151515" }
            },
            {
                name: 'Messages',
                onPress: () => {
                    this.props.navigation.navigate('MessageView', { backHandler: this.props.navigation.goBack });
                },
                style: { backgroundColor: "#151515" }
            }
        ];
        if (react_native_1.Platform.OS != 'ios') {
            this.routes.push({
                name: 'Donate',
                onPress: () => this.props.navigation.navigate('DonateView', { backHandler: this.props.navigation.goBack }),
                style: { backgroundColor: "#151515" }
            });
        }
        this.routes.push({
            name: 'Profile',
            onPress: () => this.props.navigation.navigate('ProfileView', { backHandler: this.props.navigation.goBack }),
            style: { backgroundColor: "#151515" }
        });
    }
    render() {
        return (react_2.default.createElement(react_native_1.View, { style: {
                backgroundColor: '#151515',
                paddingBottom: 100,
                paddingTop: 10,
                marginTop: -5
            } },
            react_2.default.createElement(ButtonList_1.default, { listItems: this.routes })));
    }
}
exports.default = CardDrawerNavList;
