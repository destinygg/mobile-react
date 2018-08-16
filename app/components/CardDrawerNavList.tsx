import { NavigationScreenProp } from "react-navigation";
import { PureComponent } from "react";
import ButtonList, { ListButtonProps } from "./forms/ButtonList";
import React from "react";
import { View, Platform } from "react-native";

interface CardDrawerNavListProps {
    onShowStream: { (): any };
    onHideStream: { (): any };
    navigation: NavigationScreenProp<{}>;
}

export default class CardDrawerNavList extends PureComponent<CardDrawerNavListProps> {
    routes: ListButtonProps[];
    constructor(props: CardDrawerNavListProps) {
        super(props);
        this.routes = [
            {
                name: 'Stream',
                onPress: () => {
                    if (this.props.onShowStream) {
                        this.props.onShowStream()
                    }
                },
                style: { backgroundColor: Palette.drawerBg }
            },
            {
                name: 'Chat',
                onPress: () => {
                    if (this.props.onHideStream) {
                        this.props.onHideStream()
                    }
                },
                style: { backgroundColor: Palette.drawerBg }
            },
            {
                name: 'Messages',
                onPress: () => {
                    this.props.navigation.navigate('MessageView', { backHandler: this.props.navigation.goBack })
                },
                style: { backgroundColor: Palette.drawerBg }
            }
        ];
        if (Platform.OS != 'ios') {
            this.routes.push({
                name: 'Donate',
                onPress: () => this.props.navigation.navigate('DonateView', { backHandler: this.props.navigation.goBack }),
                style: { backgroundColor: Palette.drawerBg }
            });
        }
        this.routes.push({
            name: 'Profile',
            onPress: () => this.props.navigation.navigate('ProfileView', { backHandler: this.props.navigation.goBack }),
            style: { backgroundColor: Palette.drawerBg }
        });
    }
    render() {
        return (
            <View style={{
                backgroundColor: Palette.drawerBg,
                paddingBottom: 100,
                paddingTop: 10,
                marginTop: -5
            }}>
                <ButtonList listItems={this.routes} />
            </View>
        )
    }
}