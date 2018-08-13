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
const ButtonList_1 = require("./ButtonList");
const SelectModal_1 = __importDefault(require("./SelectModal"));
const ListSwitch_1 = __importDefault(require("./ListSwitch"));
const TextInputListItem_1 = __importDefault(require("./TextInputListItem"));
class FormItem extends react_1.Component {
    constructor() {
        super(...arguments);
        this.selectModal = null;
    }
    render() {
        let children = [];
        if (this.props.item.type === "text") {
            children.push(react_1.default.createElement(TextInputListItem_1.default, { name: this.props.item.name, value: this.props.value, readOnly: this.props.item.readOnly, placeholder: this.props.item.placeholder, onChange: (name, value) => this.props.onChange(name, value), key: this.props.item.name, first: this.props.first, last: this.props.last, multiline: this.props.item.multiline, maxLength: this.props.item.maxLength }));
        }
        else if (this.props.item.type === "select") {
            // @ts-ignore
            global.bugsnag.leaveBreadcrumb("Getting display text for country: " + this.props.value);
            const displayText = this.props.item.selectOptions.filter((item) => {
                return item.value === this.props.value;
            });
            children.push(react_1.default.createElement(ButtonList_1.ListButton, { name: displayText[0].name, tag: this.props.item.tag, onPress: () => this.selectModal && this.selectModal.show(), key: this.props.item.name, first: this.props.first, last: this.props.last }));
            children.push(react_1.default.createElement(SelectModal_1.default, { name: this.props.item.name, ref: (component) => this.selectModal = component, selectOptions: this.props.item.selectOptions, onSelect: this.props.onChange, value: this.props.value, key: this.props.item.name + "Modal" }));
        }
        else if (this.props.item.type == "switch") {
            children.push(react_1.default.createElement(ListSwitch_1.default, { name: this.props.item.name, tag: this.props.item.tag, value: this.props.value, onChange: this.props.onChange, key: this.props.item.name, first: this.props.first, last: this.props.last }));
        }
        if (this.props.item.spacer == true) {
            children.push(react_1.default.createElement(react_native_1.View, { style: { height: 15 }, key: this.props.item.name + "After" }));
        }
        return (react_1.default.createElement(react_native_1.View, null, children));
    }
}
exports.FormItem = FormItem;
