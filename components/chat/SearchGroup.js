import React from 'react';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default SearchGroup = ({ onPress }) => {
    return(
        <TouchableOpacity style={{marginRight: 10}} onPress={onPress} >
            <Ionicons name='search' color='#0f0' size={35}/>
        </TouchableOpacity>
    )
}