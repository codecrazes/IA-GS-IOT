import { useMemo } from 'react';
import { Image, ImageSourcePropType, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MentorScreen from '@view/Mentor';
import VisionScreen from '@view/Vision';

import { useTheme } from '@theme/useTheme';

import Home from '@view/Home';
import Explore from '@view/Explore';
import About from '@view/About';
import Profile from '@view/Profile';

import homeSelected from '@assets/icons/home-selected.svg';
import home from '@assets/icons/home.svg';
import homeDark from '@assets/icons/home-dark.svg';

import exploreSelected from '@assets/icons/explore-selected.svg';
import explore from '@assets/icons/explore.svg';
import exploreDark from '@assets/icons/explore-dark.svg';

import aboutSelected from '@assets/icons/about-selected.svg';
import about from '@assets/icons/about.svg';
import aboutDark from '@assets/icons/about-dark.svg';

import profileSelected from '@assets/icons/profile-selected.svg';
import profile from '@assets/icons/profile.svg';
import profileDark from '@assets/icons/profile-dark.svg';

import mentor from '@assets/icons/mentor.svg';
import mentorDark from '@assets/icons/mentor-dark.svg';
import mentorSelected from '@assets/icons/mentor-selected.svg';

import vision from '@assets/icons/vision.svg';
import visionDark from '@assets/icons/vision-dark.svg';
import visionSelected from '@assets/icons/vision-selected.svg';

export type TabParamList = {
  Home: undefined;
  Explore: undefined;
  About: undefined;
  Mentor: undefined;
  Vision: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const ICON_SIZE = 24;

type IconConfig = {
  focused: ImageSourcePropType;
  unfocusedLight: ImageSourcePropType;
  unfocusedDark: ImageSourcePropType;
};

const iconMap: Partial<Record<keyof TabParamList, IconConfig>> = {
  Home: {
    focused: homeSelected,
    unfocusedLight: home,
    unfocusedDark: homeDark,
  },
  Explore: {
    focused: exploreSelected,
    unfocusedLight: explore,
    unfocusedDark: exploreDark,
  },
  About: {
    focused: aboutSelected,
    unfocusedLight: about,
    unfocusedDark: aboutDark,
  },
  Profile: {
    focused: profileSelected,
    unfocusedLight: profile,
    unfocusedDark: profileDark,
  },

  // NOVOS:
  Mentor: {
    focused: mentorSelected,
    unfocusedLight: mentor,
    unfocusedDark: mentorDark,
  },
  Vision: {
    focused: visionSelected,
    unfocusedLight: vision,
    unfocusedDark: visionDark,
  },
};


const styles = StyleSheet.create({
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
});

export default function BottomTabs() {
  const { t } = useTranslation();
  const { theme, mode } = useTheme();
  const isDark = mode === 'dark';
  const insets = useSafeAreaInsets();
  const padBottom = Math.max(10, insets.bottom);

  const tabBarStyles = useMemo(
    () => ({
      tabBarStyle: {
        backgroundColor: theme.colors.card,
        height: 72 + padBottom,
        paddingBottom: padBottom,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: theme.colors.border,
      },
      tabBarLabelStyle: {
        fontSize: theme.font.sm,
        fontFamily: theme.fontFamily.regular,
        marginTop: 4,
      },
      tabBarActiveTintColor: theme.colors.textSecondary ?? '#00719C',
      tabBarInactiveTintColor: theme.colors.mutedText,
    }),
    [theme, padBottom],
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: tabBarStyles.tabBarStyle,
        tabBarLabelStyle: tabBarStyles.tabBarLabelStyle,
        tabBarActiveTintColor: tabBarStyles.tabBarActiveTintColor,
        tabBarInactiveTintColor: tabBarStyles.tabBarInactiveTintColor,
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ focused }) => {
          const config = iconMap[route.name as keyof TabParamList];
          if (!config) return null; // Mentor e Vision sem ícone

          const icon = focused
            ? config.focused
            : isDark
            ? config.unfocusedDark
            : config.unfocusedLight;

          return <Image source={icon} style={styles.icon} resizeMode="contain" />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ tabBarLabel: t('tabs.home'), title: t('tabs.home') }}
      />

      <Tab.Screen
        name="Explore"
        component={Explore}
        options={{ tabBarLabel: t('tabs.explore'), title: t('tabs.explore') }}
      />

      <Tab.Screen
        name="About"
        component={About}
        options={{ tabBarLabel: t('tabs.about'), title: t('tabs.about') }}
      />

      <Tab.Screen
        name="Mentor"
        component={MentorScreen}
        options={{ tabBarLabel: 'Mentor IA', title: 'Mentor IA' }}
      />

      <Tab.Screen
        name="Vision"
        component={VisionScreen}
        options={{ tabBarLabel: 'Ambiente Visual', title: 'Ambiente Visual' }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ tabBarLabel: t('tabs.profile'), title: t('tabs.profile') }}
      />
    </Tab.Navigator>
  );
}
