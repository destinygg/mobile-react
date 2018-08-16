import React, { Component } from 'react';
import { StyleSheet, Text, TouchableHighlight, View, ViewStyle } from 'react-native';
import { Palette, h3 } from 'assets/constants';

export interface ListButtonProps {
    name: string;
    tag?: string;
    onPress?: { (): any };
    first?: boolean;
    last?: boolean;
    style?: ViewStyle;
}

export class ListButton extends Component<ListButtonProps> {
    render() {
        const outerStyle: ViewStyle = Object.assign({
            backgroundColor: Palette.innerDark,             
            paddingLeft: 15,      
            borderColor: Palette.border,
            borderTopWidth: this.props.first ? StyleSheet.hairlineWidth : undefined,
            borderBottomWidth: this.props.last ? StyleSheet.hairlineWidth : undefined
        }, this.props.style);
        const innerStyle: ViewStyle = {
            paddingTop: 10,
            paddingRight: 15, 
            paddingBottom: 10,         
            borderColor: Palette.border,
            borderBottomWidth: this.props.last ? StyleSheet.hairlineWidth : undefined
        };

        const displayName = this.props.tag !== undefined
            ? this.props.tag
            : this.props.name;

        return (
            <TouchableHighlight onPress={this.props.onPress} style={outerStyle}>
                <View style={innerStyle}>
                    <Text style={{
                        color: Palette.title,
                        fontSize: h3
                    }}>
                        {displayName}
                    </Text>
                </View>
            </TouchableHighlight>
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
                    first={index === 0}
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