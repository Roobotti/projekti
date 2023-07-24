
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Link } from 'react-router-native';
import { readUsersMe } from '../services/users';


const Menu = () => {
  const user = readUsersMe()

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <Link to="/singlePlayer" style={styles.option}>
        <Text style={styles.optionText}>Single Player</Text>
      </Link>
      <Link to="/multiplayer" style={styles.option}>
        <Text style={styles.optionText}>Multiplayer</Text>
      </Link>

      
      <Link to="/SignIn" style={styles.option}>
        <Text style={styles.optionText}>Sign in</Text>
      </Link>
      <Link to="/SignUp" style={styles.option}>
        <Text style={styles.optionText}>Sign up</Text>
      </Link>

      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  option: {
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 30,
  },
  optionText: {
    fontSize: 18,
  },
});

export default Menu;