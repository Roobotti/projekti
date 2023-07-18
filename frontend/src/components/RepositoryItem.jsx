import React from 'react';
import {
  View,
  StyleSheet,
  Image,
} from 'react-native';
import theme from '../theme';
import Text from './Text';

const numTool = (num) => {
  return (
  num > 1000 
  ? Math.round(num / 100) / 10 + `k`
  : num
  )
}

const RepositoryItem = ({props}) => {
  const {ownerAvatarUrl, fullName, description, language, stargazersCount, forksCount, reviewCount, ratingAverage} = props

  return (
      
      <View testID="repositoryItem" style={styles.container}>
        <View style={styles.avatarRow}>
          <Image style={styles.avatar} source={{uri: ownerAvatarUrl}}/>
          <View style={styles.item}>
            <Text style={styles.titleBold}>{fullName}</Text>
            <Text style={styles.title}>{description}</Text>
            <Text style={styles.language}>{language}</Text>
          </View>
        </View>
        <View style={styles.itemRow}>
          <View style={styles.itemFlex}>
            <Text style={styles.titleBold}>{numTool(stargazersCount)}</Text>
            <Text style={styles.title}>Stars</Text>
          </View>
          <View style={styles.itemFlex}>
            <Text style={styles.titleBold}>{numTool(forksCount)}</Text>
            <Text style={styles.title}>Forks</Text>
          </View>
          <View style={styles.itemFlex}>
            <Text style={styles.titleBold}>{numTool(reviewCount)}</Text>
            <Text style={styles.title}>Reviews</Text>
          </View>
          <View style={styles.itemFlex}>
            <Text style={styles.titleBold}>{numTool(ratingAverage)}</Text>
            <Text style={styles.title}>Rating</Text>
          </View>
        </View>

      </View>  
    )
  }

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: '#f9c2ff',
  },
  item: {
    paddingLeft: 10,
    backgroundColor: '#f9c2ff',
    alignItems: 'flex-start',
    marginRight: 40
  },
  itemFlex: {
    backgroundColor: '#f9c2ff',
    alignItems: 'center'
  },
  itemRow: {
    backgroundColor: '#f9c2ff',
    padding: 10,
    justifyContent: 'space-around',
    flexDirection: 'row'
  },
  avatarRow: {
    backgroundColor: '#f9c2ff',
    padding: 10,
    justifyContent: 'flex-start',
    flexDirection: 'row'
  },
  titleBold: {
    fontSize: theme.fontSizes.primeheading,
    fontWeight: theme.fontWeights.bold
  },
  title: {
    fontSize: theme.fontSizes.primeheading,
  },
  avatar: {
    width: 66,
    height: 58,
  },
  language: {
    padding: 5,
    backgroundColor: theme.colors.primary,
    color: theme.colors.textSecondary
  }
});


export default RepositoryItem;