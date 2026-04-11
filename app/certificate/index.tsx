import { useRouter } from 'expo-router';
import { ArrowLeftIcon } from 'phosphor-react-native';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Color, FontFamily, FontSize, Gap, Padding } from '../../constants/GlobalStyles';

type BadgeItem = {
    id: string;
    title: string;
    image: any;
};

const BADGES: BadgeItem[] = [
    {
        id: 'journey',
        title: 'BẮT ĐẦU HÀNH TRÌNH',
        image: require('../../assets/images/certificates/image 20.png'),
    },
    {
        id: 'habit',
        title: 'THÓI QUEN VÀNG',
        image: require('../../assets/images/certificates/image 21.png'),
    },
    {
        id: 'vocab',
        title: 'KHO BÁU TỪ VỰNG',
        image: require('../../assets/images/certificates/image 22.png'),
    },
];

export default function CertificateScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(tabs)/profile')}>
                    <ArrowLeftIcon size={24} color={Color.gray} weight="bold" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Huy hiệu</Text>
            </View>

            <View style={styles.badgesRow}>
                {BADGES.map((badge) => (
                    <View key={badge.id} style={styles.badgeItem}>
                        <View style={styles.badgeImageWrap}>
                            <Image source={badge.image} style={styles.badgeImage} resizeMode="cover" />
                        </View>
                        <Text style={styles.badgeTitle}>{badge.title}</Text>
                    </View>
                ))}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Color.bg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Padding.padding_15,
        paddingTop: Padding.padding_15,
        paddingBottom: Padding.padding_15,
    },
    backButton: {
        marginRight: Gap.gap_10,
    },
    headerTitle: {
        fontFamily: FontFamily.lexendDecaRegular,
        fontSize: FontSize.fs_24,
        color: Color.text,
    },
    badgesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: Padding.padding_15,
        paddingTop: Padding.padding_15,
        gap: 8,
    },
    badgeItem: {
        flex: 1,
        alignItems: 'center',
    },
    badgeImageWrap: {
        width: 96,
        height: 96,
        borderRadius: 48,
        borderWidth: 2,
        borderColor: Color.stroke,
        backgroundColor: '#F7F9FC',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    badgeImage: {
        width: 90,
        height: 90,
        borderRadius: 45,
    },
    badgeTitle: {
        marginTop: Gap.gap_8,
        textAlign: 'center',
        fontFamily: FontFamily.lexendDecaSemiBold,
        fontSize: FontSize.fs_12,
        color: Color.green,
        lineHeight: 18,
    },
});
