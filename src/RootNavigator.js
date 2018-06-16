import { StackNavigator } from 'react-navigation';
import MainScene from './scenes/Home';
import MainScene from './scenes/Main';
import MenuScene from './scenes/Menu';
import LogsScene from './scenes/Logs';
import AllLocationsScene from './scenes/AllLocations';
import PendingLocationsScene from './scenes/PendingLocations';
import ConfigScene from './scenes/Config';
import DriverConfigScene from './scenes/Configure';

const RootNavigator = StackNavigator({
  Home: { screen: HomeScene },
  Main: { screen: MainScene },
  Menu: { screen: MenuScene },
  Logs: { screen: LogsScene },
  AllLocations: { screen: AllLocationsScene },
  PendingLocations: { screen: PendingLocationsScene },
  Config: { screen: ConfigScene },
  DriverConfig: { screen: DriverConfigScene }
});

export default RootNavigator;