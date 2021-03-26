import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';

export default AuthLoading = ({ navigation }) => {
    const authed = useSelector(state => state.checkLogged);
    useEffect(() => {
        navigation.navigate(authed.isAuthed ? 'App' : 'Auth');
    }, [authed.isAuthed])
    return (
        <View>
            <ActivityIndicator color='#0f0' size='large' />
        </View>
    )
}
