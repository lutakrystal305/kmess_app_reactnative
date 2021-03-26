import React, { useEffect, useState } from 'react';
import { ScrollView, SafeAreaView, FlatList, Text, View, Button, TextInput, StyleSheet, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import InfiniteScroll from 'react-native-infinite-scrolling'
import MessComponent from './chat/MessComponent';

export default ItemMessage = ({ route }) => {
    const dispatch = useDispatch();
    const messageSocket = useSelector(state => state.messageSocket);
    const authed = useSelector(state => state.checkLogged);

    let user = authed.user;

    const [mess, setMess] = useState('');
    const [items, setItems] = useState([]);
    const [count, setCount] = useState(10);

    const getItems = () => {
        if (messageSocket.messages.length > 0) {
            setItems(messageSocket.messages.slice(0,10));
        }
    }

    const handlePress = () => {
        dispatch({type: 'client-send-message', message:{message: mess, to: messageSocket.roomNow, from: user, date: Date.now()}});
        setMess('');
    }
    let list=[];
    const fetchMoreData = () => {
        if (count && messageSocket.messages.length >0) {
            if (count < messageSocket.messages.length) {
                list = messageSocket.messages.slice(count, count +10);
                setTimeout(() => {
                    setItems([...items, ...list]);
                }, 1000);
                setCount(count+10);
            } else {

                return;
            }
        }
    }
    const getMessage = () => {
        if (messageSocket.roomNow) {
            axios
                .post('https://chat-group-sv.herokuapp.com/chat/message', { group : messageSocket.roomNow})
                .then((res) => {
                    dispatch({type: 'APIMESS', messages: res.data})
                })
        }
    }
    useEffect(() => {
        getMessage();
    },[messageSocket.roomNow]);
    useEffect(() => {
        getItems();
    },[messageSocket.messages]);
    return(
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior='position'
                keyboardVerticalOffset={Platform.OS === "ios" ? 95 : 0}
            >
              <SafeAreaView style={styles.message}>
                <FlatList 
                    renderItem={({ item }) => <MessComponent x={item} />}
                    data={items}
                    keyExtractor={item => `${item._id}`}
                    onEndReached={fetchMoreData}
                    inverted={true}
              	/>
            	</SafeAreaView>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                    <View style={styles.formMess}>
                        <TextInput onChangeText={text => setMess(text)} value={mess} style={styles.formInputStyle} />
                        <Button title="Send" onPress={handlePress} />
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        //flex: 1,
        
    },
    message: {
        width: '100%',
        height: '92%'
    },  
    formMess: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%'
    },
    formInputStyle: {
        width: '80%',
        borderWidth: 1,
        borderColor: '#AAA',
        height: 40,
    }
})