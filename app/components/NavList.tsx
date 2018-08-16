import React, { Component } from "react";
import { ButtonListProps, ListButton, ListButtonProps } from "./forms/ButtonList";
import { View } from "react-native";

interface NavListProps extends ButtonListProps {
    onPress: { (target: ListButtonProps): any };
}

export class NavList extends Component<NavListProps> {
    render() {
        const children = this.props.listItems.map((item, index, array) => {
            return (
                <ListButton
                    name={item.name}
                    onPress={() => this.props.onPress(item)}
                    key={index}
                    first={index === 0}
                    last={index === (array.length - 1)}
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