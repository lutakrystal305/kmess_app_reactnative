import React from 'react';
import { View, Image, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/Home.Screen';
import MessageScreen from '../screens/Message.Screen';
import SignInScreen from '../screens/SignIn.Screen';
import CommunityScreen from '../screens/Community.Screen';
import ProfileScreen from '../screens/Profile.Screen';
import AddGroup from '../components/chat/AddGroup';
import Search from '../components/chat/SearchGroup';
import SearchGroup from '../components/chat/SearchGroup';
import FindRoomScreen from '../screens/FindRoom.Screen';
import CreateRoomScreen from '../screens/CreateRoom.Screen';
import GuestProfileScreen from '../screens/GuestProflie.Screen';
import ItemGroupScreen from '../screens/ItemGroup.Screen';
import TitleMessGroup from '../components/chat/TitleMessGroup';



const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
export const AuthStack = () => {
    return(
      <Stack.Navigator >
          <Stack.Screen name='Signin' component={SignInScreen}  options={{ title: 'Sign In' }} />
      </Stack.Navigator>
    )
  }
  const CommunityStack = () => {
    return(
      <Stack.Navigator >
          <Stack.Screen name='CommunityStack' component={CommunityScreen}  
          options={({ navigation }) => ({ headerLeft: () => <AddGroup onPress={() => navigation.navigate('CreateStack')} />,
                     title: 'Community',
                     headerRight: () => <SearchGroup onPress={() => navigation.navigate('FindStack')} />
                     })} />
          <Stack.Screen name='GuestProfileStack' component={GuestProfileScreen}  options={({ route }) => ({ title: route.params.x.name })}/>           
      </Stack.Navigator>
    )
  }
  const ProfileStack = () => {
    return(
      <Stack.Navigator >
          <Stack.Screen name='GuestProfileStack' component={ProfileScreen}  options={{ title: 'Profile' }} />
      </Stack.Navigator>
    )
  }
  
  const HomeStack = ({ navigation, route }) => {
    React.useLayoutEffect(() => {
      const routeName = getFocusedRouteNameFromRoute(route);
      if (routeName == 'Message') {
        navigation.setOptions({tabBarVisible: false});
      } else {
        navigation.setOptions({tabBarVisible: true});
      }
    }, [navigation, route]);
    return(
    <Stack.Navigator initialRouteName='HomeStack'>
      <Stack.Screen name='HomeStack' component={HomeScreen}
        options={({ navigation }) => ({headerLeft: () => <AddGroup onPress={() => navigation.navigate('CreateStack')} />,
        title: 'Home',
        headerRight: () => <SearchGroup onPress={() => navigation.navigate('FindStack')} />
        })} />
      <Stack.Screen name='Message' component={MessageScreen}  options={({ route, navigation }) => ({headerTitle: () => <TitleMessGroup onPress={() => navigation.navigate('ItemGroupStack', {name: route.params.name})} name={route.params.name} avt={route.params.avt} />, tabBarVisible: false })} />
      <Stack.Screen name='ItemGroupStack' component={ItemGroupScreen}  options={({ route }) => ({ title: route.params.name, tabBarVisible: false })} />
      <Stack.Screen name='CreateStack' component={CreateRoomScreen}  options={{ title: 'Create new group' }} />
      <Stack.Screen name='FindStack' component={FindRoomScreen}  options={{ title: 'Find group' }} />
    </Stack.Navigator>
    )
  }
  export const AppStack = () => {
    return (
    <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
              } else if (route.name === 'Community') {
                iconName = focused ? 'earth' : 'earth-outline';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'star' : 'star-outline';
              }

              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
          tabBarOptions={{
            activeTintColor: 'green',
            inactiveTintColor: 'gray',
          }}
        >
          <Tab.Screen name='Home' component={HomeStack} />
          <Tab.Screen name='Community' component={CommunityStack} />
          <Tab.Screen name='Profile' component={ProfileStack} />
        </Tab.Navigator>
    )
  }