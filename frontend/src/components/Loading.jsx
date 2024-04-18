
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import Text from '../components/Text';
import { useContext } from 'react';
import { AssetsContext } from '../contexts/AssetsContext';

export const Loading = () => {
  const {fontsLoading} = useContext(AssetsContext)
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="red" />
      {!fontsLoading && <Text style={styles.loadingText}>Loading...</Text>}
    </View>
  )
}

export const LoadingSmall = () => {
  return (
    <View style={styles.loadingSmallContainer}>
      <ActivityIndicator size="large" color="red" />
    </View>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    position: "absolute", top:300, alignSelf:'center', alignItems: "center"
  },
  loadingSmallContainer: {
    marginBottom: 15
  },
  loadingText: {
    margin: 110,
    fontSize: 30,
  },
});