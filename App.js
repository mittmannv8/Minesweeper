import * as React from 'react';
import { View, StyleSheet, StatusBar, Vibration } from 'react-native';

import SpotComponent from './components/SpotComponent';
import Panel from './components/Panel';
import {Terrain, getDificultiesLabels} from './MainOperatingBase';


export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: 'stopped',
      bombSpots: 0,
      safeSpots: 0,
      time: 0,
    };

    this.terrain = new Terrain();
    this.newGameGenerate = this.newGameGenerate.bind(this);

    this.onShortPress = this.onShortPress.bind(this);
    this.onLongPress = this.onLongPress.bind(this);
    this.changeDificulty = this.changeDificulty.bind(this);
  }
  
  componentWillMount() {
      this.newGameGenerate();
  }

  newGameGenerate() {
    clearInterval(this.cronometer);

    let time = 0;
    this.terrain.reset();
    let {safeSpots, bombSpots} = this.terrain;
    
    this.setState({safeSpots, bombSpots, time, status: 'playing'});

    this.cronometer = setInterval(() => {
      time += 1;
      this.setState({time})
    }, 1000);
  }

  changeDificulty() {
    this.terrain.changeDificulty();
    this.newGameGenerate();
  }

  onLongPress(spot) {
    let {status, bombSpots, safeSpots} = this.state;

    if (status !== 'playing') {
      return;
    }

    Vibration.vibrate(30);

    bombSpots += spot.flagged ? 1 : -1;
    this.terrain.spots[spot.id].flag();

    status = this.checkGame(status, bombSpots, safeSpots);
    if (status !== 'playing') {
      this.terrain.spots.forEach(spot => spot.reveal(true));
    }

    this.setState({bombSpots, status});
  }

  onShortPress(spot) {
    let {status, safeSpots, bombSpots} = this.state;

    if (spot.flagged || status !== 'playing') {
      return;
    }

    if (spot.thereBomb) {
      let safe = this.terrain.spots[spot.id].reveal();
      this.terrain.spots.forEach(spot => spot.reveal(true));
      status = 'game-over';
    } else {
      let safe = this.terrain.spots[spot.id].reveal();
      safeSpots -= safe;
    }

    status = this.checkGame(status, bombSpots, safeSpots);

    this.setState({status, safeSpots});
  }

  checkGame(status, bombSpots, safeSpots) {
    if (status === 'playing' && (bombSpots === 0 || safeSpots === 0)) {
      clearInterval(this.cronometer);
      return 'won'
    } else if (status==='game-over') {
      clearInterval(this.cronometer);
    }
    return status;
  }

  render() {
    let {bombSpots, time, status} = this.state;

    if (status === 'game-over') {
      status = '🤕';
    } else if (status === 'won') {
      status = '😎';
    } else {
      status = '🙂';
    }

    let dificultyOptions = {...getDificultiesLabels(this.terrain.dificulty), callback: this.changeDificulty};

    const componentTerrain = this.terrain.spots.map(spot => (
      <SpotComponent
        onPressCallback={e => {this.onShortPress(spot)}}
        onLongPressCallback={e => {this.onLongPress(spot)}}
        key={spot.id}
        spot={spot}
      />
    ));

    return (
      <View style={styles.container}>
      <StatusBar hidden={true} />

        <Panel
          reset={this.newGameGenerate}
          status={status}
          bombs={bombSpots}
          time={time}
          dificulty={dificultyOptions}
          />

        <View style={styles.grid}>
          {componentTerrain}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  grid: {
    flexGrow: 1,
    flexWrap: 'wrap',
    flexDirection: 'row'
  }
})
