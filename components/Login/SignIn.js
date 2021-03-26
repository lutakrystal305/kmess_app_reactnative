import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useDispatch } from 'react-redux';

//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


export const SignIn = ({ navigation }) => {
    const dispatch = useDispatch();
    const [press, setPress] = useState(false);
    const [mail, setMail] = useState('');
    const [pass, setPass] = useState('');

    const validateMail = new RegExp(/^([a-z0-9]{6,30})?(@gmail.com)$/g);
	const validatePass = new RegExp(/^([a-z0-9]{6,20})$/g);

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

    
    const signIn = () => {
        setPress(true);
        if (validateMail.test(mail) === false) {
            setPress(false);
            Alert.alert('Your mail was wrong syntax!!');
            setMail('');
            setPass('');
            return;
        } else if (validatePass.test(pass) === false) {
            setPress(false);
            Alert.alert('Your password was wrong syntax!!');
            setMail('');
            setPass('');
            return;
        } else {
            let user = {email: mail, password: pass};
            axios
                .post('https://chat-group-sv.herokuapp.com/user/login', user)
                .then((res) => {
                    console.log(res.data);
                    console.log(true);
                    dispatch({type: 'LOGGED', token: res.data.token});
                    //console.log(false);
                    checkAuth(res.data.token);
                        //await AsyncStorage.setItem('token', res.data.token.toString());
                    setPress(false);
                    setMail('');
                    setPass('');
                })
                .catch((err) => {
                    if (err.response === undefined) {
                      Alert.alert(err);
                    } else if (err.response.status === 401) {
                      Alert.alert(res.data.msg)
                    }
                });
        }
    }
    return(
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontWeight: 'bold', fontSize: 19, marginVertical: 15, color: '#6be585'}}>Sign In</Text>
            <View style={styles.container}>
                {!press ?
                (<View>
                    <TextInput
                        style={styles.input} 
                        onChangeText={text => setMail(text)}
                        placeholder='Email'
                        placeholderTextColor='#BBB'
                        value={mail}
                    />
                    <TextInput
                        style={styles.input} 
                        secureTextEntry={true}
                        onChangeText={text => setPass(text)}
                        placeholder='Password'
                        placeholderTextColor='#BBB'
                        value={pass}
                    />
                    <Button title='Login' onPress={signIn} />
                </View>)
                : <ActivityIndicator color='#0f0' size='large' />
            }
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    input: {
        color: '#EEE',
        height: 40,
        width: 200,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#DDD',
        marginBottom: 10
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        maxHeight: 200,
        height: 200,
    },
    
})