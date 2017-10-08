import React, { Component } from 'react';
import { View, Text, TextInput, Picker, TouchableHighlight } from 'react-native';
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
    constructor(props) {
        super(props);
        this.state = { value: this.props.value };
    }
    render() {
        if (this.props.type === "text") {
            return (
                <TextInput
                    style={styles.FormItem}
                    value={this.props.value}
                    placeholder={this.props.placeholder}
                    onChangeText={(text) => this.setState({ value: text })}
                />
            )
        } else if (this.props.type === "select") {
            const selectOptions = this.props.selectOptions.map((item) =>
                <Picker.Item label={item.itemName} value={item.itemValue} key={item.itemValue} />
            );
            return (
                <View>
                    <Text>Test</Text>
                    <Picker
                        selectedValue={this.state.value}
                        onValueChange={(itemValue, itemIndex) => {
                            this.setState({ value: itemValue })
                        }}
                    >
                        {selectOptions}
                    </Picker>
                </View>
            )
        }
    }
}
