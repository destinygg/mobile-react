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
const styles_1 = __importDefault(require("../../styles"));
const FormItem_1 = require("./FormItem");
class ProfileForm extends react_1.Component {
    render() {
        const children = this.props.formItems.map((item, index, array) => react_1.default.createElement(FormItem_1.FormItem, { item: item, value: (this.props.formState !== undefined)
                ? this.props.formState[item.name]
                : undefined, key: item.name, first: index === 0, last: index === (array.length - 1), onChange: this.props.onChange }));
        return (react_1.default.createElement(react_native_1.View, { style: [styles_1.default.View, styles_1.default.List, { marginTop: 15 }] }, children));
    }
}
exports.ProfileForm = ProfileForm;
class FormSaveBtn extends react_1.Component {
    render() {
        return (react_1.default.createElement(react_native_1.View, { style: styles_1.default.navbarRight },
            react_1.default.createElement(react_native_1.Button, { title: 'Save', onPress: this.props.onSave })));
    }
}
class FormView extends react_1.Component {
    constructor(props) {
        super(props);
    }
    _onChange(name, value) {
        const newItems = Object.assign({}, this.state.items);
        newItems[name] = value;
        this.setState({ items: newItems });
    }
    save() {
        const formData = new FormData();
        for (let key in this.state.items) {
            formData.append(key, this.state.items[key]);
        }
        this.props.navigation.setParams({ isSaving: true });
        const req = new Request(`https://www.destiny.gg/${this.props.endpoint}`, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });
        fetch(req).then((response) => {
            if (response.ok) {
                this.props.navigation.goBack();
            }
            else {
                this.showFailAlert();
            }
            this.props.navigation.setParams({ isSaving: false });
        }).catch((error) => {
            this.showFailAlert();
            this.props.navigation.setParams({ isSaving: false });
        });
    }
    showFailAlert() {
        react_native_1.Alert.alert('Account update failed.', 'Please try again later.', [{ text: 'OK', onPress: () => this.props.navigation.goBack() }], { cancelable: false });
    }
    componentDidMount() {
        this.props.navigation.setParams({ saveHandler: () => this.save() });
    }
    render() {
        return (react_1.default.createElement(react_native_1.KeyboardAvoidingView, { behavior: 'padding', style: styles_1.default.View, keyboardVerticalOffset: (react_native_1.Platform.OS === 'android') ? -400 : 65 },
            react_1.default.createElement(react_native_1.ScrollView, { style: styles_1.default.View },
                react_1.default.createElement(ProfileForm, { formItems: this.props.formItems, onChange: this._onChange.bind(this) }))));
    }
}
FormView.navigationOptions = ({ navigation }) => {
    const { params, routeName } = navigation.state;
    return {
        title: routeName,
        headerRight: (params.isSaving) ?
            react_1.default.createElement(react_native_1.ActivityIndicator, null) :
            react_1.default.createElement(FormSaveBtn, { onSave: params.saveHandler ? params.saveHandler : () => null }),
        drawerLockMode: 'locked-closed'
    };
};
exports.default = FormView;
