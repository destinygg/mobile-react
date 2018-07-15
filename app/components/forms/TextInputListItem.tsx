import React, {Component} from "react";
import { ViewStyle, View, TextInput } from "react-native";
import styles from "styles";

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
        let outerStyle: ViewStyle[] = [styles.ListItemOuter];
        let innerStyle: ViewStyle[] = [styles.FormItem];

        if (this.props.first) {
            outerStyle.push(styles.firstInList);
        }

        if (this.props.last) {
            outerStyle.push(styles.lastInList);
            innerStyle.push(styles.innerLastInList);
        }

        if (this.props.readOnly) {
            innerStyle.push(styles.FormItemDisabled);
        }

        if (this.props.multiline) {
            innerStyle.push({ minHeight: 100 });
        }

        return (
            <View style={outerStyle}>
                <TextInput
                    style={innerStyle}
                    value={this.props.value}
                    placeholder={this.props.placeholder}
                    placeholderTextColor={'#888'}
                    editable={(this.props.readOnly) === true ? false : true}
                    onChangeText={(value) => {
                        this.setState({ value: value });
                        this.props.onChange && this.props.onChange(this.props.name, value);
                    }}
                    underlineColorAndroid='#222'
                    multiline={this.props.multiline}
                    keyboardAppearance='dark'
                    maxLength={this.props.maxLength}
                />
            </View>
        )
    }
}