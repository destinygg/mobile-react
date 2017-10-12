import React, { Component } from 'react';
import { View, Text, FlatList, ScrollView, Button } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { NavList, NavListItem, FormItem } from '../components.js';
import styles from './styles.js';

const countries = require("../../lib/assets/countries.json");
const countryOptions = countries.map((item) => {
    return ({ name: item['name'], value: item['alpha-2'] })
});

let PROFILEDATA = {
    username: "Destiny",
    creationDate: "03 June, 2015",
    email: "steven.bonnell.ii@gmail.com",
    allowGifting: "1",
    country: "US"
};

class ProfileForm extends Component {
    render() {
        const children = this.props.formItems.map((item, index, array) =>
            <FormItem
                item={item}
                key={item.name}
                first={index === 0}
                last={index === (array.length - 1)}
                onChange={(name, value) => this.props.onChange(name, value)}
            />
        );

        return (
            <View style={[styles.View, styles.List, { marginTop: 15 }]}>
                {children}
            </View>
        )
    }
}

class FormSaveBtn extends Component {
    render() {
        return(
            <View style={{ marginRight: 10 }}>
                <Button title='Save' onPress={this.props.onSave} />
            </View>
        )
    }
}

class FormView extends Component {
    constructor() {
        super();
    }
    _onChange(name, value) {
        let updatedState = [];

        updatedState[name] = value;

        this.setState(updatedState);
    }
    _extractState(item) {
        let extracted = {};
        
        if (Array.isArray(item)) {
            for (var i = 0; i < item.length; i++) {
                Object.assign(extracted, this._extractState(item[i]));
            }
        } else {
            extracted[item.name] = item.value;
        }
        return extracted;
    }
    save() {
        this.showActiveIndicator();
        fetch(`https://destiny.gg/${this.endpoint}`).then((response) => {
            if (response.status === 200) {
                this.props.navigation.goBack();
                // re-initialize user data here
            } else {
                this.showFailAlert();
            }
            this.hideActiveIndicator();
        }).catch((error) => {
            this.showFailAlert();
            this.hideActiveIndicator();
        });
    }
    componentWillMount() {
        let initState = {};

        Object.assign(initState, this._extractState(this.formItems));

        this.initState = initState;

        this.setState(initState);
    }
    render() {
        return (
            <ScrollView style={styles.View}>
                <ProfileForm formItems={this.formItems} onChange={(name, value) => this._onChange} />
            </ScrollView>
        )
    }
}

class AccountView extends FormView {
    static navigationOptions = {
        title: 'Account',
        headerRight: <FormSaveBtn onSave={() => this.save()} />
    };
    constructor() {
        super();
        this.endpoint = '/profile/account/update';
        this.formItems = [
            [
                { 
                    value: PROFILEDATA.username,
                    placeholder: "Username", 
                    name: "username",
                    type: "text"
                },
                {
                    value: PROFILEDATA.email,
                    placeholder: "Email",
                    name: "email",
                    type: "text",
                }
            ],
            [
                {
                    value: PROFILEDATA.country,
                    placeholder: "Nationality",
                    name: "country",
                    type: "select",
                    selectOptions: countryOptions,
                }
            ],
            [
                {
                    value: PROFILEDATA.allowGifting,
                    placeholder: "Accept Gifts",
                    name: "allowGifting",
                    type: "select",
                    selectOptions: [
                        { name: "Yes, I accept gifts", value: "1" },
                        { name: "No, I do not accept gifts", value: "0" }
                    ]
                },
            ]
        ]; 
    }
    render() {
        return (
            <ScrollView style={styles.View}>
                <ProfileForm formItems={this.formItems[0]} onChange={(name, value) => this._onChange(name, value)} />
                <ProfileForm formItems={this.formItems[1]} onChange={(name, value) => this._onChange(name, value)} />
                <ProfileForm formItems={this.formItems[2]} onChange={(name, value) => this._onChange(name, value)} />
            </ScrollView>
        )
    }
}

