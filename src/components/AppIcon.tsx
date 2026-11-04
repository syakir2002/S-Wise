import Svg, { Path } from 'react-native-svg';
import type { ColorValue } from 'react-native';

export type AndroidIconName =
  | 'account_circle'
  | 'add'
  | 'arrow_back'
  | 'arrow_drop_down'
  | 'arrow_forward'
  | 'attach_money'
  | 'autorenew'
  | 'auto_awesome'
  | 'bar_chart'
  | 'cancel'
  | 'chevron_right'
  | 'cloud'
  | 'close'
  | 'dashboard'
  | 'delete'
  | 'directions_bus'
  | 'edit'
  | 'event_repeat'
  | 'expand_less'
  | 'expand_more'
  | 'filter_list'
  | 'help'
  | 'home'
  | 'info'
  | 'logout'
  | 'manage_accounts'
  | 'music_note'
  | 'north_east'
  | 'notifications'
  | 'person'
  | 'play_arrow'
  | 'play_circle'
  | 'restaurant'
  | 'search'
  | 'security'
  | 'shopping_basket'
  | 'swap_horiz'
  | 'tune';

export type IconName =
  | AndroidIconName
  | {
      ios?: string;
      android?: AndroidIconName;
      web?: AndroidIconName;
    };

type AppIconProps = {
  name: IconName;
  tintColor?: ColorValue;
  size?: number;
};

