import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/Retinopathy/NextScreening';
import RetinClinicLoc from './screens/RetinClinicLoc';
import Diabatic from './screens/Diabatic/Diabatic';
import DiabaticResult from './screens/Diabatic/DiabaticResult';
import Retinopathy from './screens/Retinopathy/Retinopathy';
import RetinopathyResult from './screens/Retinopathy/RetinopathyResult';
import HealthTips from './screens/Retinopathy/HealthTips';
import NextScreening from './screens/Retinopathy/NextScreening';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Retinopathy" component={Retinopathy} />
        <Stack.Screen name="RetinopathyResult" component={RetinopathyResult} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Locations" component={RetinClinicLoc} />
        <Stack.Screen name="ResultScreen" component={DiabaticResult} />
        <Stack.Screen name="Diabatic" component={Diabatic} />
        <Stack.Screen name="HealthTips" component={HealthTips} />
        <Stack.Screen name="NextScreening" component={NextScreening} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
