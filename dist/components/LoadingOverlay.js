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
class LoadingOverlay extends react_1.Component {
    render() {
        return (react_1.default.createElement(react_native_1.View, { style: { width: '100%', height: '100%', position: 'absolute', alignItems: 'center' } },
            react_1.default.createElement(react_native_1.View, { style: { marginTop: '40%', width: 110, height: 100, borderRadius: 10, backgroundColor: 'rgba(25,25,25,.5)', alignItems: 'center', justifyContent: 'center' } },
                react_1.default.createElement(react_native_1.ActivityIndicator, { size: 'large' }),
                react_1.default.createElement(react_native_1.Text, { style: { color: "#888", fontWeight: '500', marginTop: 15 } }, "Loading..."))));
    }
}
exports.LoadingOverlay = LoadingOverlay;