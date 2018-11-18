import * as React from 'react';
import { View, Text, StyleSheet, TouchableNativeFeedback } from 'react-native';


const SpotComponent = ({spot, onPressCallback, onLongPressCallback}) => {
  [ width, height ] = spot.dimensions;



  let style = {
    width,
    height,
    ...(!spot.flagged && !spot.covered ? styles.SpotUncovered : styles.SpotCovered)
  }

  return (
    <TouchableNativeFeedback onPress={onPressCallback} onLongPress={onLongPressCallback}>
      <View style={[styles.Spot, style]}>
        <Text style={styles.Value}>{spot.label}</Text>
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  Spot: {
    padding: 0,
    margin: 0,
    borderStyle: 'solid',
    justifyContent: 'center',
    borderWidth: 1,
    alignItems: 'center'
  },
  SpotCovered: {
    borderWidth: 3,
    borderTopColor: '#777',
    borderRightColor: '#666',
    borderBottomColor: '#444',
    borderLeftColor: '#595959',
    backgroundColor: '#686868'
  },
  SpotUncovered: {
    borderColor: '#999',
    backgroundColor: 'silver'
  },

  Value: {
    fontSize: 25,
  }
});


export default SpotComponent;

