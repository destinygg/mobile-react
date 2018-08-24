import React, { Component } from 'react';
import { ActivityIndicator, Alert, Button, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { FormItem, IFormItem } from './FormItem';
import { Palette } from 'assets/constants';

interface ProfileFormProps {
    formItems: IFormItem[];
    // injected form state
    formState?: { [name: string]: any };
    onChange: { (name: string, value: string): any };
}

export class ProfileForm extends Component<ProfileFormProps> {
    render() {
        const children = this.props.formItems.map((item, index, array) =>
            <FormItem
                item={item}
                value={(this.props.formState !== undefined)
                    ? this.props.formState[item.name]
                    : undefined
                }
                key={item.name}
                first={index === 0}
                last={index === (array.length - 1)}
                onChange={this.props.onChange}
            />
        );

        return (
            <View style={{
                flex: 1,
                backgroundColor: Palette.background,
                marginTop: 15
            }}>
                {children}
            </View>
        )
    }
}

class FormSaveBtn extends Component<{ onSave: { (): any } }> {
    render() {
        return (
            <View style={{
                marginRight: (Platform.OS == 'ios') ? 5 : 15
            }}>
                <Button title='Save' onPress={this.props.onSave} />
            </View>
        )
    }
}

export interface FormViewState {
    items: {[key: string]: any};
}

export interface FormViewProps {
    endpoint: string;
    formItems: IFormItem[];
    screenProps: any;
    navigation: NavigationScreenProp<{}>;
}

export default class FormView extends Component<FormViewProps, FormViewState> {
    static navigationOptions = ({ navigation }: {
        navigation: NavigationScreenProp<{ params: any, routeName: any }>
    }) => {
        const { params, routeName } = navigation.state;

        return {
            title: routeName,
            headerRight: params && (params.isSaving ?
                <ActivityIndicator /> :
            <FormSaveBtn onSave={params.saveHandler ? params.saveHandler : () => null} />),
            drawerLockMode: 'locked-closed'
        }
    };

    constructor(props: FormViewProps) {
        super(props);
    }
    _onChange(name: string, value: string) {
        const newItems = Object.assign({}, this.state.items);
        
        newItems[name] = value;

        this.setState({items: newItems});
    }

    save() {
        const formData = new FormData();
        for (let key in this.state.items) {
            formData.append(key, this.state.items[key]);
        }
        this.props.navigation.setParams({ isSaving: true });

        const req = new Request(`https://www.destiny.gg/${this.props.endpoint}`, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        fetch(req).then((response) => {
            if (response.ok) {
                this.props.navigation.goBack();
            } else {
                this.showFailAlert();
            }
            this.props.navigation.setParams({ isSaving: false });
        }).catch((error) => {
            this.showFailAlert();
            this.props.navigation.setParams({ isSaving: false });
        });
    }

    showFailAlert() {
        Alert.alert(
            'Account update failed.',
            'Please try again later.',
            [{ text: 'OK', onPress: () => this.props.navigation.goBack() }],
            { cancelable: false }
        );
    }

    componentDidMount() {
        this.props.navigation.setParams({ saveHandler: () => this.save() });
    }

    render() {
        return (
            <KeyboardAvoidingView
                behavior='padding'
                style={{
                    flex: 1,
                    backgroundColor: Palette.background
                }}
                keyboardVerticalOffset={(Platform.OS === 'android') ? -400 : 65}
            >
                <ScrollView style={{
                    flex: 1,
                    backgroundColor: Palette.background
                }}>
                    <ProfileForm formItems={this.props.formItems} onChange={this._onChange.bind(this)} />
                </ScrollView>
            </KeyboardAvoidingView>
        )
    }
}
