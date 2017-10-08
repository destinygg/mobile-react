import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { ProfileListItem, FormItem } from '../components.js';
import styles from './styles.js';

const countries = require("../../lib/assets/countries.json");
const countryOptions = countries.map((item) => {
    return ({ name: item['name'], value: item['alpha-2'] })
});

let PROFILEDATA = {
    username: "Destiny",
    email: "steven.bonnell.ii@gmail.com",
    allowGifting: "1",
    country: "US"
};

class ProfileList extends Component {
    _onPressItem(itemTarget) {
        this.props.navigation.navigate(itemTarget);
    }
    _renderItem({ item }) {
        return (
            <ProfileListItem
                text={item.itemText}
                onPress={() => this._onPressItem(item.itemTarget)}
            />
        )
    }
    render() {
        return(
            <FlatList
                data={this.props.listItems}
                renderItem={(item) => this._renderItem(item)}
            />
        )
    }
}

class ProfileForm extends Component {
    render() {
        return (
            <View style={styles.ProfileForm}>
                {this.props.children}
            </View>
        )
    }
}

class AccountView extends Component {
    constructor() {
        super();
        this.formItems = [
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
                type: "text"
            },
            {
                value: PROFILEDATA.country,
                placeholder: "Nationality",
                name: "country",
                type: "select",
                selectOptions: countryOptions
            },
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
        ].map((item) => 
            <FormItem 
                item={item}
                key={item.name}
            />
        );
    }
    render() {
        return (
            <ProfileForm>
                {this.formItems}
            </ProfileForm>
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

class AddressView extends Component {
    constructor() {
        super();
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
                type: "text"
            },
            {
                value: PROFILEDATA.country,
                placeholder: "Country",
                name: "country",
                type: "select",
                selectOptions: countryOptions
            }
        ].map((item) =>
            <FormItem
                item={item}
            />
        );
    }
    render() {
        return (
            <ProfileForm>
                {this.formItems}
            </ProfileForm>
        )
    }
}

class DiscordView extends Component {
    constructor() {
        super();
        this.formItems = [
            {
                value: PROFILEDATA.discordname,
                placeholder: "Discord name and ID (e.g., Destiny#123)",
                name: "discordname",
                type: "text"
            }
        ].map((item) =>
            <FormItem
                item={item}
            />
        );
    }
    render() {
        return (
            <ProfileForm>
                {this.formItems}
            </ProfileForm>
        )
    }
}

class MinecraftView extends Component {
    constructor() {
        super();
        this.formItems = [
            {
                value: PROFILEDATA.minecraftname,
                placeholder: "Minecraft name",
                name: "minecraftname",
                type: "text"
            }
        ].map((item) =>
            <FormItem
                item={item}
            />
        );
    }
    render() {
        return (
            <ProfileForm>
                {this.formItems}
            </ProfileForm>
        )
    }
}

class ProfileView extends Component {
    constructor() {
        super();
        this.state = { loaded: false };
        this.listItems = [
            { itemText: 'Account', itemTarget: 'Account' },
            { itemText: 'Subscription', itemTarget: 'Subscription' },
            { itemText: 'Address', itemTarget: 'Address' },
            { itemText: 'Minecraft', itemTarget: 'Minecraft' },
            { itemText: 'Discord', itemTarget: 'Discord' },
        ];
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
        return (
            <View style={styles.ProfileView}>
                <View style={styles.ProfileHeader}>
                    <Text style={styles.ProfileName}>{this.state.profileName}</Text>
                    <Text style={styles.ProfileCreation}>{this.state.creationDate}</Text>
                </View>
                <ProfileList listItems={this.listItems} navigation={this.props.navigation}/>
            </View>
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
    initialRouteName: 'Profile'
});

export default ProfileNav;