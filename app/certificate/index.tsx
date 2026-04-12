import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';

import { Color, FontFamily, FontSize, Gap, Padding } from '../../constants/GlobalStyles';
import ScreenHeader from '../../components/ScreenHeader';

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
            <ScreenHeader 
                title="Huy hiệu" 
                onBackPress={() => router.replace('/(tabs)/profile')} 
            />

            <View style={styles.badgesRow}>
                {BADGES.map((badge, index) => (
                    <MotiView 
                        key={badge.id} 
                        style={styles.badgeItem}
                        from={{ opacity: 0, translateY: 30, scale: 0.8 }}
                        animate={{ opacity: 1, translateY: 0, scale: 1 }}
                        transition={{
                            type: 'spring',
                            delay: index * 150, // Tạo độ trễ lần lượt cho từng huy hiệu
                            damping: 12,        // Độ cản lực (càng nhỏ càng nảy nhiều)
                            stiffness: 90,      // Độ cứng của lò xo
                        }}
                    >
                        <View style={styles.badgeImageWrap}>
                            <Image source={badge.image} style={styles.badgeImage} resizeMode="cover" />
                        </View>
                        <Text style={styles.badgeTitle}>{badge.title}</Text>
                    </MotiView>
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
