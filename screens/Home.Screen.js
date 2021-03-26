import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, FlatList, SafeAreaView, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import ItemChat from '../components/ItemChat';

export default HomeScreen = ({ navigation }) => {
    const [searchText, setSearchText] = useState('');
    const [items, setItems] = useState([]);

    const dispatch = useDispatch();
    const loged = useSelector(state => state.login);
    const authed = useSelector(state => state.checkLogged);
    const messageSocket = useSelector(state => state.messageSocket);
    axios.defaults.headers.common['Authorization'] = loged.token;
    let user = authed.user;
    const getRooms = () => {
        axios
            .post('https://chat-group-sv.herokuapp.com/chat/getRoom', { user })
            .then((res) => {
                if (res.data) {
                    //console.log(res.data);
                    dispatch({type: 'YOURROOMS', yourRooms: res.data.yourRoom});
                }
            })
    }
    const handleSearch = () => {
        let a = messageSocket.yourRooms.filter(x => {
            return x.name.toLowerCase().indexOf(searchText.toLowerCase()) != -1
        })
        setItems(a);
    }
    useEffect(() => {
        getRooms();
        //console.log(messageSocket.yourRooms);
    }, [])
    useEffect(() => {
        setItems(messageSocket.yourRooms)
    },[messageSocket.yourRooms]);
    useEffect(() => {
        handleSearch();
    }, [searchText])
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.ViewInput}>
                <TextInput style={styles.inputText} onChangeText={text => setSearchText(text)} placeholder='Search your group' placeholderTextColor='#777' />
            </View>
            {items.length > 0 && <FlatList 
                data={items}
                renderItem={({ item }) => 
                <ItemChat x={item} onPress={() => {navigation.navigate('Message', {_id: item._id, name: item.name});
                    dispatch({type: 'ROOMNOW', roomNow: item})} } />
                }
                keyExtractor={item => `${item._id}`}
            />}
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    ViewInput: {
        marginVertical: 15,
        height: 40
    },
    inputText: {
        color: '#000',
        borderRadius: 20,
        backgroundColor: '#DDD',
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#AAA',
        height:40,
        paddingHorizontal: 10,
        width: '80%'
    }
})