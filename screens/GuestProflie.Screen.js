import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native';

export default GuestProfileScreen = ({ route }) => {
    const [guest, setGuest] = useState(null);
    let avt;
    if (guest) {
        let avt_default = guest.sex === 'male' ? 'https://res.cloudinary.com/den6tpnab/image/upload/v1616803856/boy_i2qi8e.png' : 'https://res.cloudinary.com/den6tpnab/image/upload/v1616803821/girl_aierwx.png';
        avt = guest.urlAvt || avt_default;
    }
    useEffect(() => {
        setGuest(route.params.x)
    }, []);
    return(
        guest && <View style={styles.container}>
            <View style={styles.viewTop}>
                <View style={{width: 200, height: 200, overflow: 'hidden', borderWidth: 1, borderColor: '#AAA', borderRadius: 2000}} onPress={() => setModalVisible(true)}>
                    <Image source={{uri: avt}} style={{width: '100%', height: '100%'}} />

                </View>
            </View>
            <View style={styles.formInfor}>
                <View style={styles.itemInfor}>
                    <Text style={{fontSize: 16, fontWeight: 'bold', color: '#88a09e'}}>Name: </Text>
                    <Text style={{fontSize: 16, color: '#9956d5'}}>{guest.name}</Text>
                </View>
                <View style={styles.itemInfor}>
                    <Text style={{fontSize: 16, fontWeight: 'bold', color: '#27d978'}}>Email: </Text>
                    <Text style={{fontSize: 16, color: '#9f4671'}}>{guest.email}</Text>
                </View>
                <View style={styles.itemInfor}>
                    <Text style={{fontSize: 16, fontWeight: 'bold', color: '#d7c622'}}>Gender: </Text>
                    <Text style={{fontSize: 16, color: '#254d99'}}>{guest.sex}</Text>
                </View>
                {guest.date && <View style={styles.itemInfor}>
                    <Text style={{fontSize: 16, fontWeight: 'bold', color: '#26d756'}}>Date of Birth: </Text>
                    <Text style={{fontSize: 16, color: '#242242'}}>{guest.date}</Text>
                </View>}
                <View style={styles.itemInfor1}>
                    <Text style={{fontSize: 16, marginBottom: 10, fontWeight: 'bold', color: '#5656d7'}}>Date of initialization: </Text>
                    <Text style={{fontSize: 16, color: '#da6b77'}}>{guest.update}</Text>
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    viewTop: {
        flex: 0.55,
        alignItems: 'center',
    },  
    Up: {
        backgroundColor: '#AAA',
        opacity: 0.5,
    },
    formInfor: {
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '80%',
        borderWidth: 1,
        borderColor: '#AAA',
        backgroundColor: '#EEE',
        borderRadius: 20,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemInfor: {
        paddingVertical: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#f00',
        borderTopColor: '#0f0',
        marginVertical: 15,
        overflow: 'hidden'
    },
    itemInfor1: {
        paddingVertical: 10,
        flex: 0.3,
        alignItems: 'center',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#08a7c1',
        borderTopColor: '#b6c764',
        marginVertical: 15,
        overflow: 'hidden'
    },
    camera: {
        flex: 1,
      },
      buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        margin: 20,
      },
      button: {
        flex: 0.1,
        alignSelf: 'flex-end',
        alignItems: 'center',
      },
      text: {
        fontSize: 18,
        color: 'white',
      },
      centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      ModalItem: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          maxHeight: 40,
          borderTopColor: '#AAA',
            borderTopWidth: 1,
      }
})