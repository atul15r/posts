import React from 'react';
import {StatusBar, SafeAreaView} from 'react-native';
import NavigationStack from 'components/navigation/NavigationStack';

export function Container() {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar backgroundColor={'#fff'} barStyle="dark-content" />
      <NavigationStack />
    </SafeAreaView>
  );
}
