import { View, StyleSheet } from 'react-native';
import { Link } from 'react-router-native';
import Text from './Text';
import Constants from 'expo-constants';
import theme from '../theme';


const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: theme.colors.appBar,
    paddingBottom: 10,


  },
  statusbar: {
    alignSelf: 'stretch',
    paddingTop: Constants.statusBarHeight + 5,
    backgroundColor: "rgba(0,0,0, 0.5)",

  },
  tab: {
    alignSelf:'flex-start',
    justifyContent: 'space-around',
    flexDirection: 'row',
    paddingHorizontal: 60
  },
});

const Tab = ({ text, to, ...props }) => {
  return (
    <Link to={to} {...props}>
      <Text fontSize="subheading" style={{color: 'white'}}>{text}</Text>
    </Link>
  )
}

export const AppBar = () => {
  return (
      <View horizontal style={styles.container}>
        <View style={{...styles.tab, gap: 100}}>
          <Tab to="/" text="Menu"/>
          <Tab to="/DevMenu" text="DevMenu"/>
        </View>
      </View>

  )
};

export const StatusBar = () => {
  return (
      <View horizontal style={styles.statusbar}>
      </View>

  )
};