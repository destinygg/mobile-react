import React, { Component } from 'react';
import { View, Text, TextInput, Picker, Modal, Button, TouchableHighlight, StyleSheet } from 'react-native';
import styles from './styles';

export class ListButton extends Component {
    render() {
        let outerStyle = [styles.ListItemOuter];
        let innerStyle = [styles.ListItemInner];

        if (this.props.first) { 
            outerStyle.push(styles.firstInList); 
        }

        if (this.props.last) { 
            outerStyle.push(styles.lastInList); 
            innerStyle.push(styles.innerLastInList); 
        }

        return (
            <TouchableHighlight onPress={() => this.props.onPress()} style={outerStyle}>
                <View style={innerStyle}>
                    <Text style={styles.ListItemText}>
                        {this.props.text}
                    </Text>
                </View>
            </TouchableHighlight>
        )
    }
}

export class TextInputListItem extends Component {
    constructor(props) {
        super(props);
        this.state = { value: this.props.value };
    }
    render() {
        let outerStyle = [styles.ListItemOuter];
        let innerStyle = [styles.FormItem];

        if (this.props.first) {
            outerStyle.push(styles.firstInList);
        }

        if (this.props.last) {
            outerStyle.push(styles.lastInList);
            innerStyle.push(styles.innerLastInList);
        }

        return (
            <View style={outerStyle}>
                <TextInput
                    style={innerStyle}
                    value={this.state.value}
                    placeholder={this.props.placeholder}
                    placeholderTextColor={'#888'}
                    onChangeText={(value) => {
                        this.setState({ value: value });
                        this.props.onChange(this.props.name, value);
                    }}
                    underlineColorAndroid='#222'
                />
            </View>
        )
    }
}

export class ButtonList extends Component {
    render() {
        const children = this.props.listItems.map((item, index, array) => {
            return (
                <NavListItem
                    text={item.itemText}
                    onPress={() => item.itemTarget()}
                    key={index}
                    first={index === 0}
                    last={index === (array.length - 1)}
                />
            );
        });

        return (
            <View style={styles.List}>
                {children}
            </View>
        )
    }
}

export class NavList extends ButtonList {
    _onPressItem(itemTarget) {
        this.props.navigation.navigate(itemTarget);
    }
    render() {
        const children = this.props.listItems.map((item, index, array) => {
            return (
                <NavListItem
                    text={item.itemText}
                    onPress={() => this._onPressItem(item.itemTarget)}
                    key={index}
                    first={index === 0}
                    last={index === (array.length - 1)}
                />
            );
        });

        return (
            <View style={styles.List}>
                {children}
            </View>
        )
    }
}

export class SelectModal extends Component {
    constructor(props) {
        super(props);
        this.state = { shown: false, value: this.props.value };
    }

    _onSelect() {
        this.props.onSelect(this.props.name, this.state.value);
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
                            style={{color: '#fff'}}
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
                <TextInputListItem
                    name={this.props.item.name}                
                    value={this.state.value}
                    placeholder={this.props.item.placeholder}
                    onChange={(name, value) => this.props.onChange(name, value)}
                    key={this.props.item.name}
                    first={this.props.first}
                    last={this.props.last}  
                />
            )
        } else if (this.props.item.type === "select") {
            const displayText = this.props.item.selectOptions.filter((item) => {
                return item.value === this.state.value;
            });
            children.push(
                <NavListItem
                    text={displayText[0].name}
                    onPress={() => this.selectModal.show()}
                    key={this.props.item.name}
                    first={this.props.first}
                    last={this.props.last}                    
                />
            );
            children.push(
                <SelectModal
                    name={this.props.item.name}                                
                    ref={(component) => this.selectModal = component}
                    selectOptions={this.props.item.selectOptions}
                    onSelect={this.props.onChange}
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
