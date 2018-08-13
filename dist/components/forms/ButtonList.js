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
const styles_1 = __importDefault(require("styles"));
class ListButton extends react_1.Component {
    render() {
        const outerStyle = [styles_1.default.ListItemOuter];
        const innerStyle = [styles_1.default.ListItemInner];
        if (this.props.first) {
            outerStyle.push(styles_1.default.firstInList);
        }
        if (this.props.last) {
            outerStyle.push(styles_1.default.lastInList);
            innerStyle.push(styles_1.default.innerLastInList);
        }
        if (this.props.style) {
            outerStyle.push(this.props.style);
        }
        const displayName = this.props.tag !== undefined
            ? this.props.tag
            : this.props.name;
        return (react_1.default.createElement(react_native_1.TouchableHighlight, { onPress: this.props.onPress, style: outerStyle },
            react_1.default.createElement(react_native_1.View, { style: innerStyle },
                react_1.default.createElement(react_native_1.Text, { style: styles_1.default.ListItemText }, displayName))));
    }
}
exports.ListButton = ListButton;
class ButtonList extends react_1.Component {
    render() {
        const children = this.props.listItems.map((item, index, array) => {
            return (react_1.default.createElement(ListButton, { name: item.name, onPress: item.onPress, key: index, first: index === 0, last: index === (array.length - 1), style: item.style }));
        });
        return (react_1.default.createElement(react_native_1.View, { style: styles_1.default.List }, children));
    }
}
exports.default = ButtonList;
