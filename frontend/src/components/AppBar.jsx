import { ScrollView, View, StyleSheet } from 'react-native';
import { Link } from 'react-router-native';
import Text from './Text';
import Constants from 'expo-constants';
import theme from '../theme';



const styles = StyleSheet.create({
  container: {
    display: 'flex',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: theme.colors.appBar,
    // ...
  },
  tab: {
    justifyContent: 'space-around',
    flexDirection: 'row'
  },
  scroll: {
    flexDirection: 'row'
  }
});

const Tab = ({ text, to, ...props }) => {
  return (
    <Link to={to} {...props}>
      <Text fontSize="subheading" color="textSecondary" style={{padding: 20}}>{text}</Text>
    </Link>
  )
}

const AppBar = () => {

  return (
    <View style={styles.container}>
      <ScrollView horizontal style={styles.scroll}>
        <View style={styles.tab}>
          <Tab to="/" text="Repositories"/>
        </View>
      </ScrollView>
    </View>
  )
};

export default AppBar;