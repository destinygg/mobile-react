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
class TextInputListItem extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = { value: this.props.value };
    }
    render() {
        let outerStyle = [styles_1.default.ListItemOuter];
        let innerStyle = [styles_1.default.FormItem];
        if (this.props.first) {
            outerStyle.push(styles_1.default.firstInList);
        }
        if (this.props.last) {
            outerStyle.push(styles_1.default.lastInList);
            innerStyle.push(styles_1.default.innerLastInList);
        }
        if (this.props.readOnly) {
            innerStyle.push(styles_1.default.FormItemDisabled);
        }
        if (this.props.multiline) {
            innerStyle.push({ minHeight: 100 });
        }
        return (react_1.default.createElement(react_native_1.View, { style: outerStyle },
            react_1.default.createElement(react_native_1.TextInput, { style: innerStyle, value: this.props.value, placeholder: this.props.placeholder, placeholderTextColor: '#888', editable: (this.props.readOnly) === true ? false : true, onChangeText: (value) => {
                    this.setState({ value: value });
                    this.props.onChange && this.props.onChange(this.props.name, value);
                }, underlineColorAndroid: '#222', multiline: this.props.multiline, keyboardAppearance: 'dark', maxLength: this.props.maxLength })));
    }
}
exports.default = TextInputListItem;
