import { Dimensions } from 'react-native';


const {width, height} = Dimensions.get('window');
const PANEL_HEIGHT = 50;

const DIFICULTIES = [
  // [Columns, Percent of Bombs, Label]
  [6, 20, '👶'],
  [8, 30, '🧔'],
  [10, 40, '👴']
]

export { width, height, PANEL_HEIGHT, DIFICULTIES};