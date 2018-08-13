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
const ButtonList_1 = require("./forms/ButtonList");
const react_native_1 = require("react-native");
const styles_1 = __importDefault(require("../styles"));
class NavList extends react_1.Component {
    render() {
        const children = this.props.listItems.map((item, index, array) => {
            return (react_1.default.createElement(ButtonList_1.ListButton, { name: item.name, onPress: () => this.props.onPress(item), key: index, first: index === 0, last: index === (array.length - 1) }));
        });
        return (react_1.default.createElement(react_native_1.View, { style: styles_1.default.List }, children));
    }
}
exports.NavList = NavList;
