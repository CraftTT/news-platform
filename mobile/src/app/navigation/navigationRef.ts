import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from './RootNavigator';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate<Name extends keyof RootStackParamList>(name: Name, params?: RootStackParamList[Name]) {
  if (navigationRef.isReady()) {
    // @ts-expect-error TS can't narrow params union perfectly here
    navigationRef.navigate(name, params as any);
  }
}