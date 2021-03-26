import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

export default ItemChat = ({ x, onPress }) => {
    return(
        <TouchableOpacity style={styles.item} activeOpacity={0.4} onPress={onPress}>
            <View></View>
            <View style={{flex: 1, alignItems: 'center'}} >
                <Text style={{paddingVertical: 30}}>{x.name}</Text>
                <View>
                    {x.topMess ?
                    <Text style={{color: '#AAA'}}>{x.topMess.from.name} : {x.topMess.message}</Text>
                    : <Text></Text> }
                </View>
            </View>
        </TouchableOpacity  >
    )
}
const styles = StyleSheet.create({
    item: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 140,
        color: '#fff',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderTopColor: '#999',
        borderBottomColor: '#999',
    }
})