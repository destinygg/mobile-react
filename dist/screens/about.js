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
const react_navigation_1 = require("react-navigation");
const styles_1 = __importStar(require("styles"));
class AboutView extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = { badgePressed: false };
    }
    _devBadgePress() {
        react_native_1.Linking.openURL('https://davidcako.com');
    }
    render() {
        const badgePressed = this.state.badgePressed;
        return (react_1.default.createElement(react_navigation_1.SafeAreaView, { style: styles_1.default.View },
            react_1.default.createElement(react_native_1.ScrollView, { style: { marginLeft: 15, marginRight: 15 } },
                react_1.default.createElement(react_native_1.View, null,
                    react_1.default.createElement(react_native_1.Text, { style: {
                            color: '#888',
                            fontSize: styles_1.h2,
                            fontWeight: '600',
                            marginTop: 15
                        } }, "License"),
                    react_1.default.createElement(react_native_1.Text, { style: {
                            color: '#888'
                        } }, "\"destiny.gg app\" is licensed as proprietary software. All intellectual property, source code, and \"destiny.gg\" media assets are the property of destiny.gg LLC.  3rd party content of any sort is property of the respective copyright owners.  destiny.gg LLC assumes no responsibility for members of its social features."),
                    react_1.default.createElement(react_native_1.Text, { style: styles_1.default.AboutHeader }, "Warranty"),
                    react_1.default.createElement(react_native_1.Text, { style: styles_1.default.AboutBody }, "No warranty express or implied is provided.  This software is provided \"as-is\"."),
                    react_1.default.createElement(react_native_1.TouchableHighlight, { style: {
                            backgroundColor: '#fff',
                            padding: 10,
                            borderRadius: 10,
                            width: 200,
                            alignSelf: 'center',
                            marginBottom: 25,
                            marginTop: 25,
                            marginRight: 10
                        }, onPressIn: () => this.setState({ badgePressed: true }), onPressOut: () => this.setState({ badgePressed: false }), delayPressOut: 100, onPress: () => this._devBadgePress() },
                        react_1.default.createElement(react_native_1.View, { style: {
                                borderWidth: 3,
                                padding: 15,
                                borderColor: (badgePressed) ? '#fff' : '#000'
                            } },
                            react_1.default.createElement(react_native_1.Text, { style: {
                                    fontSize: 36,
                                    fontWeight: '400',
                                    marginBottom: 10,
                                    color: (badgePressed) ? '#fff' : "#000"
                                } }, "cako.io"),
                            react_1.default.createElement(react_native_1.Text, { style: {
                                    fontWeight: '300',
                                    width: 100,
                                    color: (badgePressed) ? '#fff' : "#000"
                                } },
                                "Issues may be reported to ",
                                react_1.default.createElement(react_native_1.Text, { style: { color: '#d60000' } }, "dc@cako.io"),
                                "."))),
                    react_1.default.createElement(react_native_1.Text, { style: styles_1.default.AboutHeader }, "3rd party licenses"),
                    react_1.default.createElement(react_native_1.Text, { style: styles_1.default.AboutBody }, `BSD License

For React Native software

Copyright (c) 2015-present, Facebook, Inc. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
this list of conditions and the following disclaimer in the documentation
and/or other materials provided with the distribution.

* Neither the name Facebook nor the names of its contributors may be used to
endorse or promote products derived from this software without specific
prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
                        `),
                    react_1.default.createElement(react_native_1.Text, { style: styles_1.default.AboutBody }, `
Ionicons is licensed under the MIT license.

The MIT License (MIT)

Copyright (c) 2016 Drifty (http://drifty.com/)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
                        `)))));
    }
}
AboutView.navigationOptions = {
    title: 'About'
};
exports.default = AboutView;