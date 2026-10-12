import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { cores } from '../../theme';

const icone = (nome) =>
  function Icone({ color, size, focused }) {
    return <Ionicons name={focused ? nome : `${nome}-outline`} color={color} size={size} />;
  };

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: cores.tinta,
        tabBarInactiveTintColor: cores.seixo,
        tabBarLabelStyle: { fontFamily: 'Figtree_600SemiBold', fontSize: 11 },
        tabBarStyle: { backgroundColor: cores.branco, borderTopColor: cores.linha },
        sceneStyle: { backgroundColor: cores.papel },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Hoje', tabBarIcon: icone('sunny') }} />
      <Tabs.Screen name="leitura" options={{ title: 'Leitura', tabBarIcon: icone('book') }} />
      <Tabs.Screen name="grupos" options={{ title: 'Grupos', tabBarIcon: icone('people') }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: icone('person') }} />
    </Tabs>
  );
}
