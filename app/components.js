import React, { Component } from 'react';
import { View, Text, Picker, TouchableHighlight } from 'react-native';
import styles from './styles.js';

export class ProfileListItem extends Component {
    _onPress() {
        this.props.onPress(this.props.itemTarget);
    }
    render() {
        return (
            <TouchableHighlight onPress={this._onPress.bind(this)} style={styles.ProfileListItem}>
                <View style={styles.ProfileListItemInner}>
                    <Text style={styles.ProfileListItemText}>
                        {this.props.itemText}
                    </Text>
                </View>
            </TouchableHighlight>
        )
    }
}

export class FormItem extends Component {
    render() {
        const selectOptions = this.selectOptions.map((item) => {
            <Picker.Item label={item.itemName} value={item.itemValue} />
        });
        if (this.props.type === "text") {
            return (
                <TextInput
                    style={style.FormItem}
                    value={this.props.value}
                    placeholder={this.props.placeholder}
                    onChangeText={(text) => this.setState({ value: text })}
                />
            )
        } else if (this.props.type === "select") {
            return (
                <Picker
                    selectedValue={this.props.value}
                    onValueChange={(itemValue, itemIndex) => 
                        this.setState({ value: itemValue })}
                >
                    {selectOptions}
                </Picker>
            )
        }
    }
}
