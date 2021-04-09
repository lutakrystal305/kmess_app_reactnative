import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, Pressable, SafeAreaView, FlatList } from 'react-native';
import axios from 'axios';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';

export default ItemGroup = () => {
    const dispatch = useDispatch();
    const messageSocket = useSelector(state => state.messageSocket);
    const authed = useSelector(state => state.checkLogged); 
    
    const [members, setMembers] = useState([]);
    const [checkMember, setCheckMember] = useState(false);
    const [urlFile, setUrlFile] = useState(null);
    const [imgAvt, setImgAvt] = useState('');
    const [stt, setStt] = useState('');
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [checkCam, setCheckCam] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    let avt_default = 'https://res.cloudinary.com/den6tpnab/image/upload/v1616803841/group_pxl8uz.png';
    const permissionCamera = async () => {
        setModalVisible(false);
        const { status } = await Camera.requestPermissionsAsync();
        setStt(status);
        if (status !== 'granted') {
            Linking.openURL('app-settings:');
            return;
            
        }
        setCheckCam(true);
    }
    const takePicture = async () => {
        try {
            const options = { quality: 0.5, base64: true };
            const data = await camera.takePictureAsync(options);
            let filename = data.uri.split('/').pop();
            setImgAvt(data.uri);
            setUrlFile({uri: data.uri, type: data.type, name: filename});
            console.log(data.uri, '<<<<<<<<<<<<<<<<<<<<<');
            setCheckCam(false);
        } catch (error) {
            console.log(error, "ERROR <<<<<<<<<<<<<")
        }
    }
    const permissionGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Sorry, we need camera roll permissions to make this work!');
        }
        pickImage();
    }
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        console.log(result);
        if (!result.cancelled) {
            let filename = result.uri.split('/').pop();
            setImgAvt(result.uri);
            setUrlFile({uri: result.uri, type: result.type, name: filename});
            setModalVisible(false);
        }
      };
    //const { data } = await Camera.takePictureAsync();
    const handleCancel = () => {
        setUrlFile('');
        messageSocket.roomNow.avt && setImgAvt(messageSocket.roomNow.avt);
    }
    const handleUpImage = (data) => {
        axios
            .post('https://chat-group-sv.herokuapp.com/chat/upAvt', {data, _id: messageSocket.roomNow._id})
            .then((res) => {
                console.log(res);
                dispatch({type: 'ROOMNOW', roomNow: res.data})
            });
    }
    const handleSubmit = () => {
        console.log(urlFile, '****');
        const data = new FormData()
            data.append('file', urlFile)
            data.append('upload_preset', 'chat_default');
            data.append("cloud_name", "den6tpnab");
            fetch("https://api.cloudinary.com/v1_1/den6tpnab/image/upload", {
            method: "post",
            body: data
            }).then(res => res.json()).
            then(data => {
                console.log(data);
                handleUpImage(data.url);
                setUrlFile('');
            }).catch(err => {
                Alert.alert("An Error Occured While Uploading")
      })
    }

    let camera;
    const Photo = () => {
        return(
            <View style={styles.container}>
                <Camera style={styles.camera} type={type} ref={ref => (camera = ref)}>
                    <View style={styles.buttonContainer}>
                    <TouchableOpacity style={{flex: 1, width: '100%', flexDirection: 'row', justifyContent: 'center', position: 'absolute', top: 0, left: 0 }} onPress={() =>setCheckCam(false)}>
                        <Text style={{ fontSize: 14 }}> Quit </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                        setType(
                            type === Camera.Constants.Type.back
                            ? Camera.Constants.Type.front
                            : Camera.Constants.Type.back
                        );
                        }}>
                        <Text style={styles.text}> Flip </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 1, width: '100%', flexDirection: 'row', justifyContent: 'center', position: 'absolute', bottom: 0 }} onPress={takePicture}>
                        <Text style={{ fontSize: 14 }}> SNAP </Text>
                    </TouchableOpacity>
                    
                    </View>
                </Camera>
            </View>
        )
    }
    const handleGetMember = () => {
        setCheckMember(!checkMember);
        axios
        .post('https://chat-group-sv.herokuapp.com/user/getMember', { roomNow : messageSocket.roomNow})
        .then((res) => {
            setMembers(res.data.members);
            console.log(res.data.members);
        })
    }
    const handleLeaveRoom = () => {
        dispatch({type: 'LEAVEROOM', roomNow: messageSocket.roomNow, user: authed.user})
    }
    const Item = ({ x }) => {
        let avt;
        let avtDefault = x.sex === 'male' ? 'https://res.cloudinary.com/den6tpnab/image/upload/v1616803856/boy_i2qi8e.png' : 'https://res.cloudinary.com/den6tpnab/image/upload/v1616803821/girl_aierwx.png';
        avt = x.urlAvt ? x.urlAvt : avtDefault;
        return(
            <TouchableOpacity style={styles.Item} onPress={() => handleNavigate(x)}>
                <View style={{width: 50, height: 50, marginRight: 10, overflow: 'hidden', borderColor: '#AAA', borderWidth: 1, borderRadius: 2000}}>
                    <Image source={{uri: avt }} style={{width: '100%', height: '100%', resizeMode: 'cover'}} />
                </View>
                <Text style={{textAlign: 'center', color: '#111', fontWeight: 'bold', fontSize: 16}}>{x.name}</Text>
            </TouchableOpacity>
        )
    }
    useEffect(() => {
        messageSocket.roomNow.avt && setImgAvt(messageSocket.roomNow.avt);
    },[messageSocket.roomNow]);
    useEffect(() => {
        (!imgAvt && !messageSocket.roomNow.avt) && setImgAvt(avt_default);
    }, [imgAvt])
    return(
        !checkCam ?
        <View style={styles.container}>
            <View style={styles.viewTop}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                    setModalVisible(false);
                    }}
                >
                    <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableOpacity style={styles.ModalItem} onPress={() => setModalVisible(false)}><Text>Watch</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.ModalItem} onPress={permissionCamera} ><Text>Take Photo</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.ModalItem} onPress={permissionGallery}><Text>Choose a picture</Text></TouchableOpacity>
                    </View>
                    </View>
                </Modal>
                <Pressable style={{width: 200, height: 200, overflow: 'hidden', borderWidth: 1, borderColor: '#AAA', borderRadius: 2000}} onPress={() => setModalVisible(true)}>
                    {imgAvt ? <Image source={{uri: imgAvt}} style={{width: '100%', height: '100%'}} /> : <Text></Text>}

                </Pressable>
                {urlFile ?  <View>
                    <TouchableOpacity onPress={handleCancel}><Text>Cancel</Text></TouchableOpacity>
                    <TouchableOpacity onPress={handleSubmit}><Text>Save</Text></TouchableOpacity>
                </View> : <Text></Text>}
            </View>
            <View style={styles.formBody}>
                <TouchableOpacity>
                    <Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginVertical: 15, color: '#8aa597'}}>{messageSocket.roomNow.name}</Text>
                </TouchableOpacity>
                {messageSocket.roomNow.host.name && <View>
                    <Text style={styles.textItem}>{messageSocket.roomNow.host.name}</Text>
                </View>}
               <TouchableOpacity onPress={handleGetMember} style={[checkMember ? styles.checkMember : '', {marginVertical: 15}]} >
                   <Text style={[styles.textItem, {color: '#24678a'}]}>Members</Text>
               </TouchableOpacity>
                {(members.length > 0 && checkMember) && 
                <SafeAreaView>
                    <FlatList 
                    renderItem={({ item }) => <Item x={item} onPress={() => NavigationPreloadManager.navigate('GuestProfileStack', {x: item})} />}
                    data={members}
                    keyExtractor={item => `${item._id}`}
                    />    
                </SafeAreaView>}
                <TouchableOpacity onPress={handleLeaveRoom} style={{marginVertical: 15}}>
                    <Text style={[styles.textItem, {color: '#ad1756'}]}>Leave Room </Text>
                </TouchableOpacity>
            </View>
        </View>
        : <Photo />
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
    formBody: {
        flex: 1,
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
    },
    textItem: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 30,
        fontSize: 18, 
        fontWeight: 'bold',
        borderWidth: 1,
        borderColor: '#AAA'
    },
    checkMember: {
        backgroundColor: '#CCC'
    }
})