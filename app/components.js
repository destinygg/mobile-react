import React, { Component } from 'react';
import { View, Text, TextInput, Picker, Modal, Button, TouchableHighlight, StyleSheet } from 'react-native';
import styles from './styles.js';

export class ProfileListItem extends Component {
    render() {
        return (
            <TouchableHighlight onPress={() => this.props.onPress()} style={[this.props.style, styles.ListItem]}>
                <Text style={styles.ListItemText}>
                    {this.props.text}
                </Text>
            </TouchableHighlight>
        )
    }
}

export class SelectModal extends Component {
    constructor(props) {
        super(props);
        this.state = { shown: false, value: this.props.value };
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
                transparent={ true } 
                visible={ this.state.shown } 
                onRequestClose= {() => this.hide() } 
            >
                <View style={ styles.SelectModalOuter }>
                    <View style={ styles.SelectModalInner }>
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
                            itemStyle={styles.text}
                        >
                            {selectOptions}
                        </Picker>
                    </View>
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
        let children = [];

        if (this.props.item.type === "text") {
            children.push(
                <TextInput
                    style={styles.FormItem}
                    value={this.state.value}
                    placeholder={this.props.item.placeholder}
                    placeholderTextColor={'#888'}
                    onChangeText={(text) => this.setState({ value: text })}
                    key={this.props.item.name}
                />
            )
        } else if (this.props.item.type === "select") {
            const displayText = this.props.item.selectOptions.filter((item) => {
                return item.value === this.state.value;
            });
            children.push(
                <ProfileListItem
                    text={displayText[0].name}
                    onPress={() => this.selectModal.show()}
                    key={this.props.item.name}                    
                />
            );
            children.push(
                <SelectModal
                    ref={(component) => this.selectModal = component}
                    selectOptions={this.props.item.selectOptions}
                    onSelect={(value) => this.setState({ value: value })}
                    value={this.state.value}
                    key={this.props.item.name + "Modal"}                    
                />
            );
        }

        if (this.props.item.spacer == true) { 
            children.push(<View style={{ height: 15 }} key={this.props.item.name + "After"} />);
        }

        return (
            <View>
                {children}
            </View>
        )
    }
}
