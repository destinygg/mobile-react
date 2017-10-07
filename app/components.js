import React, { Component } from 'react';
import { View, TouchableHighlight } from 'react-native';
import styles from './styles.js';

export class ProfileListItem extends Component {
    render() {
        <TouchableHighlight onPress={this.props.onPress} style="styles.ProfileListItem">
            <View style="styles.ProfileListItemInner">
                <Text style="styles.ProfileListItemText">
                    {this.props.itemText}
                </Text>
            </View>
        </TouchableHighlight>
    }
}

export class FormItem extends Component {
    render() {

    }
}