const iconPaths: Record<string, string> = {
  account_circle:
    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm0 3a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm0 14.2a7.2 7.2 0 0 1-5.8-2.94C6.25 14.34 10 13.2 12 13.2s5.75 1.14 5.8 3.06A7.2 7.2 0 0 1 12 19.2Z',
  add: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2Z',
  arrow_back: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2Z',
  arrow_drop_down: 'm7 10 5 5 5-5H7Z',
  arrow_forward: 'M4 13h12.17l-5.59 5.59L12 20l8-8-8-8-1.41 1.41L16.17 11H4v2Z',
  attach_money:
    'M12 2a1 1 0 0 1 1 1v1.07c2.28.36 4 1.8 4 4.18h-2c0-1.35-1.17-2.25-3-2.25-1.7 0-2.8.75-2.8 1.9 0 1.1.92 1.58 3.27 1.9l1.2.28c2.5.58 3.73 1.6 3.73 3.73 0 2.2-1.7 3.68-4.4 4.06V19a1 1 0 1 1-2 0v-1.1C8.3 17.56 6.5 16 6.5 13.5h2c0 1.5 1.3 2.55 3.5 2.55 1.9 0 3.2-.8 3.2-2.05 0-1.02-.75-1.58-2.7-2.02l-1.25-.28C8.7 11.1 7.2 10.1 7.2 8.1c0-2.08 1.55-3.57 3.8-4V3a1 1 0 0 1 1-1Z',
  auto_awesome:
    'm19 2 1.2 3.8L24 7l-3.8 1.2L19 12l-1.2-3.8L14 7l3.8-1.2L19 2ZM9 5l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6Zm11 11 .8 2.2L23 19l-2.2.8L20 22l-.8-2.2L17 19l2.2-.8L20 16Z',
  autorenew:
    'M12 6V3L8 7l4 4V8c2.21 0 4 1.79 4 4 0 .73-.2 1.41-.54 2h2.31A6 6 0 0 0 12 6Zm-4 6c0-.73.2-1.41.54-2H6.23A6 6 0 0 0 12 18v3l4-4-4-4v3c-2.21 0-4-1.79-4-4Z',
  bar_chart: 'M5 9h3v11H5V9Zm5-5h3v16h-3V4Zm5 8h3v8h-3v-8Zm5-5h3v13h-3V7Z',
  cancel:
    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59Z',
  chevron_right: 'm9.3 6.7 1.4-1.4 6.7 6.7-6.7 6.7-1.4-1.4 5.3-5.3-5.3-5.3Z',
  cloud: 'M19.35 10.04A7.49 7.49 0 0 0 5 9a5.5 5.5 0 0 0 .5 11h13a5 5 0 0 0 .85-9.96ZM18.5 18h-13a3.5 3.5 0 1 1 .19-7 5.5 5.5 0 0 1 10.8.9H18.5a3 3 0 0 1 0 6Z',
  close: 'M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z',
  dashboard:
    'M3 3h8v8H3V3Zm10 0h8v5h-8V3ZM3 13h8v8H3v-8Zm10-3h8v11h-8V10Z',
  delete:
    'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12ZM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4Z',
  directions_bus:
    'M12 2c-4.42 0-8 .5-8 4v10c0 1.1.9 2 2 2v2h2v-2h8v2h2v-2c1.1 0 2-.9 2-2V6c0-3.5-3.58-4-8-4ZM6 14V6h12v8H6Zm1.5 2a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm9 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z',
  edit: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25ZM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z',
  event_repeat:
    'M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H5V8h14v4h2V6c0-1.1-.9-2-2-2Zm-8 6H7v2h4v-2Zm8 3a5 5 0 0 0-4.9 4h2.06a3 3 0 0 1 5.54-.7l-1.2.7 3.5 2v-4l-1.05.61A5 5 0 0 0 19 13Zm0 10a5 5 0 0 0 4.9-4h-2.06a3 3 0 0 1-5.54.7l1.2-.7-3.5-2v4l1.05-.61A5 5 0 0 0 19 23Z',
  expand_less: 'm7 14 5-5 5 5H7Z',
  expand_more: 'm7 10 5 5 5-5H7Z',
  filter_list: 'M10 18h4v-2h-4v2ZM3 6v2h18V6H3Zm3 7h12v-2H6v2Z',
  help: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm1 17h-2v-2h2v2Zm2.07-7.75-.9.92C13.45 13.9 13 14.5 13 16h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26A2 2 0 1 0 10 10H8a4 4 0 1 1 7.07 2.25Z',
  home: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5Z',
  info: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z',
  logout:
    'M10 17v-3H3v-4h7V7l5 5-5 5Zm9 4H12v-2h7V5h-7V3h7c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2Z',
  manage_accounts:
    'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-2.67 0-8 1.34-8 4v2h11.1a6.4 6.4 0 0 1-.1-1 6 6 0 0 1 1.7-4.2A17 17 0 0 0 12 14Zm8.7 1.2.6 1.1 1.3.2v1.5l-1.3.2-.6 1.1-1.3-.4-1.1.7-1.1-.7-1.3.4-.6-1.1-1.3-.2v-1.5l1.3-.2.6-1.1 1.3.4 1.1-.7 1.1.7 1.3-.4Z',
  music_note:
    'M12 3v12.26A4 4 0 1 0 14 19V7h6V3h-8Z',
  north_east: 'M7 17 17 7H8V5h12v12h-2V8L8 18l-1-1Z',
  notifications:
    'M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2Zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2Z',
  person:
    'M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5.33 0-8 2.67-8 5v2h16v-2c0-2.33-2.67-5-8-5Z',
  play_arrow: 'M8 5v14l11-7L8 5Z',
  play_circle:
    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm-2 14.5v-9l7 4.5-7 4.5Z',
  restaurant:
    'M8 2v7a3 3 0 0 1-2 2.83V22H4V11.83A3 3 0 0 1 2 9V2h2v6h1V2h2v6h1V2h2Zm11 0v20h-2v-9h-2V7a5 5 0 0 1 4-5Z',
  search:
    'M15.5 14h-.79l-.28-.27A6.5 6.5 0 1 0 14 15.5l.27.28v.79l5 5L21 20l-5.5-6ZM10 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z',
  security:
    'M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4Zm-1 16-4-4 1.41-1.41L11 14.17l4.59-4.58L17 11l-6 6Z',
  shopping_basket:
    'M17.21 9 12 2 6.79 9H2l2 13h16l2-13h-4.79ZM12 5.33 14.73 9H9.27L12 5.33ZM8 18l-1-6h2l1 6H8Zm5 0h-2v-6h2v6Zm4 0h-2l1-6h2l-1 6Z',
  swap_horiz:
    'M16 17v-3l4 4-4 4v-3H4v-2h12ZM8 7v3L4 6l4-4v3h12v2H8Z',
  tune:
    'M3 17v2h6v-2H3Zm0-12v2h10V5H3Zm10 16v-2h8v-2h-8v-2h-2v6h2Zm-6-8h14v-2H7v2Zm10-8v6h2V9h4V7h-4V5h-2Z',
};

export default function AppIcon({ name, tintColor = '#1E2B24', size = 24 }: AppIconProps) {
  const iconName = typeof name === 'string' ? name : name.android ?? name.web ?? name.ios;
  const path = iconName && iconPaths[iconName];

  if (!path) {
    throw new Error(`Unsupported app icon: ${String(iconName)}`);
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={tintColor}>
      <Path d={path} />
    </Svg>
  );
}
