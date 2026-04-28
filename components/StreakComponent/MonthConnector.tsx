import React from 'react';
import { View, StyleSheet } from 'react-native';

export const MonthConnector = () => {
    return (
        <View style={styles.connectorWrap}>
            <View style={styles.connectorDot} />
            <View style={styles.connectorLine} />
            <View style={styles.connectorDot} />
        </View>
    );
};

const styles = StyleSheet.create({
    connectorWrap: { alignItems: 'center', marginVertical: 10 },
    connectorLine: { height: 20, borderLeftWidth: 2, borderStyle: 'dashed', borderLeftColor: 'rgba(80, 141, 78, 0.3)' },
    connectorDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: 'rgba(80, 141, 78, 0.55)' },
});