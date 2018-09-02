import React, {Component} from "react";
import { ViewStyle, View, TextInput, TextStyle, StyleSheet } from "react-native";
import { Palette } from "assets/constants";

interface TextInputListItemProps {
    name: string;
    value: string;
    onChange?: { (name: string, val: string): any };
    placeholder?: string;
    first?: boolean;
    last?: boolean;
    readOnly?: boolean;
    multiline?: boolean;
    maxLength?: number;
}

export default class TextInputListItem extends Component<TextInputListItemProps> {
    constructor(props: TextInputListItemProps) {
        super(props);
        this.state = { value: this.props.value };
    }
    render() {
        const outerStyle: ViewStyle = Object.assign({
            backgroundColor: Palette.innerDark,             
            paddingLeft: 15,      
            borderColor: Palette.border,
            borderTopWidth: this.props.first ? StyleSheet.hairlineWidth : undefined,
            borderBottomWidth: this.props.last ? StyleSheet.hairlineWidth : undefined
        });
        const innerStyle: TextStyle = {
            color: this.props.readOnly ? Palette.text : Palette.title,
            minHeight: this.props.multiline ? 100 : undefined,
            paddingTop: 10,
            paddingRight: 15, 
            paddingBottom: 10,         
            borderColor: Palette.border,
            borderBottomWidth: this.props.last ? StyleSheet.hairlineWidth : undefined
        };

        return (
            <View style={outerStyle}>
                <TextInput
                    style={innerStyle}
                    value={this.props.value}
                    placeholder={this.props.placeholder}
                    placeholderTextColor={Palette.text}
                    editable={(this.props.readOnly) === true ? false : true}
                    onChangeText={(value) => {
                        this.setState({ value: value });
                        this.props.onChange && this.props.onChange(this.props.name, value);
                    }}
                    underlineColorAndroid={Palette.border}
                    multiline={this.props.multiline}
                    keyboardAppearance='dark'
                    maxLength={this.props.maxLength}
                />
            </View>
        )
    }
}