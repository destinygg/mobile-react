import * as React from "react";
import { Animated, Text, ActivityIndicator, ViewStyle } from "react-native";
import { Palette } from "assets/constants";

export default class ConnectingIndicator extends React.Component<{connected?: boolean, style?: ViewStyle}> {
    activityIndicatorWidth = new Animated.Value(35);
    height = new Animated.Value(32);

    render() {
        return (
            <Animated.View
                style={Object.assign({
                    height: this.height, 
                    width: 150, 
                    flexDirection: "row", 
                    backgroundColor: "rgba(0,0,0,0.6)", 
                    justifyContent: "center",
                    paddingTop: 5,
                    borderRadius: 5
                }, this.props.style)}
            >
                <Animated.View
                    style={{
                        width: this.activityIndicatorWidth,
                    }}
                >
                    {!this.props.connected &&
                        <ActivityIndicator
                            color={"#5DAEE7"}
                            size={"small"}
                            style={{
                                marginRight: 10
                            }}
                        />
                    }
                </Animated.View>
                <Text
                    style={{
                        color: Palette.text
                    }}
                >
                    {this.props.connected ? "Connected." : "Connecting..."}
                </Text>
            </Animated.View>
        )
    }

    componentWillReceiveProps(props: {connected?: boolean, style?: ViewStyle}) {
        if (props.connected) {
            Animated.timing(this.activityIndicatorWidth, {
                toValue: 0
            }).start();
            setTimeout(() => {
                Animated.timing(this.height, {
                    toValue: 0
                }).start();
            }, 1000);
        }
    }
}