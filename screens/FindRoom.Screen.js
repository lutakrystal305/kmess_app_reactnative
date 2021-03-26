import axios from 'axios';
import React, { useState} from 'react';
import { FlatList, TextInput, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default FindRoomScreen = ({ navigation }) => {
    const loged = useSelector(state => state.login);
    axios.defaults.headers.common['Authorization'] = loged.token;
    const authed = useSelector(state => state.checkLogged);
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [items, setItems] = useState([]);
    const Room = ({ x }) => {
        return(
            <TouchableOpacity style={styles.room} onPress={() => handlePress(x)}>
                <Text style={{textAlign: 'center'}}>{x.name}</Text>
            </TouchableOpacity>
        )
    }
    const handlePress = (x) => {
        axios
			.post('https://chat-group-sv.herokuapp.com/chat/checkRoom', {_id: x._id, user: authed.user})
			.then((res) => {
				if (res.data) {
                    //console.log(res.data.room);
					dispatch({type: 'ROOMNOW', roomNow: res.data.room});
                    navigation.navigate('Message', {_id: res.data.room._id, name: res.data.room.name});
				}
			})
    }
    const handleFind = () => {
        axios
            .post('https://chat-group-sv.herokuapp.com/chat/findRoom', {nameRoom: name})
            .then((res) => {
                if (res.data) {
                    setItems(res.data);
                }
            })
    }
    return(
        <View style={styles.container}>
            <View style={styles.formView}>
                <TextInput style={styles.inputText} onChangeText={text => setName(text)} placeholder='Your room that you want to find!!' />
                <TouchableOpacity style={styles.button} onPress={handleFind}>
                    <Text style={{textAlign: 'center'}}>Find</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.flatList}>
                {items.length > 0 && <FlatList
                data={items}
                numColumns={3}
                renderItem={({ item }) => <Room x={item} />}
                keyExtractor={item => `${item._id}`}
                contentContainerStyle={{marginHorizontal: 20, marginBottom: 20}}
                /> }
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
    },
    flatList: {
        flex: 1,
        textAlign: 'center',
        marginBottom: 350,
    },
    room: {
        flex: 1,
        justifyContent: 'center',
        width: 60,
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderWidth: 1,
        borderColor: '#AAA',
        marginLeft: 5
    }
})