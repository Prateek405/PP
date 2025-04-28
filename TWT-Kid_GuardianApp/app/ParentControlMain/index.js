import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../ParentControl/HomeScreen/homeScreen";
import ChildLocation from "../ParentControl/childLocation/childLocation";
import Geofencing from "../ParentControl/Parent_Control/Geofencing";
import GeofenceEditor from "../ParentControl/Parent_Control/GeoFenceEditor";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Geofencing"
        component={Geofencing}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GeofenceEditor"
        component={GeofenceEditor}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChildLocation"
        component={ChildLocation}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default App;
