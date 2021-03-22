import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Container} from 'features';

const App = () => {
  return (
    <View style={styles.container}>
      <Container />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
