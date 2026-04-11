import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { Border, Color, Padding } from '../../constants/GlobalStyles';

type CenteredModalCardProps = {
    visible: boolean;
    onRequestClose: () => void;
    children: React.ReactNode;
};

const CenteredModalCard = ({
    visible,
    onRequestClose,
    children,
}: CenteredModalCardProps) => {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onRequestClose}
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onRequestClose} />

                <View style={styles.dialog}>{children}</View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.36)',
        paddingHorizontal: 20,
    },
    dialog: {
        width: '100%',
        maxWidth: 360,
        borderRadius: Border.br_20,
        backgroundColor: Color.bg,
        paddingHorizontal: 22,
        paddingTop: 20,
        paddingBottom: 22,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 18,
        elevation: 10,
    },
});

export default CenteredModalCard;
