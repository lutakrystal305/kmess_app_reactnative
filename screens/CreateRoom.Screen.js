import React, { useState } from 'react';
import { FlatList, TextInput, TouchableOpacity, View, Text, StyleSheet
 } from 'react-native';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

export default CreateRoomScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const authed = useSelector(state => state.checkLogged);
    const loged = useSelector(state => state.login);
    axios.defaults.headers.common['Authorization'] = loged.token;
    const [name, setName] = useState('');
    const handlePress = () => {
        axios
        .post('https://chat-group-sv.herokuapp.com/chat/createRoom', {nameRoom: name, user: authed.user})
        .then((res) => {
            if (res.data) {
                console.log(res.data);
                dispatch({type: 'NEWROOM', newRoom: res.data});
                dispatch({type: 'ROOMNOW', roomNow: res.data});
                navigation.navigate('Message', {_id: res.data._id, name: res.data.name})
            }
        })
    }
    return(
        <View style={styles.container}>
            <View style={styles.formView}>
                <TextInput style={styles.inputText} onChangeText={text => setName(text)} placeholder='Your room that you want to create!!' />
                <TouchableOpacity style={styles.button} onPress={handlePress}>
                    <Text style={{textAlign: 'center'}} >Create</Text>
                </TouchableOpacity>
            </View>
            <View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    formView: {
        marginTop: 50,
        flex: 1,
        alignItems: 'center'
    },
    inputText: {
        paddingHorizontal: 15,
        height: 40,
        borderWidth: 1,
        borderColor: '#AAA',
        borderRadius: 20,
        backgroundColor: '#DDD',
        color: '#000',
        width: '80%'
    },
    button: {
        marginTop: 15,
        paddingVertical: 15,
        borderWidth: 1,
        borderColor: '#AAA', 
        width: 150,
        textAlign: 'center'
    }
})