import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Button, ActivityIndicator } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { useDispatch } from 'react-redux';

export default SignUp = () => {
    const dispatch = useDispatch();

    const [press, setPress] = useState(false);
    const [valueMail, setValueMail] = useState('');
    const [valuePass2, setValuePass2] = useState('');
    const [valuePass, setValuePass] = useState('');
    const [valueGender, setValueGender] = useState('');
    const [valueName, setValueName] = useState('');
    const [checked, setChecked] = useState('male');

    const validateMail = new RegExp(/^([a-z0-9]{6,25})?(@gmail.com)$/g);
    const validatePass = new RegExp(/^([a-z0-9]{6,20})$/g);
    const validateName = new RegExp(/^([a-zA-Z]{2,20}?)$/g);

    const handleClick = () => {
        setPress(true);
        if (validateName.test(valueName) === false) {
            setPress(false);
            Alert.alert('Your Name was wrong syntax!');
            setValueName('')
        } else if (validateMail.test(valueMail) === false) {
			setPress(false);
            Alert.alert('Your Mail was wrong syntax!');
            setValueMail('');
            setValuePass('');
            setValuePass2('');
		} else if (validatePass.test(valuePass) === false) {
			setPress(false);
            Alert.alert('Your Password was wrong syntax!');
            setValuePass('');
            setValuePass2('');
		} else if (valuePass !== valuePass2) {
            setPress(false);
            Alert.alert('Password is not correct')
            setValuePass2('');
        } else if (!checked) {
            setPress(false);
            Alert.alert('Your gender was wrong!!!')
        } else {
            let urlAvt =  checked === 'male' ? 'https://res.cloudinary.com/den6tpnab/image/upload/v1616803856/boy_i2qi8e.png' : 'https://res.cloudinary.com/den6tpnab/image/upload/v1616803821/girl_aierwx.png';
            let newUser = {
                name: valueName,
                email: valueMail,
                password: valuePass,
                sex: checked,
                urlAvt
            };
            console.log(newUser);
            axios
                .post('http://localhost:9999/user/create', newUser)
                .then((res) => {
                    if (res.data) {
                        dispatch({type: 'REGISTER'});
                        setPress(false);
                    }
                })
        }
    }
    return(
        !press ?
        <View style={styles.container} >
            <Text style={{fontSize: 19, fontWeight: 'bold', marginTop: 30, color: '#6be585'}}>Sign Up</Text>
            <View style={styles.container}>
                <TextInput
                    onChangeText={text => setValueName(text)}
                    placeholder='Your name'
                    placeholderTextColor='#BBB'
                    style={styles.input}
                    value={valueName} />
                <TextInput
                    onChangeText={text => setValueMail(text)}
                    placeholder='Your email'
                    placeholderTextColor='#BBB'
                    style={styles.input}
                    value={valueMail} />
                <TextInput
                    onChangeText={text => setValuePass(text)}
                    placeholder='Your Password' 
                    placeholderTextColor='#BBB'
                    style={styles.input} 
                    value={valuePass} />
                <TextInput
                    onChangeText={text => setValuePass2(text)} 
                    placeholder='Let fill your Password again!!' 
                    placeholderTextColor='#BBB'
                    style={styles.input} 
                    value={valuePass2} />
                <RadioButton.Group
                    onValueChange={value => setChecked(value)}
                    value={checked}
                >
                    <View  style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Text>Male</Text>
                            <RadioButton value="male" status={ checked === 'male' ? 'checked' : 'unchecked' } />
                        </View>
                        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Text>Female</Text>
                            <RadioButton value="female" status={ checked === 'female' ? 'checked' : 'unchecked' } />
                        </View>
                    </View>
                </RadioButton.Group>
                <Button title='Register' onPress={handleClick} />
            </View>
        </View>
        : <ActivityIndicator color='#0f0' size='large' />
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 'auto',
        maxHeight: 400,
    },
    input: {
        height: 40,
        width: 200,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#666',
        marginBottom: 10
    }
})