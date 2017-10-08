import React, { Component } from 'react';
import { View, Text, TextInput, Picker, Modal, Button, TouchableHighlight } from 'react-native';
import styles from './styles.js';

export class ProfileListItem extends Component {
    render() {
        return (
            <TouchableHighlight onPress={() => this.props.onPress()} style={styles.ProfileListItem}>
                <View style={styles.ProfileListItemInner}>
                    <Text style={styles.ProfileListItemText}>
                        {this.props.text}
                    </Text>
                </View>
            </TouchableHighlight>
        )
    }
}

export class SelectModal extends Component {
    constructor(props) {
        super(props);
        this.state = { shown: false, value: null };
    }

    _onSelect() {
        this.props.onSelect(this.state.value);
        this.setState({ shown: false });
    }

    show() {
        this.setState({ shown: true });
    }

    hide() {
        this.setState({ shown: false });
    }

    render() {
        const selectOptions = this.props.selectOptions.map((item) =>
            <Picker.Item label={item.name} value={item.value} key={item.value} />
        );
        return (
            <Modal 
                animationType='slide' 
                transparent={ false } 
                visible={ this.state.shown } 
                onRequestClose= {() => this.hide() } 
            >
                <View style={ styles.SelectModal }>
                    <View style={ styles.SelectModalHeader }>
                        <Button
                            onPress={()=> this._onSelect(this.props.value)}
                            title='Done'
                        />
                    </View>
                    <Picker
                        selectedValue={this.state.value}
                        onValueChange={(itemValue, itemIndex) => {
                            this.setState({ value: itemValue })
                        }}
                    >
                        {selectOptions}
                    </Picker>
                </View>
            </Modal>
        )
    }
}

export class FormItem extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            value: this.props.item.value 
        };
    }
    render() {
        if (this.props.item.type === "text") {
            return (
                <TextInput
                    style={styles.FormItem}
                    value={this.state.value}
                    placeholder={this.props.item.placeholder}
                    onChangeText={(text) => this.setState({ value: text })}
                />
            )
        } else if (this.props.item.type === "select") {
            const displayText = this.props.item.selectOptions.filter((item) => {
                return item.value === this.state.value;
            });
            return (
                <View>
                    <ProfileListItem
                        text={displayText[0].name}
                        onPress={() => this.selectModal.show()}
                    />
                    <SelectModal 
                        ref={(component) => this.selectModal = component }
                        selectOptions={this.props.item.selectOptions}
                        onSelect={(value) => this.setState({ value: value })}
                    />
                </View>
            )
        }
    }
}
