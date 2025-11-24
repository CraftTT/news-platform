import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { navigationRef } from '../../app/navigation/navigationRef';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestPushPermissionAndToken() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    return { granted: false, token: null };
  }

  // В Expo классическом режиме можно вызвать без опций.
  // В EAS проекте допустимо передать projectId из Constants.expoConfig.extra.eas.projectId.
  const projectId = (Constants as any)?.expoConfig?.extra?.eas?.projectId || (Constants as any)?.easConfig?.projectId;
  const token = projectId
    ? await Notifications.getExpoPushTokenAsync({ projectId } as any)
    : await Notifications.getExpoPushTokenAsync();
  return { granted: true, token: token.data };
}

let subs: { received?: Notifications.Subscription; response?: Notifications.Subscription } = {};

export function initPushListeners() {
  subs.received = Notifications.addNotificationReceivedListener(() => {
    // можно показать тост, но навигацию выполняем при отклике
  });
  subs.response = Notifications.addNotificationResponseReceivedListener((response) => {
    try {
      const data: any = response.notification.request.content.data;
      if (data?.article) {
        navigationRef.current?.navigate('ArticleDetails', { article: data.article });
      } else {
        navigationRef.current?.navigate('Tabs');
      }
    } catch {}
  });
}

export function removePushListeners() {
  subs.received?.remove();
  subs.response?.remove();
  subs = {};
}

/**
 * Инструкция: отправка тестового пуша через Expo Push Service
 * 1) Получите Expo push token (см. requestPushPermissionAndToken()).
 * 2) Выполните HTTP POST на https://exp.host/--/api/v2/push/send
 *    Тело (JSON), пример:
 *    {
 *      "to": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
 *      "title": "Новая статья",
 *      "body": "Откройте статью",
 *      "data": { "article": { "title": "...", "url": "..." } }
 *    }
 *
 * Пример curl:
 *   curl -X POST https://exp.host/--/api/v2/push/send \
 *     -H "Content-Type: application/json" \
 *     -d '{
 *       "to":"ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
 *       "title":"Новая статья",
 *       "body":"Откройте статью",
 *       "data": { "article": { "title": "...", "url": "..." } }
 *     }'
 *
 * Можно также отправить через Postman.
 */