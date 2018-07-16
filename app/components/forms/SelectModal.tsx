import React, {Component} from "react";
import { Picker, Modal, View, Button } from "react-native";

import styles from "styles";

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
                <View style={styles.SelectModalOuter}>
                    <View style={styles.SelectModalInner}>
                        <View style={styles.SelectModalHeader}>
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
                            itemStyle={styles.text}
                        >
                            {selectOptions}
                        </Picker>
                    </View>
                </View>
            </Modal>
        )
    }
}