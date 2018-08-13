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
const styles_1 = __importDefault(require("styles"));
const react_native_1 = require("react-native");
class ListSwitch extends react_1.Component {
    render() {
        let outerStyle = [styles_1.default.ListItemOuter];
        let innerStyle = [styles_1.default.ListItemInner];
        if (this.props.first) {
            outerStyle.push(styles_1.default.firstInList);
        }
        if (this.props.last) {
            outerStyle.push(styles_1.default.lastInList);
            innerStyle.push(styles_1.default.innerLastInList);
        }
        const displayName = this.props.tag !== undefined
            ? this.props.tag
            : this.props.name;
        return (react_1.default.createElement(react_native_1.View, { style: outerStyle },
            react_1.default.createElement(react_native_1.View, { style: [innerStyle, styles_1.default.ListSwitch] },
                react_1.default.createElement(react_native_1.Text, { style: styles_1.default.ListItemText }, displayName),
                react_1.default.createElement(react_native_1.Switch, { onValueChange: (value) => this.props.onChange(this.props.name, value), value: this.props.value }))));
    }
}
exports.default = ListSwitch;
