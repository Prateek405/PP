import React, { useCallback, useState, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';

const Card5 = () => {
    const [isLoading, setIsLoading] = useState(true);
    const webViewRef = useRef(null);

    const webViewProps = {
        allowsFullscreenVideo: true,
        mediaPlaybackRequiresUserAction: false,
        allowsInlineMediaPlayback: true,
        mixedContentMode: 'always',
        javaScriptEnabled: true,
        domStorageEnabled: true,
        debuggingEnabled: __DEV__, // Enable debugging in development mode
    };

    const handleLoadEnd = useCallback(() => {
        setIsLoading(false);
    }, []);

    const handleLoadError = useCallback((syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.warn('WebView error: ', nativeEvent);
        setIsLoading(false);
    }, []);

    return (
        <View style={styles.container}>
            <WebView
                ref={webViewRef}
                source={{ 
                    uri: 'https://delightful-smoke-0b081d600.5.azurestaticapps.net/9e037b01-9b15-4cd9-8a69-0ff9d7844b1c'
                }}
                {...webViewProps}
                onLoadEnd={handleLoadEnd}
                onError={handleLoadError}
                androidLayerType="hardware"
            />
            {isLoading && (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator 
                        style={styles.loader}
                        size="large"
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loaderContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
    },
    loader: {
        alignSelf: 'center',
    },
});

export default React.memo(Card5);
