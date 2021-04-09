import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';

export default MessComponent = ({ x }) => {
    const authed = useSelector(state => state.checkLogged);
    const [openDate, setOpenDate] = useState(false);

    if (x.load) console.log('Fucking did');
    let avt_default = x.from.sex === 'male' ? 'https://res.cloudinary.com/den6tpnab/image/upload/v1616803856/boy_i2qi8e.png' : 'https://res.cloudinary.com/den6tpnab/image/upload/v1616803821/girl_aierwx.png';
    let avt = x.from.urlAvt || avt_default;
    return(
        <View style={styles.container}>
            { authed.user._id !==  x.from._id && <View style={styles.itemAvt}>
                <Image source={{uri: avt}} style={{width: '100%', height: '100%', resizeMode: 'cover'}} /> 
            </View> }
            <View style={styles.itemMess}>
                <Text style={authed.user && authed.user._id === x.from._id ? styles.headerMe : styles.headerGuest}>{x.from.name}</Text>
                <TouchableOpacity onPress={() => setOpenDate(!openDate)} style={[authed.user && authed.user._id === x.from._id ? styles.me : styles.guest, x.img || x.load ? styles.containImg : styles.containMess, x.load ? styles.containImgLoad : '']}>
                    {(x.img || x.load) ? 
                    <Image source={{uri: x.message}} style={{position: 'relative', width: 200, height: 300, resizeMode: 'cover'}} />
                    : <Text style={{color: '#000'}}>{x.message}</Text>}
                </TouchableOpacity>
                {openDate && <Text style={authed.user && authed.user._id === x.from._id ? styles.headerMe : styles.headerGuest}>{x.date.toString()}</Text>}
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        height: 'auto',
        alignItems: 'center'
    },
    itemAvt: {
        width: 50,
        height: 50,
        overflow: 'hidden',
        borderRadius: 20000,
        borderColor: '#AAA',
        borderWidth: 1,
    },
    containMess: {
        alignItems: 'center',
        width: 'auto',
        paddingHorizontal: 35,
        paddingVertical: 20,
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 20
    },
    headerGuest: {
        marginRight: 'auto',
        color: '#BBB',
        paddingLeft: 20,
        fontSize: 14
    },
    headerMe : {
        marginLeft: 'auto',
        color: '#BBB',
        fontSize: 14,
        paddingRight: 20
    },
    me: {
        marginLeft: 'auto',
        backgroundColor: '#3bbd62',
        color: '#EEE',
    },
    guest: {
        backgroundColor: '#BBB',
        marginRight: 'auto'
    },
    itemMess: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 10,
        paddingVertical: 5
    },
    imgMess: {
        flex: 2,
        alignItems: 'center'
    }, 
    containImg: {
        overflow: 'hidden',
        position: 'relative',
        width: 'auto',
        height: 'auto',
        borderColor: '#AAA',
        borderWidth: 2,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 20
    },
    containImgLoad: {
        opacity: 0.3
    }
})