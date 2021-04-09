import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

export default CommunityScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const [check, setCheck] = useState(true);
    const [rooms, setRooms] = useState([]);
    const authed = useSelector(state => state.checkLogged);
    const messageSocket = useSelector(state => state.messageSocket);
    const Item = ({ x }) => {
        let avt;
        if (x.host) {
            avt = x.avt ||'https://res.cloudinary.com/den6tpnab/image/upload/v1616803841/group_pxl8uz.png';
        } else {
            let avtDefault = x.sex === 'male' ? 'https://res.cloudinary.com/den6tpnab/image/upload/v1616803856/boy_i2qi8e.png' : 'https://res.cloudinary.com/den6tpnab/image/upload/v1616803821/girl_aierwx.png';
            avt = x.urlAvt || avtDefault;
        }
        return(
            <TouchableOpacity style={styles.Item} onPress={() => handleNavigate(x)}>
                <View style={{width: 50, height: 50, marginRight: 10, overflow: 'hidden', borderColor: '#AAA', borderWidth: 1, borderRadius: 2000}}>
                    <Image source={{uri: avt }} style={{width: '100%', height: '100%', resizeMode: 'cover'}} />
                </View>
                <Text style={{textAlign: 'center', color: '#111', fontWeight: 'bold', fontSize: 16}}>{x.name}</Text>
                {x.groups || x.check ? <View style={{borderWidth: 1, borderColor: '#AAA', borderRadius: 2000, backgroundColor: '#0f0', width: 20, height: 20, marginLeft: 20}}></View> : <Text></Text> }
            </TouchableOpacity>
        )
    }
    const handleNavigate = (x) => {
        if (x.host) {
                axios
                    .post('https://chat-group-sv.herokuapp.com/chat/checkRoom', {_id: x._id, user: authed.user})
                    .then((res) => {
                        if (res.data) {
                            //console.log(res.data.room);
                            dispatch({type: 'ROOMNOW', roomNow: res.data.room});
                            navigation.navigate('Message', {_id: res.data.room._id, name: res.data.room.name});
                        }
                    })
        } else {
            navigation.navigate('GuestProfileStack', {x: x});
        }
    }
    const getRooms = () => {
        axios  
            .get('https://chat-group-sv.herokuapp.com/chat/getRooms')
            .then((res) => {
                if (res.data) {
                    setRooms(res.data);
                }
            })
    }
    useEffect(() => {
        getRooms();
    }, []);
    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => setCheck(true)} style={{borderRightColor: '#AAA', borderRightWidth: 2, width: '50%'}}>
                    <Text style={{textAlign: 'center'}}>Users Online</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCheck(false)} style={{width: '50%'}}>
                    <Text style={{textAlign: 'center'}}>Groups</Text>
                </TouchableOpacity>
            </View>
            <View>
            {check ? <SafeAreaView>
                {messageSocket.users.length > 0 &&
                <FlatList 
                data={messageSocket.users}
                renderItem={({ item }) => <Item x={item} />}
                keyExtractor={item => `${item._id}`}
                />
                }
            </SafeAreaView>
            : <SafeAreaView>
            {rooms.length > 0 &&
            <FlatList 
            data={rooms}
            renderItem={({ item }) => <Item x={item} />}
            keyExtractor={item => `${item._id}`}
            />
            }
             </SafeAreaView>
        }
        </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 40,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    Item: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#AAA',
        borderTopColor: '#AAA',
        textAlign: 'center',
        height: 60
    }
})