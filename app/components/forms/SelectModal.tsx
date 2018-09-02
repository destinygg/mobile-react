import React, {Component} from "react";
import { Picker, Modal, View, Button } from "react-native";
import { Palette } from "assets/constants";

export interface SelectModalItem {
    name: string;
    value: string;
}

interface SelectModalProps {
    name: string;
    value: string;
    onSelect: { (name: string, value: string): any };
    selectOptions: SelectModalItem[];
}

interface SelectModalState {
    shown: boolean;
    value: string;
}

export default class SelectModal extends Component<SelectModalProps, SelectModalState> {
    constructor(props: SelectModalProps) {
        super(props);
        this.state = { shown: false, value: this.props.value };
    }

    _onSelect(name: string, value: string) {
        this.props.onSelect(name, value);
        this.hide();
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
                transparent={true}
                visible={this.state.shown}
                onRequestClose={() => this.hide()}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'flex-end'
                }}>
                    <View style={{backgroundColor: Palette.inner}}>
                        <View style={{
                            marginTop: 5,
                            marginRight: 10,
                            flexDirection: 'row',
                            justifyContent: 'flex-end'
                        }}>
                            <Button
                                onPress={() => this._onSelect(this.props.name, this.state.value)}
                                title='Done'
                            />
                        </View>
                        <Picker
                            selectedValue={this.state.value}
                            onValueChange={(itemValue, itemIndex) => {
                                this.setState({ value: itemValue });
                            }}
                            style={{
                                // @ts-ignore
                                color: Palette.title
                            }}
                        >
                            {selectOptions}
                        </Picker>
                    </View>
                </View>
            </Modal>
        )
    }
}