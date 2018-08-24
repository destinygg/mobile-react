import React, {Component} from "react";
import { View } from "react-native";
import { ListButton } from "./ButtonList";
import SelectModal, { SelectModalItem } from "./SelectModal";
import ListSwitch from "./ListSwitch";
import TextInputListItem from "./TextInputListItem";

export interface IFormItem {
    name: string;
    tag?: string;
    readOnly?: boolean;
    placeholder?: string;
    multiline?: boolean;
    maxLength?: number;
    type: "text" | "select" | "switch";
    selectOptions?: SelectModalItem[];
    spacer?: boolean;
}

interface FormItemProps {
    item: IFormItem;
    value?: any;
    onChange: { (name: string, value: any): any };
    first?: boolean;
    last?: boolean;
}

export class FormItem extends Component<FormItemProps> {
    selectModal: SelectModal | null = null;
    render() {
        let children = [];

        if (this.props.item.type === "text") {
            children.push(
                <TextInputListItem
                    name={this.props.item.name}
                    value={this.props.value}
                    readOnly={this.props.item.readOnly}
                    placeholder={this.props.item.placeholder}
                    onChange={(name, value) => this.props.onChange(name, value)}
                    key={this.props.item.name}
                    first={this.props.first}
                    last={this.props.last}
                    multiline={this.props.item.multiline}
                    maxLength={this.props.item.maxLength}
                />
            )
        } else if (this.props.item.type === "select") {
            // @ts-ignore
            global.bugsnag.leaveBreadcrumb("Getting display text for country: " + this.props.value);
            const displayText = this.props.item.selectOptions!.find((item) => {
                return item.value === this.props.value;
            });
            children.push(
                <ListButton
                    name={displayText ? displayText.name : "Choose country..."}
                    tag={this.props.item.tag}
                    onPress={() => this.selectModal && this.selectModal.show()}
                    key={this.props.item.name}
                    last={this.props.last}
                />
            );
            children.push(
                <SelectModal
                    name={this.props.item.name}
                    ref={(component) => this.selectModal = component}
                    selectOptions={this.props.item.selectOptions!}
                    onSelect={this.props.onChange}
                    value={this.props.value}
                    key={this.props.item.name + "Modal"}
                />
            );
        } else if (this.props.item.type == "switch") {
            children.push(
                <ListSwitch
                    name={this.props.item.name}
                    tag={this.props.item.tag}
                    value={this.props.value}
                    onChange={this.props.onChange}
                    key={this.props.item.name}
                    first={this.props.first}
                    last={this.props.last}
                />
            )
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
