import React, { Component } from 'react';
import { View, TouchableHighlight } from 'react-native';
import styles from './styles.js';

export class ProfileListItem extends Component {
    render() {
        return (
            <TouchableHighlight onPress={this.props.onPress} style="styles.ProfileListItem">
                <View style="styles.ProfileListItemInner">
                    <Text style="styles.ProfileListItemText">
                        {this.props.itemText}
                    </Text>
                </View>
            </TouchableHighlight>
        )
    }
}

export class FormItem extends Component {
    render() {
        if (this.props.type === "text") {
            return (
                <TextInput
                    style={style.FormItem}
                    value={this.props.value}
                    placeholder={this.props.placeholder}
                />
            )
        } else if (this.props.type === "select") {
            return {

            }
        }
    }
}

export class ProfileForm extends Component {
    render() {
        return(
            <View style={styles.ProfileForm}></View>
        )
    }
}
