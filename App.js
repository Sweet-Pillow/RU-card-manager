import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Card from "./screens/Card"
import Scan from "./screens/Scan"
import About from "./screens/About"

const Tab = createBottomTabNavigator();

export default function bottomTabNavigator() {

    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size }) => {
                        let iconName;

                        if (route.name === 'Card') {
                            iconName = 'card-outline';
                        } else if (route.name === 'Scan') {
                            iconName = 'search-outline';
                        } else if (route.name === 'About') {
                            iconName = 'person-outline';
                        }

                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: 'blue',
                    tabBarInactiveTintColor: 'gray',
                })}
            >
                <Tab.Screen name="Card" component={Card} />
                <Tab.Screen name="Scan" component={Scan} />
                <Tab.Screen name="About" component={About} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}