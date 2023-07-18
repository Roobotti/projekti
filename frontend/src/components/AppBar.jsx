import { ScrollView, View, StyleSheet } from 'react-native';
import { Link } from 'react-router-native';
import Text from './Text';
import Constants from 'expo-constants';
import theme from '../theme';
import useMe from '../hooks/useMe';
import { useSignOut } from '../hooks/useSingOut';


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
  const { user } = useMe()
  const signOut = useSignOut()

  return (
    <View style={styles.container}>
      <ScrollView horizontal style={styles.scroll}>
        <View style={styles.tab}>
          <Tab to="/" text="Repositories"/>
          {user 
            ? ( <Tab to="/" text={"Sign out"} onPress={signOut} /> )
            : ( <Tab to="/SignIn" text="Sign in"/> )

          }
        </View>
      </ScrollView>
    </View>
  )
};

export default AppBar;