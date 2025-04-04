import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Welcome from '../pages/Welcome'
import SignIn from '../pages/Signin'
import CadastroAnimal from "../pages/CadastroAnimal";
import Register from "../pages/Register"
import ForgotPassword from "../pages/ForgotPassword"

const Stack = createNativeStackNavigator();

export default function Routes(){
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="Welcome"
                component={Welcome}
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

        </Stack.Navigator>

        
    )
}
