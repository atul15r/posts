import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Routes} from './Stack/globalStack';

function NavigationStack() {
  return (
    <NavigationContainer>
      <Routes />
    </NavigationContainer>
  );
}

export default NavigationStack;
