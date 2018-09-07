import React, { Component } from 'react';
import { ScrollView, View, Text, Linking, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Palette, h2 } from 'assets/constants';

export default class AboutView extends Component<{}, {badgePressed: boolean}> {
    static navigationOptions = {
        title: 'About'
    }

    constructor(props: any) {
        super(props);
        this.state = {badgePressed: false};
    }

    _devBadgePress() {
        Linking.openURL('https://davidcako.com');
    }

    render() {
        const badgePressed = this.state.badgePressed;
        return (
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: Palette.background
            }}>
                <ScrollView 
                    style={{marginLeft: 15, marginRight: 15}}
                >
                    <View>
                        <Text style={{
                                color: Palette.text,
                                fontSize: h2,
                                fontWeight: '600',
                                marginTop: 15
                        }}>
                            License
                        </Text>                    
                        <Text style={{
                            color: Palette.text
                        }}>
                            "destiny.gg app" is licensed as proprietary software.
                            All intellectual property, source code, and "destiny.gg" media assets
                            are the property of destiny.gg LLC.  3rd party content of any sort
                            is property of the respective copyright owners.  destiny.gg LLC
                            assumes no responsibility for members of its social features. 
                        </Text>
                        <Text style={{
                            color: Palette.text,
                            fontSize: h2,
                            fontWeight: '600',
                            marginTop: 15
                        }}>
                            Warranty
                        </Text>
                        <Text style={{
                            color: Palette.text
                        }}>
                            No warranty express or implied is provided.  This software
                            is provided "as-is".
                        </Text>
                        <TouchableOpacity style={{
                            backgroundColor: '#fff',
                            padding: 10,
                            borderRadius: 10,
                            width: 200,
                            alignSelf: 'center',
                            marginBottom: 25,
                            marginTop: 25,
                            marginRight: 10
                        }}
                            onPressIn={() => this.setState({ badgePressed: true })}
                            onPressOut={() => this.setState({ badgePressed: false })}
                            delayPressOut={100}
                            onPress={() => this._devBadgePress()}
                        >
                            <View style={{
                                borderWidth: 3,
                                padding: 15,
                                borderColor: (badgePressed) ? '#fff': '#000'   
                            }}>
                                <Text style={{
                                    fontSize: 36,
                                    fontWeight: '400',
                                    marginBottom: 10,
                                    color: (badgePressed) ? '#fff' : "#000"   
                                }}>
                                    cako.io
                                </Text>
                                <Text style={{
                                    fontWeight: '300',
                                    width: 100,
                                    color: (badgePressed) ? '#fff' : "#000"   
                                }}>
                                    Issues may be reported to 
                                    <Text style={{ color: '#d60000' }}>
                                        dc@cako.io
                                    </Text>.
                            </Text>
                            </View>
                        </TouchableOpacity>
                        <Text style={{
                                color: Palette.text,
                                fontSize: h2,
                                fontWeight: '600',
                                marginTop: 15
                        }}>
                            3rd party licenses
                        </Text>
                        <Text style={{
                            color: Palette.text
                        }}>{`BSD License

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
                        `}</Text>
                        <Text style={{
                            color: Palette.text
                        }}>{`
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
                        `}</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}