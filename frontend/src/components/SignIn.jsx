import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import FormikTextInput from './FormikTextInput';
import Text from './Text';
import theme from '../theme';
import * as yup from 'yup'

import { useSignIn } from '../hooks/useSignIn';

const validationSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

const initialValues = {
  username: '',
  password: '',
};


const styles = StyleSheet.create({
    container: {
      display: 'flex'
    },
    form: {
      padding: 20,
    },
    holder: {
      padding: 20,
      borderRadius: 10,
      marginBottom: 20,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: '#f9c2ff'
    }
});

const SignInForm = ({onSubmit}) => {
    return (
      <View style={styles.form}>
        <FormikTextInput name="username" placeholder="Username"  style={styles.holder}/>
        <FormikTextInput name="password" placeholder="Password" secureTextEntry  style={styles.holder}/>
        <Pressable onPress={onSubmit}  style={{...styles.holder, alignItems: 'center', backgroundColor: theme.colors.blue}}>
          <Text>Sign-in</Text>
        </Pressable>
      </View>
    )
  };

export const SignInContainer = ({onSubmit}) => {  
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={ values => onSubmit(values)}
      validationSchema={validationSchema}
      >
      {({ handleSubmit }) => <SignInForm onSubmit={handleSubmit} />}
    </Formik>
  )}

const SignIn = () => {
  const [ signIn, result ] = useSignIn();
  const onSubmit = async (values) => {
    console.log("values", values)
    try {
      await signIn(values);
      
    } catch (error) { console.log(error) }
  };

  return (
    <View style={styles.container}>
      <SignInContainer onSubmit={onSubmit} />
    </View>
  )
};

export default SignIn;