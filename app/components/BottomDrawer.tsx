import React, { Component } from 'react';
import {
    Animated,
    Keyboard,
    KeyboardAvoidingView,
    NativeScrollEvent,
    NativeSyntheticEvent,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import styles from 'styles';

interface BottomDrawerProps {
    posSpy: Animated.Value;
    onOpen: {(): any};
    onClose: {(): any};
    paddingHeight: number;
}

export class BottomDrawer extends Component<BottomDrawerProps, {onTop: boolean, open: boolean, fixed: boolean, keyboardShown: boolean}> {
    open: boolean;
    lastVelocity: number;
    contentHeight: number;
    scrollView: Element | null;
    scrollY: Animated.Value;
    scrollYNegative: Animated.AnimatedMultiplication;
    scrollViewHeight: number;
    minMomentumVelocity: number;
    minMomentumY: number;
    minDragY: number;
    handleTopBinding: Animated.AnimatedInterpolation;
    handleWidthBinding: Animated.AnimatedInterpolation;
    opacityBinding: Animated.AnimatedInterpolation;

    constructor(props: BottomDrawerProps) {
        super(props);
        this.state = {onTop: false, open: false, fixed: false, keyboardShown: false};
        this.open = false;
        this.lastVelocity = 0;
        this.contentHeight = 0;
        this.scrollView = null;
        this.scrollY = this.props.posSpy;
        this.scrollYNegative = Animated.multiply(this.scrollY, new Animated.Value(-1));
        this.scrollViewHeight = 500;
        this.minMomentumVelocity = 0;
        this.minMomentumY = 50;
        this.minDragY = 30;
        this.handleTopBinding = this.scrollY.interpolate({
            inputRange: [
                0,
                265
            ],
            outputRange: [0, 10]
        });
        this.handleWidthBinding = this.scrollY.interpolate({
            inputRange: [
                0,
                265
            ],
            outputRange: [0.6, 1]
        });
        this.opacityBinding = this.scrollY.interpolate({
            inputRange: [
                0,
                265
            ],
            outputRange: [0.4, 1]
        })
    }
    
    _onDrag(nativeEvent: NativeScrollEvent) {
        if (!this.state.open) { // maybe open
                if (nativeEvent.contentOffset.y > this.minDragY) {
                    this.openDrawer();
                } else {
                    this.closeDrawer();
                }
        } else { // maybe close
                if (nativeEvent.contentOffset.y < (this.contentHeight - this.scrollViewHeight) - this.minDragY) {
                    this.closeDrawer();
                } else {
                    this.openDrawer();
                }
        }
    }

    _onStart(nativeEvent: NativeScrollEvent) {
        this.setState({onTop: true});        
    }

    openDrawer() {
        if (this.scrollView && (this.scrollView as any)._component) {
            this.setState({ onTop: true, open: true });
            (this.scrollView as any)._component.scrollToEnd({animated: true});
        }
        this.props.onOpen();
    }

    closeDrawer() {
        this.scrollView && (this.scrollView as any)._component &&
          (this.scrollView as any)._component.scrollTo({y: 0, animated: true});
        this.props.onClose();
        setTimeout(() => this.setState({onTop: false, open: false}), 200);
    }

    toTop() {
        this.setState({ fixed: true });
    }

    toBottom() {
        this.setState({ fixed: false });        
    }

    keyboardShown() {
        this.setState({ fixed: true, keyboardShown: true });
    }
    
    keyboardHidden() {
        this.setState({ fixed: false, keyboardShown: false });        
    }

    render() {
        return (
            <KeyboardAvoidingView 
                style={{
                    top: -(this.props.paddingHeight), 
                    width: '100%',
                    maxWidth: 600,
                    zIndex: (this.state.onTop || this.state.fixed) ? 6000 : -1                    
                }}
                behavior={'position'}
            >
                    <Animated.ScrollView
                        ref={(ref: Element) => this.scrollView = ref}
                        scrollsToTop={false}
                        scrollEnabled={!this.state.fixed}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        //onMomentumScrollBegin={(e) => this._onMomentum(e.nativeEvent)}
                        onScrollBeginDrag={(e: NativeSyntheticEvent<NativeScrollEvent>) => this._onStart(e.nativeEvent)}
                        onScrollEndDrag={(e: NativeSyntheticEvent<NativeScrollEvent>) => this._onDrag(e.nativeEvent)}
                        onContentSizeChange={(width: number, height: number) => {
                            this.contentHeight = height;
                        }}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: this.scrollY } }}],
                            { useNativeDriver: true }
                        )}     
                        scrollEventThrottle={1}
                        style={{
                            height: this.scrollViewHeight,
                            width: '100%',
                        }} 
                        keyboardShouldPersistTaps={'always'}
                        overScrollMode={'never'}
                    >              
                        <TouchableWithoutFeedback 
                            onPress={() => Keyboard.dismiss()}
                        >
                            <View style={{ height: this.props.paddingHeight }} />
                        </TouchableWithoutFeedback>
                        <Animated.View style={[
                            styles.DrawerHandle, 
                            {
                                opacity: this.opacityBinding,
                                transform: [
                                    {
                                        translateY: this.handleTopBinding,
                                    },
                                    {
                                        scaleX: this.handleWidthBinding
                                    },
                                ]
                            }
                        ]} 
                        />
                        {this.props.children}
                    </Animated.ScrollView>
            </KeyboardAvoidingView>
        )
    }
}