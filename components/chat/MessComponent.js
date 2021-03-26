import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

export default MessComponent = ({ x }) => {
    const authed = useSelector(state => state.checkLogged);
    return(
        <View style={styles.container}>
            <Text style={authed.user && authed.user._id === x.from._id ? styles.headerMe : styles.headerGuest}>{x.from.name}</Text>
            <View style={[authed.user && authed.user._id === x.from._id ? styles.me : styles.guest, styles.containMess]}>
                <Text style={{color: '#000'}}>{x.message}</Text>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 100,
        alignItems: 'center'
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
        backgroundColor: '#2456D7'
    },
    guest: {
        backgroundColor: '#BBB',
        marginRight: 'auto'
    }
})