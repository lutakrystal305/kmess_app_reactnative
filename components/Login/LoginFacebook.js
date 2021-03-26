import React, { useState } from 'react';
import { Button, Text, View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as Facebook from 'expo-facebook';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';



export default LoginFacebook = ({ navigation }) => {
  const dispatch = useDispatch();
  const [press, setPress] = useState(false);
  const checkAuth = (token) => {
    axios
        .post('https://chat-group-sv.herokuapp.com/user/check', { token })
        .then((res) => {
            console.log('hallo');
            console.log(res.data);
            dispatch({type: 'AUTHED', dataUser: res.data});
            navigation.navigate('App');
            //await AsyncStorage.setItem('user', JSOn.stringify(res.data));
        })
  }
    facebookLogIn = async () => {
        setPress(true);
        Facebook.initializeAsync({appId: '785136862133419'})
        try {
          const {
            type,
            token,
            expires,
            permissions,
            declinedPermissions,
          } = await Facebook.logInWithReadPermissionsAsync({
            permissions: ['public_profile'],
          });
          if (type === 'success') {
            // Get the user's name using Facebook's Graph API
            fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,gender,picture.height(500)`)
              .then(response => response.json())
              .then(data => {
                console.log(data);
                axios
                    .post("https://chat-group-sv.herokuapp.com/user/loginFB", data)
                    .then((res) => {
                        console.log(res.data);
                        if (res.data.token) {
                            dispatch({type: 'LOGGED', token: res.data.token});
                            //await AsyncStorage.setItem("token", res.data.token.toString());
                        }
                        checkAuth(res.data.token);
                        setPress(false);
                    })
                    .catch((err) => {
                    if (err.response === undefined) {
                        Alert.alert(err);
                    } else if (err.response.status === 401) {
                        setErr(true);
                        Alert.alert(err.response.data.msg);
                    }
                    });
              })
              .catch(e => console.log(e))
          } else {
            // type === 'cancel'
          }
        } catch ({ message }) {
          alert(`Facebook Login Error: ${message}`);
        }
      }
    
      logout = () => {
        setAuthed(false);
      }
    
    return (
    !press?
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', maxHeight: 100}}>
              <TouchableOpacity style={styles.fb} onPress={facebookLogIn}><Text>Login facebook</Text></TouchableOpacity>
      </View>
    : <ActivityIndicator color='#0F0' size='large' /> 
    )
}
const styles = StyleSheet.create({
    fb: {
        backgroundColor: '#4267B2',
        paddingHorizontal: 15,
        paddingVertical: 10 ,
        borderWidth: 1,
        borderColor: '#CCC'
    }
})