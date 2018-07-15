import React, { Component } from "react";
import { View, ActivityIndicator, Text } from "react-native";

export class LoadingOverlay extends Component {
    render() {
        return (
            <View style={{ width: '100%', height: '100%', position: 'absolute', alignItems: 'center' }}>
                <View style={{ marginTop: '40%', width: 110, height: 100, borderRadius: 10, backgroundColor: 'rgba(25,25,25,.5)', alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size='large' />
                    <Text style={{ color: "#888", fontWeight: '500', marginTop: 15 }}>Loading...</Text>
                </View>
            </View>
        )
    }
}