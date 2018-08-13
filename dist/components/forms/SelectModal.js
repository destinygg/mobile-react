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
class SelectModal extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = { shown: false, value: this.props.value };
    }
    _onSelect(name, value) {
        this.props.onSelect(name, value);
        this.hide();
    }
    show() {
        this.setState({ shown: true });
    }
    hide() {
        this.setState({ shown: false });
    }
    render() {
        const selectOptions = this.props.selectOptions.map((item) => react_1.default.createElement(react_native_1.Picker.Item, { label: item.name, value: item.value, key: item.value }));
        return (react_1.default.createElement(react_native_1.Modal, { animationType: 'slide', transparent: true, visible: this.state.shown, onRequestClose: () => this.hide() },
            react_1.default.createElement(react_native_1.View, { style: styles_1.default.SelectModalOuter },
                react_1.default.createElement(react_native_1.View, { style: styles_1.default.SelectModalInner },
                    react_1.default.createElement(react_native_1.View, { style: styles_1.default.SelectModalHeader },
                        react_1.default.createElement(react_native_1.Button, { onPress: () => this._onSelect(this.props.name, this.state.value), title: 'Done' })),
                    react_1.default.createElement(react_native_1.Picker, { selectedValue: this.state.value, onValueChange: (itemValue, itemIndex) => {
                            this.setState({ value: itemValue });
                        }, itemStyle: styles_1.default.text }, selectOptions)))));
    }
}
exports.default = SelectModal;
