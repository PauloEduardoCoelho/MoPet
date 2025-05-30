import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Access from '../pages/Access'
import SignIn from '../pages/Signin'
import CadastroAnimal from "../pages/CadastroAnimal";
import Register from "../pages/Register"
import ForgotPassword from "../pages/ForgotPassword"
import Home from "../pages/Home";
import AnimalList from "../pages/AnimalList";
import Building from "../screens/Building";
import PetDetail from '../pages/PetDetail';
import EditPet from '../pages/EditPet';

const Stack = createNativeStackNavigator();

export default function Routes(){
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="Access"
                component={Access}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="SignIn"
                component={SignIn}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Register"
                component={Register}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="ForgotPassword"
                component={ForgotPassword}
                options={{ headerShown: false }}
            />

            <Stack.Screen 
                name="CadastroAnimal"
                component={CadastroAnimal}
                options={{ headerShown: false }}
            />

            <Stack.Screen 
                name="Home"
                component={Home}
                options={{ headerShown: false }}
            />

            <Stack.Screen 
                name="AnimalList"
                component={AnimalList}
                options={{ headerShown: false }}
            />

            <Stack.Screen 
                name="Building"
                component={Building}
                options={{ headerShown: false }}
            />

            <Stack.Screen 
                name="PetDetail"
                component={PetDetail}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="EditPet"
                component={EditPet}
                options={{ headerShown: false }}
            />


        </Stack.Navigator>

        
    )
}
