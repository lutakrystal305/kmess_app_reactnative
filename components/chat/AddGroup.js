import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default AddGroup = ({ onPress }) => {
    return(
        <TouchableOpacity style={{marginLeft: 10}} onPress={onPress}>
            <Ionicons name='add' color='#0f0' size={48} />
        </TouchableOpacity>
    )
}