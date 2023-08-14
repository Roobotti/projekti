
import { Pressable, View, StyleSheet } from 'react-native';
import { useNavigate } from 'react-router-native';
import AuthStorage from '../utils/authStorage';

import { Formik } from 'formik';
import FormikTextInput from './FormikTextInput';


import { signIn, signUp, signOut } from '../services/users';
import Text from './Text';
import theme from '../theme';
import * as yup from 'yup'
import { useAuthStorage } from '../hooks/useStorageContext';
import { UserContext } from "../contexts/UserContext";
import { readUsersMe } from '../services/users';
import { useContext, useEffect, useState } from 'react';
import { Loading } from './Loading';

const validationSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

const initialValues = {
  username: '',
  password: '',
};

const SignForm = ({onSubmit, mode}) => {
    return (
      <View style={styles.form}>
        <FormikTextInput name="username" placeholder="Username"  style={styles.holder}/>
        <FormikTextInput name="password" placeholder="Password" secureTextEntry  style={styles.holder}/>
        <Pressable onPress={onSubmit}  style={{...styles.holder, alignItems: 'center', backgroundColor: 'rgba(33, 235, 184, 0.4)'}}>
          <Text>{mode}</Text>
        </Pressable>
      </View>
    )
  };

const SignContainer = ({onSubmit, mode}) => {  
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={ values => onSubmit(values)}
      validationSchema={validationSchema}
      >
      {({ handleSubmit }) => <SignForm onSubmit={handleSubmit} mode={mode}/>}
    </Formik>
  )}


export const SignIn = () => {
  const navigate = useNavigate();
  const authStorage = useAuthStorage();
  const {login, user} = useContext(UserContext);
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (message) { setTimeout( () => setMessage(null), 2000)}
  }, [message])

  const onSubmit = async (values) => {
    try {
      setLoading(true)
      const result = await signIn(values);
      const json = await result.json()
      await authStorage.setAccessToken(json["access_token"])
      await login(json["access_token"])
      navigate("/", { replace: true });
      console.log('Token saved to AsyncStorage');
      setLoading(false)
    

    } catch (error) { 
      console.log(error) 
      setMessage("Wrong credentials")
      setLoading(false)
    }
  };

  return (
    <View style={styles.container}>
      {message && <Text style={styles.message}> {message} </Text>}
        <SignContainer onSubmit={onSubmit} mode="sign in" />
      {loading && <Loading/>}
    </View>
  )
};

export const SignUp = () => {
  const navigate = useNavigate();
  const authStorage = useAuthStorage();
  const {login, user} = useContext(UserContext);
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (message) { setTimeout( () => setMessage(null), 2000)}
  }, [message])
  
  const onSubmit = async (values) => {
    try {
      setLoading(true)
      await signUp(values);
      const result = await signIn(values);
      const json = await result.json()
      await authStorage.setAccessToken(json["access_token"])
      await login(json["access_token"])
      navigate("/", { replace: true });
      setLoading(false)
    } catch (error) { 
      console.log(error)
      setMessage("Username is alredy taken")
      setLoading(false)
     }
  };

  return (
    <View style={styles.container}>
      {message && <Text style={styles.message}> {message} </Text>}
      <SignContainer onSubmit={onSubmit} mode="sign up" />
      {loading && <Loading/>}
    </View>
  )
};

export const SignOut = () => {
  const authStorage = useAuthStorage();
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  const s = async (values) => {
    try {
      await signOut(values);
      await authStorage.removeAccessToken()
      await userContext.logout()
      navigate("/", { replace: true });
    } catch (error) { console.log(error) }
  };

  s()
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
    },
    message: {
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: '#f9c2ff',
      textAlign: 'center'
    }
});

