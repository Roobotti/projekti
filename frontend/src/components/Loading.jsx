
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';


export const Loading = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="red" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    position: "absolute", top:200, alignSelf:'center', alignItems: "center"
  },
  loadingText: {
    margin: 110,
  },
});