import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { SignIn } from '../components/Login/SignIn';
import SignUp from '../components/Login/SignUp';
import LoginFacebook from '../components/Login/LoginFacebook';
import bamboo from '../assets/bamboo.png'

export default SignInScreen = ({ navigation }) => {
    const onRegister = useSelector(state => state.register);
    const authed = useSelector(state => state.checkLogged);
    const [regis, setRegis] = useState(false);
    useEffect(() => {
        setRegis(onRegister.isRegister);
    },[onRegister.isRegister]);
    return( 
        <View style={styles.wrap}>
            <View style={{width: '100%', height: '100%', position: 'absolute'}}>
                <Image source={bamboo} style={{width: null, height: null, flex: 1, resizeMode: 'cover'}} />
            </View>
            <View style={!regis ? styles.container1 : styles.container2}>
                <View style={{height: 50, borderBottomWidth: 1, borderBottomColor: '#AAA', display: 'flex', flexDirection:'row', justifyContent:'center', alignItems: 'center'}}>
                    <TouchableOpacity style={[!regis? styles.onHeader : '', styles.header1, styles.header]} onPress={() => setRegis(false)}>
                        <Text style={[!regis? styles.onTextHeader : '', styles.textHeader]}>Sign In</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[regis? styles.onHeader: '', styles.header]} onPress={() => setRegis(true)}>
                        <Text style={[regis? styles.onTextHeader : '', styles.textHeader]}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
                {!regis ?
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', maxHeight: 300}}>
                        <SignIn navigation={navigation} />
                        <LoginFacebook navigation={navigation} />
                    </View>
                : <SignUp />}
            </View>
        </View>
        
    )
}
const styles = StyleSheet.create({
    wrap : {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',   
    },
    container1: {
        color: '#AAA',
        position: 'relative',
        width: 300,
        height: 'auto',
        maxHeight: 350,
        overflow: 'hidden',
        flex: 1,
        borderWidth: 1,
        borderColor: '#AAA',
        backgroundColor: 'rgba(255,255,255, 0.15)',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16,
    },
    container2: {
        color: '#AAA',
        position: 'relative',
        width: 300,
        height: 'auto',
        maxHeight: 450,
        overflow: 'hidden',
        flex: 1,
        borderWidth: 1,
        borderColor: '#AAA',backgroundColor: 'rgba(255,255,255, 0.15)',
        shadowColor: "#000",
        
        shadowOpacity: 0.58,
        shadowRadius: 16,
    },
    header: {
        width: '50%',
        height: 50,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },  
    header1: {
        borderRightColor: '#AAA',
        borderRightWidth: 1
    },
    onHeader: {
        backgroundColor: 'rgba(255,255,255, 0.4)'
    },
    textHeader: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    onTextHeader: {
        color: '#e56585',
    }
})