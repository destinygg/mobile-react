import React, { Component } from 'react';
import { View, Text, FlatList, ScrollView, Button, Platform, ActivityIndicator, Alert, TouchableHighlight } from 'react-native';
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
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;

        return {
            headerRight: (params.isSaving) ? 
                <ActivityIndicator /> :
                <FormSaveBtn onSave={params.saveHandler ? params.saveHandler : () => null} />   
        }
    };

    constructor(props) {
        super(props);
        this.me = JSON.parse(JSON.stringify(this.props.screenProps.chat.me)); // deep clone
    }
    _onChange(name, value) {
        let updatedState = {};

        updatedState[name] = value;

        this.setState(updatedState);
    }
    save() {
        const formData = new FormData();
        for (let key in this.state) {
            formData.append(key, this.state[key]);
        }
        this.props.navigation.setParams({ isSaving: true });

        const req = new Request(`https://www.destiny.gg/${this.endpoint}`, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        fetch(req).then((response) => {
            if (response.ok) {
                this.props.navigation.goBack();
            } else {
                console.log(response);
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
            [ {text: 'OK', onPress: () => this.props.navigation.goBack()} ],
            { cancelable: false }
        );
    }

    componentDidMount() {
        this.props.navigation.setParams({ saveHandler: () => this.save() });
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
    constructor(props) {
        super(props);
        this.endpoint = 'profile/update';
        this.state = {
            username: this.me.username,
            email: this.me.email,
            country: this.me.country
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

class SubscriptionItem extends Component {
    static navigationOptions = {
        title: 'Subscription',
    };
    render() {
        const tierStyle = 
            (this.props.displayName === "Tier IV") ?
                styles.Tier4Sub :
            (this.props.displayName === "Tier III") ?
                styles.Tier3Sub :
            (this.props.displayName === "Tier II") ?
                styles.Tier2Sub :
            (this.props.displayName === "Tier I") ?
                styles.Tier1Sub :
                null;
        return (
            <TouchableHighlight onPress={this.props.onSelect(this.props.subId)} style={[styles.SubscriptionItem, tierStyle]}>
                <View style={{alignItems: 'flex-start'}}>
                    <Text style={styles.SubscriptionTitle}>{this.props.displayName}</Text>
                    <Text style={[styles.SubscriptionSubtitle, (this.props.duration === '3mo') ? styles.ThreeMonth : null]}>{this.props.duration}</Text>
                </View>
            </TouchableHighlight>
        )
    }
}

class SubscriptionView extends Component {
    static navigationOptions = {
        title: 'Subscription',
    };
    render() {
        return (
            <ScrollView style={styles.SubscriptionView}>
                <Text style={styles.selectTitle}>Choose subscription.</Text>
                <View style={styles.SubscriptionRow}>
                    <SubscriptionItem subId="" displayName="Tier IV" duration="1mo" onSelect={()=> console.log('pressed')} />
                    <SubscriptionItem subId="" displayName="Tier IV" duration="3mo" onSelect={()=> console.log('pressed')} />
                </View>
                <View style={styles.SubscriptionRow}>
                    <SubscriptionItem subId="" displayName="Tier III" duration="1mo" onSelect={()=> console.log('pressed')} />
                    <SubscriptionItem subId="" displayName="Tier III" duration="3mo" onSelect={()=> console.log('pressed')} />
                </View>
                <View style={styles.SubscriptionRow}>
                    <SubscriptionItem subId="" displayName="Tier II" duration="1mo" onSelect={()=> console.log('pressed')} />
                    <SubscriptionItem subId="" displayName="Tier II" duration="3mo" onSelect={()=> console.log('pressed')} />
                </View>
                <View style={styles.SubscriptionRow}>
                    <SubscriptionItem subId="" displayName="Tier I" duration="1mo" onSelect={()=> console.log('pressed')} />
                    <SubscriptionItem subId="" displayName="Tier I" duration="3mo" onSelect={()=> console.log('pressed')} />
                </View>
            </ScrollView>
        )
    }
}

class DiscordView extends FormView {
    static navigationOptions = {
        title: 'Discord',
    };
    constructor(props) {
        super(props);
        this.endpoint = 'profile/discord/update';        
        this.formItems = [
            {
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