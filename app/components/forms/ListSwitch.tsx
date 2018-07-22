import React, { Component } from "react";
import styles from "styles";
import { Text, View, Switch } from "react-native";

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
        let outerStyle = [styles.ListItemOuter];
        let innerStyle = [styles.ListItemInner];

        if (this.props.first) {
            outerStyle.push(styles.firstInList);
        }

        if (this.props.last) {
            outerStyle.push(styles.lastInList);
            innerStyle.push(styles.innerLastInList);
        }
        
        const displayName = this.props.tag !== undefined
            ? this.props.tag
            : this.props.name;

        return (
            <View style={outerStyle}>
                <View style={[innerStyle, styles.ListSwitch]}>
                    <Text style={styles.ListItemText}>{displayName}</Text>
                    <Switch onValueChange={(value) => this.props.onChange(this.props.name, value)} value={this.props.value} />
                </View>
            </View>
        )
    }
}