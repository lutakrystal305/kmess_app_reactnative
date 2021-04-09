import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';


export default TitleMessGroup = ({ onPress, name, avt }) => {
    let urlAvt = avt || 'https://res.cloudinary.com/den6tpnab/image/upload/v1616803841/group_pxl8uz.png';
    return (
      <TouchableOpacity onPress={onPress} style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <View style={{width: 40, height: 40, marginRight: 15, borderWidth: 1, borderColor: '#AAA', borderRadius: 2000, overflow: 'hidden'}}>
            <Image source={{uri: urlAvt}} style={{width: '100%', height: '100%', resizeMode: 'cover'}} />
          </View>
          <View>
            <Text style={{fontSize: 18}}>{name}</Text>
          </View>
      </TouchableOpacity>
    )
  }