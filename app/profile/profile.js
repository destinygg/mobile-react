import React, { Component } from 'react';
import { View, Text, FlatList, ScrollView, Button, Platform } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { NavList, NavListItem, FormItem } from '../components';
import styles from './styles';

const countries = require("../../lib/assets/countries.json");
const countryOptions = countries.map((item) => {
    return ({ name: item['name'], value: item['alpha-2'] })
});

class ProfileForm extends Component {
    render() {
        const children = this.props.formItems.map((item, index, array) =>
            <FormItem
                item={item}
                value={this.props.formState[item.name]}
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
        this.state = PROFILEDATA;
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
        this.state = {
            username: this.props.screenProps.chat.user.username,
            email: this.props.screenProps.chat.user.email,
            country: this.props.screenProps.chat.user.country
        }
        this.formItems = [
            { 
                placeholder: "Username", 
                name: "username",
                type: "text",
                readOnly: true      // need 'changes available' added to /api/me
            },
            {
                placeholder: "Email",
                name: "email",
                type: "text",
            },
            {
                placeholder: "Nationality",
                name: "country",
                type: "select",
                selectOptions: countryOptions,
            },
            /* need this added to /api/me
            {
                placeholder: "Accept Gifts",
                name: "allowGifting",
                type: "select",
                selectOptions: [
                    { name: "Yes, I accept gifts", value: "1" },
                    { name: "No, I do not accept gifts", value: "0" }
                ]
            },*/
        ]; 
    }
    render() {
        return (
            <ScrollView style={styles.View}>
                <ProfileForm formItems={this.formItems} formState={this.state} onChange={(name, value) => this._onChange(name, value)} />
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

class ProfileView extends Component {
    static navigationOptions = {
        title: 'Profile',
    };
    render() {
        this.listItems = [
            { itemText: 'Account', itemTarget: 'Account' },
            { itemText: 'Subscription', itemTarget: 'Subscription' },
            { itemText: 'Discord', itemTarget: 'Discord' }
        ];
        return (
            <ScrollView style={styles.View}>
                <View style={styles.ProfileHeader}>
                    <Text style={styles.title}>{this.props.screenProps.chat.user.username}</Text>
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
    Discord: { screen: DiscordView },
}, {
    initialRouteName: 'Profile',
    navigationOptions: {
        headerStyle: styles.Navigation,
        headerTitleStyle: styles.NavigationHeaderTitle,
        headerTintColor: (Platform.OS === 'android') ? '#fff' : undefined
    },
    cardStyle: styles.View
});

export default ProfileNav;