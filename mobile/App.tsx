import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from './src/app/store';
import RootNavigator from './src/app/navigation/RootNavigator';
import { useEffect } from 'react';
import { hydrateFavorites } from './src/entities/favorites/slice';
import { initPushListeners, removePushListeners, requestPushPermissionAndToken } from './src/shared/push/pushNotifications';

function Bootstrap() {
  useEffect(() => {
    store.dispatch(hydrateFavorites());
    // Временно отключаем инициализацию пушей для отладки ошибки рантайма
    // initPushListeners();
    // (async () => {
    //   const res = await requestPushPermissionAndToken();
    //   if (res.granted && res.token) {
    //     console.log('Expo push token:', res.token);
    //   } else {
    //     console.log('Push permission not granted');
    //   }
    // })();

    // return () => removePushListeners();
    return () => {}
  }, []);
  return <RootNavigator />;
}

export default function App() {
  return (
    <Provider store={store}>
      <Bootstrap />
    </Provider>
  );
}