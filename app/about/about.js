import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableHighlight, Linking } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import styles from './styles';

export default class AboutView extends Component {
    static navigationOptions = {
        title: 'About'
    }

    constructor(props) {
        super(props);
        this.state = {badgePressed: false};
    }

    _devBadgePress() {
        Linking.openURL('https://davidcako.com');
    }

    render() {
        const badgePressed = this.state.badgePressed;
        return (
            <SafeAreaView style={styles.View}>
                <ScrollView 
                    style={{marginLeft: 15, marginRight: 15}}
                >
                    <View>
                        <Text style={styles.AboutHeader}>License</Text>                    
                        <Text style={styles.AboutBody}>
                            "destiny.gg app" is licensed as proprietary software.
                            All intellectual property, source code, and "destiny.gg" media assets
                            are the property of destiny.gg LLC.  3rd party content of any sort
                            is property of the respective copyright owners.  destiny.gg LLC
                            assumes no responsibility for members of its social features. 
                        </Text>
                        <Text style={styles.AboutHeader}>Warranty</Text>
                        <Text style={styles.AboutBody}>
                            No warranty express or implied is provided.  This software
                            is provided "as-is".
                        </Text>
                    </View>
                    <TouchableHighlight style={styles.AboutDev} 
                        onPressIn={() => this.setState({badgePressed: true})}
                        onPressOut={() => this.setState({badgePressed: false})}
                        delayPressOut={100}
                        onPress={() => this._devBadgePress()}
                    >
                        <View style={[styles.AboutDevInner, (badgePressed) ? styles.badgePressedBorder : null]}>
                            <Text style={[styles.AboutDevHeader, (badgePressed) ? styles.badgePressed : null]}>cako.io</Text>                    
                            <Text style={[styles.AboutDevBody, (badgePressed) ? styles.badgePressed : null]}>
                                Issues may be reported to <Text style={{color: '#d60000'}}>dc@cako.io</Text>.
                            </Text>
                        </View>
                    </TouchableHighlight>
                </ScrollView>
            </SafeAreaView>
        )
    }
}