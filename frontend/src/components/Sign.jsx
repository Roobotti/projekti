
import { Pressable, View, StyleSheet } from 'react-native';
import { useNavigate } from 'react-router-native';

import { Formik } from 'formik';
import FormikTextInput from './FormikTextInput';


import { signIn, signUp, signOut } from '../services/users';
import Text from './Text';
import * as yup from 'yup'
import { useAuthStorage } from '../hooks/useStorageContext';
import { UserContext } from "../contexts/UserContext";
import { useContext, useEffect, useState } from 'react';
import { Loading } from './Loading';

const validationSchema = yup.object().shape({
  username: yup.string().required('Username is required').min(3).max(12).trim("Cannot end or start with space").strict(true),
  password: yup.string().required('Password is required').min(3),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
});
const initialValues = {
  username: '',
  password: '',
};

const SignForm = ({onSubmit, mode, signUP}) => {
    return (
      <View style={styles.form}>
        <FormikTextInput name="username" placeholder="Username"  style={styles.holder}/>
        <FormikTextInput name="password" placeholder="Password" secureTextEntry style={styles.holder}/>
        {signUP ? <FormikTextInput name="confirmPassword" placeholder="Confirm password" secureTextEntry style={styles.holder}/> : null}
        <Pressable onPress={onSubmit}  style={{...styles.holder, alignItems: 'center', backgroundColor: 'rgba(33, 235, 184, 0.4)'}}>
          <Text>{mode}</Text>
        </Pressable>
      </View>
    )
  };

const SignContainer = ({onSubmit, mode, signUP=false}) => {  
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={ values => onSubmit(values)}
      validationSchema={validationSchema}
      >
      {({ handleSubmit }) => <SignForm onSubmit={handleSubmit} mode={mode} signUP={signUP}/>}
    </Formik>
  )}


export const SignIn = () => {
  const navigate = useNavigate();
  const authStorage = useAuthStorage();
  const {login} = useContext(UserContext);
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
        <SignContainer onSubmit={onSubmit} mode="Sign in" />
      {loading && <Loading/>}
    </View>
  )
};

export const SignUp = () => {
  const navigate = useNavigate();
  const authStorage = useAuthStorage();
  const {login} = useContext(UserContext);
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
      <SignContainer onSubmit={onSubmit} mode="Sign up" signUP={true}/>
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
    } catch (error) { navigate("/", { replace: true }) }
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
      backgroundColor: 'rgba(255,160,0,0.2)',
      padding: 20,
      borderRadius: 10,
      marginBottom: 20,
      borderWidth: 3,
      borderColor: 'black',
      
    },
    message: {
      padding: 10,
      borderRadius: 10,
      borderWidth: 4,
      borderStyle: 'solid',
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.2)',
      textAlign: 'center'
    }
});

