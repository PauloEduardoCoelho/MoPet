import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Auth
import Access from '../pages/Access';
import SignIn from '../pages/Signin';
import Register from '../pages/Register';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import ResetPassword from '../pages/Auth/ResetPassword';

import Home from '../pages/Home';
import PerfilHome from '../pages/Perfil/PerfilHome';
import Campanhas from '../pages/Campanhas';

import AnimalList from '../pages/AnimalList';
import PetDetail from '../pages/PetDetail';
import EditPet from '../pages/EditPet';
import MeusAnimais from '../pages/Perfil/MeusAnimais';
import CadastroAnimal from '../pages/CadastroAnimal';
import EditarDados from '../pages/Perfil/EditarDados';
import AlterarSenha from '../pages/Perfil/AlterarSenha';

import FooterTabBar from '../components/footer';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}
      tabBar={(props) => <FooterTabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size = 24 }) => <Icon name="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Campanhas"
        component={Campanhas}
        options={{
          tabBarLabel: 'Campanhas',
          tabBarIcon: ({ color, size = 24 }) => <Icon name="calendar-star" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilHome}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size = 24 }) => <Icon name="account" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function Routes({ userLogged }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Access" component={Access} />
      <Stack.Screen name="SignIn" component={SignIn} initialParams={{ userLogged }} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />

      <Stack.Screen name="AppTabs" component={AppTabs} />

      <Stack.Screen name="MeusAnimais" component={MeusAnimais} />
      <Stack.Screen name="EditarDados" component={EditarDados} />
      <Stack.Screen name="AlterarSenha" component={AlterarSenha} />
      <Stack.Screen name="CadastroAnimal" component={CadastroAnimal} />
      <Stack.Screen name="PetDetail" component={PetDetail} />
      <Stack.Screen name="EditPet" component={EditPet} />
      <Stack.Screen name="AnimalList" component={AnimalList} />
    </Stack.Navigator>
  );
}