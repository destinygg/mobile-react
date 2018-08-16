import React, { Component } from "react";
import { StyleSheet, Text, View, Switch, ViewStyle } from "react-native";
import { Palette, h3 } from "assets/constants";

interface ListSwitchProps {
    first?: boolean;
    last?: boolean;
    name: string;
    tag?: string;
    value: boolean;
    onChange: { (name: string, val: boolean): any };
}

export default class ListSwitch extends Component<ListSwitchProps> {
    render() {
        const outerStyle: ViewStyle = {
            backgroundColor: Palette.innerDark,             
            paddingLeft: 15,      
            borderColor: Palette.border,
            borderTopWidth: this.props.first ? StyleSheet.hairlineWidth : undefined,
            borderBottomWidth: this.props.last ? StyleSheet.hairlineWidth : undefined
        };
        const innerStyle: ViewStyle = {
            paddingTop: 10,
            paddingRight: 15, 
            paddingBottom: 10,         
            borderColor: Palette.border,
            borderBottomWidth: this.props.last ? StyleSheet.hairlineWidth : undefined,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        };
        
        const displayName = this.props.tag !== undefined
            ? this.props.tag
            : this.props.name;

        return (
            <View style={outerStyle}>
                <View style={innerStyle}>
                    <Text style={{
                        color: Palette.title,
                        fontSize: h3
                    }}>
                        {displayName}
                    </Text>
                    <Switch onValueChange={(value) => this.props.onChange(this.props.name, value)} value={this.props.value} />
                </View>
            </View>
        )
    }
}