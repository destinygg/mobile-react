import React, { Component } from 'react';
import { StyleSheet, Text, View, ViewStyle, TouchableOpacity } from 'react-native';
import { Palette, h3 } from 'assets/constants';

export interface ListButtonProps {
    name: string;
    tag?: string;
    onPress?: { (): any };
    last?: boolean;
    style?: ViewStyle;
}

export class ListButton extends Component<ListButtonProps> {
    render() {
        const outerStyle: ViewStyle = Object.assign({
            backgroundColor: Palette.innerDark,             
            paddingLeft: 15,      
            borderColor: Palette.border,
            borderBottomWidth: this.props.last ? undefined : StyleSheet.hairlineWidth
        }, this.props.style);
        const innerStyle: ViewStyle = {
            paddingTop: 10,
            paddingRight: 15, 
            paddingBottom: 10,         
            borderColor: Palette.border,
        };

        const displayName = this.props.tag !== undefined
            ? this.props.tag
            : this.props.name;

        return (
            <TouchableOpacity onPress={this.props.onPress} style={outerStyle}>
                <View style={innerStyle}>
                    <Text style={{
                        color: Palette.title,
                        fontSize: h3
                    }}>
                        {displayName}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
}

export interface ButtonListProps {
    listItems: ListButtonProps[];
}

export default class ButtonList extends Component<ButtonListProps> {
    render() {
        const children = this.props.listItems.map((item, index, array) => {
            return (
                <ListButton
                    name={item.name}
                    onPress={item.onPress}
                    key={index}
                    last={index === (array.length - 1)}
                    style={item.style}
                />
            );
        });

        return (
            <View style={{flex: 1}}>
                {children}
            </View>
        )
    }
}