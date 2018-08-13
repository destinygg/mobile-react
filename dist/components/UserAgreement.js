"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
class UserAgreement extends react_1.Component {
    render() {
        return (react_1.default.createElement(react_native_1.WebView, { source: { uri: 'https://www.destiny.gg/agreement' } }));
    }
}
UserAgreement.navigationOptions = {
    title: 'User Agreement',
    drawerLockMode: 'locked-closed'
};
exports.UserAgreement = UserAgreement;
