import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NewsListScreen from '../../pages/news/NewsListScreen';
import FavoritesScreen from '../../pages/favorites/FavoritesScreen';
import FilesScreen from '../../pages/files/FilesScreen';
import ArticleDetailsScreen from '../../pages/news/ArticleDetailsScreen';
import ArticleWebViewScreen from '../../pages/news/ArticleWebViewScreen';
import UnlockScreen from '../../pages/auth/UnlockScreen';
import SettingsScreen from '../../pages/settings/SettingsScreen';
import type { Article } from '../../shared/types/news';
import { navigationRef } from './navigationRef';

export type RootTabParamList = {
  News: undefined;
  Favorites: undefined;
  Files: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Unlock: undefined;
  Tabs: undefined;
  ArticleDetails: { article: Article };
  ArticleWebView: { url: string };
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen name="News" component={NewsListScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Files" component={FilesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Unlock">
        <Stack.Screen name="Unlock" component={UnlockScreen} options={{ title: 'Разблокировка' }} />
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="ArticleDetails" component={ArticleDetailsScreen} options={{ title: 'Статья' }} />
        <Stack.Screen name="ArticleWebView" component={ArticleWebViewScreen} options={{ title: 'Оригинал' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
