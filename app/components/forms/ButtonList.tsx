import React, { Component } from 'react';
import { Text, TouchableHighlight, View, ViewStyle } from 'react-native';
import styles from 'styles';

export interface ListButtonProps {
    name: string;
    onPress?: { (): any };
    first?: boolean;
    last?: boolean;
    style?: ViewStyle;
}

export class ListButton extends Component<ListButtonProps> {
    render() {
        const outerStyle: ViewStyle[] = [styles.ListItemOuter];
        const innerStyle: ViewStyle[] = [styles.ListItemInner];

        if (this.props.first) {
            outerStyle.push(styles.firstInList);
        }

        if (this.props.last) {
            outerStyle.push(styles.lastInList);
            innerStyle.push(styles.innerLastInList);
        }

        if (this.props.style) {
            outerStyle.push(this.props.style);
        }

        return (
            <TouchableHighlight onPress={this.props.onPress} style={outerStyle}>
                <View style={innerStyle}>
                    <Text style={styles.ListItemText}>
                        {this.props.name}
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
            <View style={styles.List}>
                {children}
            </View>
        )
    }
}