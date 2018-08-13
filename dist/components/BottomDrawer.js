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
const react_native_interactable_1 = __importDefault(require("react-native-interactable"));
const styles_1 = __importDefault(require("styles"));
class BottomDrawer extends react_1.Component {
    constructor(props) {
        super(props);
        this.interactable = null;
        this.scrollViewHeight = 500;
        this.state = { onTop: false, open: false, fixed: false };
        this.open = false;
        this.scrollY = this.props.posSpy;
        this.handleTopBinding = this.scrollY.interpolate({
            inputRange: [
                0,
                265
            ],
            outputRange: [0, 10]
        });
        this.handleWidthBinding = this.scrollY.interpolate({
            inputRange: [
                0,
                265
            ],
            outputRange: [0.6, 1]
        });
        this.opacityBinding = this.scrollY.interpolate({
            inputRange: [
                0,
                265
            ],
            outputRange: [0.4, 1]
        });
    }
    openDrawer() {
        if (this.interactable !== null) {
            this.setState({ open: true });
            this.interactable.snapTo({ index: 1 });
        }
        this.props.onOpen();
    }
    closeDrawer() {
        if (this.interactable !== null) {
            this.interactable.snapTo({ index: 0 });
            setTimeout(() => this.setState({ open: false }), 200);
        }
        this.props.onClose();
    }
    toTop() {
        this.setState({ fixed: true });
    }
    toBottom() {
        this.setState({ fixed: false });
    }
    render() {
        return (react_1.default.createElement(react_native_1.KeyboardAvoidingView, { style: Object.assign({
                top: -(this.props.paddingHeight),
                zIndex: 6000
            }, this.props.style), behavior: 'position' },
            react_1.default.createElement(react_native_interactable_1.default.View, { verticalOnly: true, snapPoints: [{ y: 0, tension: 0, damping: 1 }, { y: 265, tension: 0, damping: 1 }], style: {
                    height: this.scrollViewHeight,
                    width: '100%',
                }, dragEnabled: !this.state.fixed, animatedValueY: this.props.posSpy, ref: r => this.interactable = r, onSnap: (e) => {
                    if (e.nativeEvent.index === 1) {
                        this.setState({ open: true });
                        this.props.onOpen();
                    }
                    else if (e.nativeEvent.index === 0) {
                        this.setState({ open: false });
                        this.props.onClose();
                    }
                } },
                react_1.default.createElement(react_native_1.TouchableWithoutFeedback, { onPress: () => react_native_1.Keyboard.dismiss() },
                    react_1.default.createElement(react_native_1.View, { style: { height: this.props.paddingHeight } })),
                this.props.showHandle &&
                    react_1.default.createElement(react_native_1.Animated.View, { style: [
                            styles_1.default.DrawerHandle,
                            {
                                opacity: this.opacityBinding,
                                transform: [
                                    {
                                        translateY: this.handleTopBinding,
                                    },
                                    {
                                        scaleX: this.handleWidthBinding
                                    },
                                ]
                            }
                        ] }),
                this.props.children)));
    }
}
exports.BottomDrawer = BottomDrawer;
