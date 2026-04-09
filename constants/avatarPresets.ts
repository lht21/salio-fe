import { ImageSourcePropType } from 'react-native';

export type AvatarPreset = {
  id: string;
  label: string;
  imageSource: ImageSourcePropType;
};

export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: 'avatar-01',
    label: 'Avatar 01',
    imageSource: require('../assets/images/avatar/Ellipse 19.png'),
  },
  {
    id: 'avatar-02',
    label: 'Avatar 02',
    imageSource: require('../assets/images/avatar/Ellipse 19-1.png'),
  },
  {
    id: 'avatar-03',
    label: 'Avatar 03',
    imageSource: require('../assets/images/avatar/Ellipse 19-2.png'),
  },
  {
    id: 'avatar-04',
    label: 'Avatar 04',
    imageSource: require('../assets/images/avatar/Ellipse 2.png'),
  },
  {
    id: 'avatar-05',
    label: 'Avatar 05',
    imageSource: require('../assets/images/avatar/Ellipse 20.png'),
  },
  {
    id: 'avatar-06',
    label: 'Avatar 06',
    imageSource: require('../assets/images/avatar/Ellipse 20-1.png'),
  },
  {
    id: 'avatar-07',
    label: 'Avatar 07',
    imageSource: require('../assets/images/avatar/Ellipse 20-2.png'),
  },
  {
    id: 'avatar-08',
    label: 'Avatar 08',
    imageSource: require('../assets/images/avatar/Ellipse 21.png'),
  },
  {
    id: 'avatar-09',
    label: 'Avatar 09',
    imageSource: require('../assets/images/avatar/Ellipse 2-1.png'),
  },
  {
    id: 'avatar-10',
    label: 'Avatar 10',
    imageSource: require('../assets/images/avatar/Ellipse 21-1.png'),
  },
  {
    id: 'avatar-11',
    label: 'Avatar 11',
    imageSource: require('../assets/images/avatar/Ellipse 21-2.png'),
  },
  {
    id: 'avatar-12',
    label: 'Avatar 12',
    imageSource: require('../assets/images/avatar/Ellipse 2-2.png'),
  },
];
