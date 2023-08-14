import { ScrollView, View, StyleSheet, Button } from 'react-native';
import { useContext } from 'react';
import { Link } from 'react-router-native';
import Text from './Text';
import Constants from 'expo-constants';
import theme from '../theme';



const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: theme.colors.appBar,
    // ...
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
      <Text fontSize="subheading" color="textSecondary" style={{paddingBottom: 15}}>{text}</Text>
    </Link>
  )
}

const AppBar = () => {

  return (
      <View horizontal style={styles.container}>
        <View style={styles.tab}>
          <Tab to="/" text="Menu"/>
        </View>
      </View>

  )
};

export default AppBar;