class SubscriptionView extends Component {
    render() {
        return (
            <View />
        )
    }
}

class AddressView extends FormView {
    static navigationOptions = {
        title: 'Address',
    };
    constructor() {
        super();
        this.endpoint = '/profile/address/update';        
        this.formItems = [
            {
                value: PROFILEDATA.fullName,
                placeholder: "Full Name",
                name: "fullName",
                type: "text"
            },
            {
                value: PROFILEDATA.line1,
                placeholder: "Address Line 1",
                name: "line1",
                type: "text"
            },
            {
                value: PROFILEDATA.line2,
                placeholder: "Address Line 2",
                name: "line2",
                type: "text"
            },
            {
                value: PROFILEDATA.city,
                placeholder: "City",
                name: "city",
                type: "text"
            },
            {
                value: PROFILEDATA.region,
                placeholder: "Region",
                name: "region",
                type: "text"
            },
            {
                value: PROFILEDATA.zip,
                placeholder: "Postal Code",
                name: "zip",
                type: "text",
                spacer: true
            },
            {
                value: PROFILEDATA.country,
                placeholder: "Country",
                name: "country",
                type: "select",
                selectOptions: countryOptions
            }
        ];
    }
}

class DiscordView extends FormView {
    static navigationOptions = {
        title: 'Discord',
    };
    constructor() {
        super();
        this.endpoint = '/profile/discord/update';        
        this.formItems = [
            {
                value: PROFILEDATA.discordname,
                placeholder: "Discord name and ID (e.g., Destiny#123)",
                name: "discordname",
                type: "text"
            }
        ];
    }
}

class MinecraftView extends FormView {
    static navigationOptions = {
        title: 'Minecraft',
    };
    constructor() {
        super();
        this.endpoint = '/profile/minecraft/update';        
        this.formItems = [
            {
                value: PROFILEDATA.minecraftname,
                placeholder: "Minecraft name",
                name: "minecraftname",
                type: "text"
            }
        ]
    }
}

class ProfileView extends Component {
    static navigationOptions = {
        title: 'Profile',
    };
    constructor() {
        super();
        this.state = {
            loaded: false,
            profileName: PROFILEDATA.username,
            creationDate: PROFILEDATA.creationDate
        };
        /*
        fetch("https://www.destiny.gg/api/profile").then((result) => {
            if (response.status !== 200) {
                this.error = true;
            }
            response.json().then((payload) => {
                PROFILEDATA = payload;
                this.setState({ 
                    loaded: true,
                    profileName: payload.profileName,
                    creationDate: payload.creationDate
                });
            })
        }, (error) => {
            this.error = true;
        });*/
    }
    render() {
        /*if (!this.state.loaded) {
            return ( <LoadingView /> );
        }
        if (this.error) {
            return ( <ErrorView /> );
        }*/
        this.listItems = [
            { itemText: 'Account', itemTarget: 'Account' },
            { itemText: 'Subscription', itemTarget: 'Subscription' },
            { itemText: 'Address', itemTarget: 'Address' },
            { itemText: 'Minecraft', itemTarget: 'Minecraft' },
            { itemText: 'Discord', itemTarget: 'Discord' }
        ];
        return (
            <ScrollView style={styles.View}>
                <View style={styles.ProfileHeader}>
                    <Text style={styles.title}>{this.state.profileName}</Text>
                    <Text style={styles.subtitle}>{'Created: ' + this.state.creationDate}</Text>
                </View>
                <NavList listItems={this.listItems} navigation={this.props.navigation}/>
            </ScrollView>
        )
    }
}

const ProfileNav = StackNavigator({
    Profile: { screen: ProfileView },
    Account: { screen: AccountView },
    Subscription: { screen: SubscriptionView },
    Address: { screen: AddressView },
    Discord: { screen: DiscordView },
    Minecraft: { screen: MinecraftView }
}, {
    initialRouteName: 'Profile',
    navigationOptions: {
        headerStyle: styles.Navigation,
        headerTitleStyle: styles.NavigationHeaderTitle
    }
});

export default ProfileNav;