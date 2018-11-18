import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { PANEL_HEIGHT, width } from '../constants';


const Display = ({children}) => (
  <View style={styles.DisplayBorder}>
    <Text style={styles.Display}>{children}</Text>
  </View>
);

const Cronometer = ({ time }) => {
  let minutes = String(Math.floor(time / 60)).padStart(2, '0');
  let seconds = String(time % 60).padStart(2, '0');
  return <Display>{`${minutes}:${seconds}`}</Display>
}


const SetOptions = ({current, options, callback}) => {
  optionsComponents = options.map(o => <Text style={styles.SetOptionsOption} key={o}>{o}</Text>)

  return (
    <View style={[styles.Box, styles.SetOptions]}>
      <TouchableOpacity onPress={callback}>
        <Text style={styles.CurrentOption}>{current}</Text>
        <View style={styles.SetOptionsOptions}>
          {optionsComponents}
        </View>
      </TouchableOpacity>
    </View>
  )
}

const Panel = ({reset, status, time, bombs, dificulty}) => (
    <View style={styles.Panel}>
      <Display> {String(bombs).padStart(3, '0')} </Display>

      <SetOptions {...dificulty} />

      <TouchableOpacity onPress={reset}>
      	<Text style={styles.Box}>{status}</Text>
      </TouchableOpacity>

      <Cronometer time={time} />
    </View>
);

const styles = StyleSheet.create({
  // Panel
  Panel: {
  	height: PANEL_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#999',
    padding: 2,
  },
  // Item Panel
  Box: {
  	fontSize: 25,
    textAlign: 'center',
  	padding: 0,
  	margin: 0
  },
  // Options
  SetOptions: {
    backgroundColor: '#8e8e8e',
    borderColor: '#777',
    borderRadius: PANEL_HEIGHT,
    elevation: 3,
    width: PANEL_HEIGHT-10,
    height: PANEL_HEIGHT-10
  },
  CurrentOption: {
    fontSize: 20,
    textAlign: 'center',
  },
  SetOptionsOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  SetOptionsOption: {
    fontSize: 10,
    textAlign: 'center',
  },
  // LCD
  DisplayBorder: {
    borderWidth: 3,
    borderTopColor: '#aaa',
    borderBottomColor: '#333',
    borderLeftColor: '#666',
    borderRightColor: '#666',
  },
  Display: {
    textAlign: 'center',
    width: (width / 5),
    backgroundColor: '#222',
    color: 'red',
    fontSize: 25,
    borderWidth: 3,
    borderTopColor: '#333',
    borderBottomColor: '#999',
    borderLeftColor: '#444',
    borderRightColor: '#444',
  }
})

export default Panel;