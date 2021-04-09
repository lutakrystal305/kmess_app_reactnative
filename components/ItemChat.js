import React from 'react';
import { Text, Image, View, StyleSheet, TouchableOpacity } from 'react-native';

export default ItemChat = ({ x, onPress }) => {
    let avt = x.avt || 'https://res.cloudinary.com/den6tpnab/image/upload/v1616803841/group_pxl8uz.png';
    let topMess = x.topMess.message;
    if (x.topMess.img) {
        topMess = `${x.topMess.from.name} sent a picture!`;
    }
    return(
        <TouchableOpacity style={styles.item} activeOpacity={0.4} onPress={onPress}>
            <View style={styles.itemAvt}>
                <Image source={{uri: avt}} style={{width: '100%', height: '100%', resizeMode: 'cover'}} />
            </View>
            <View style={{flex: 1, marginLeft: 20}} >
                <Text style={{paddingVertical: 20, fontSize: 16, color: '#111'}}>{x.name}</Text>
                <View style={{overflow: 'hidden', marginVertical: 5, height: '50%'}}>
                    {x.topMess ?
                    <Text style={{color: '#AAA'}}>{x.topMess.from.name} : {topMess}</Text>
                    : <Text></Text> }
                </View>
            </View>
        </TouchableOpacity  >
    )
}
const styles = StyleSheet.create({
    item: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 140,
        color: '#fff',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderTopColor: '#999',
        borderBottomColor: '#999',
    },
    itemAvt: {
        width: 80,
        height: 80,
        borderWidth: 1,
        borderColor: '#AAA',
        borderRadius: 2000,
        overflow: 'hidden',
        marginLeft: 30
    }
})