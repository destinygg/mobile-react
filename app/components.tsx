import React, { Component } from 'react';
import { View, Text, TextInput, Picker, Modal, Button, TouchableHighlight, Switch, WebView, ViewStyle, ActivityIndicator} from 'react-native';
import styles from 'styles';

export interface ListButtonProps {
    name: string;
    onPress?: {(): any};
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

interface TextInputListItemProps {
    name: string;
    value: string;
    onChange?: {(name: string, val: string): any};
    placeholder?: string;
    first?: boolean;
    last?: boolean;
    readOnly?: boolean;
    multiline?: boolean;
    maxLength?: number;
}

export class TextInputListItem extends Component<TextInputListItemProps> {
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
            innerStyle.push({minHeight: 100});
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

interface ButtonListProps {
    listItems: ListButtonProps[];
}

export class ButtonList extends Component<ButtonListProps> {
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

interface NavListProps extends ButtonListProps {
    onPress: {(target: ListButtonProps): any};
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
            <View style={styles.List}>
                {children}
            </View>
        )
    }
}

interface SelectModalItem {
    name: string;
    value: string;
}

interface SelectModalProps {
    name: string;
    value: string;
    onSelect: {(name: string, value: string): any};
    selectOptions: SelectModalItem[];
}

interface SelectModalState {
    shown: boolean;
    value: string;
}

export class SelectModal extends Component<SelectModalProps, SelectModalState> {
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
                transparent={ true } 
                visible={ this.state.shown } 
                onRequestClose= {() => this.hide() } 
            >
                <View style={ styles.SelectModalOuter }>
                    <View style={ styles.SelectModalInner }>
                        <View style={ styles.SelectModalHeader }>
                            <Button
                                onPress={()=> this._onSelect(this.props.name, this.state.value)}
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

export class LoadingOverlay extends Component {
    render() {
        return(
            <View style={{ width: '100%', height: '100%', position: 'absolute', alignItems: 'center' }}>
                <View style={{ marginTop: '40%', width: 110, height: 100, borderRadius: 10, backgroundColor: 'rgba(25,25,25,.5)', alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size='large' />
                    <Text style={{ color: "#888", fontWeight: '500', marginTop: 15 }}>Loading...</Text>
                </View>
            </View>
        )
    }
}

interface ListSwitchProps {
    first?: boolean;
    last?: boolean;
    name: string;
    value: boolean;
    onChange: {(name: string, val: boolean): any};
}

class ListSwitch extends Component<ListSwitchProps> {
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
        return (
            <View style={outerStyle}>
                <View style={[innerStyle, styles.ListSwitch]}>
                    <Text style={styles.ListItemText}>{this.props.name}</Text>
                    <Switch onValueChange={(value) => this.props.onChange(this.props.name, value)} value={this.props.value} />
                </View>
            </View>
        )
    }
}

interface FormItemProps {
    item: {
        name: string;
        readOnly?: boolean;
        placeholder?: string;
        multiline?: boolean;
        maxLength?: number;
        type: "text" | "select" | "switch";
        selectOptions?: SelectModalItem[];
        spacer?: boolean;
    }
    value: any;
    onChange: {(name: string, value: any): any};
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
            const displayText = this.props.item.selectOptions!.filter((item) => {
                return item.value === this.props.value;
            });
            children.push(
                <ListButton
                    name={displayText[0].name}
                    onPress={() => this.selectModal && this.selectModal.show()}
                    key={this.props.item.name}
                    first={this.props.first}
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

export class UserAgreement extends Component {
    static navigationOptions = {
        title: 'User Agreement',
        drawerLockMode: 'locked-closed'
    }
    render() {
        return (
            <WebView source={{ uri: 'https://www.destiny.gg/agreement' }} />
        )
    }
}
