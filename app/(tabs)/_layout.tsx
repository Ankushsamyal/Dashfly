import { Tabs, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ORANGE, DARK } from '../../src/constants/colors';
import { SPACING } from '../../src/constants/theme';
import * as Haptics from 'expo-haptics';

function CustomTabBar({ state, descriptors, navigation }: any) {
  const router = useRouter();
  const handleActivityPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.push('/activity/track');
  };

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        if (route.name === 'activity') {
          return (
            <TouchableOpacity key={route.key} style={styles.fabContainer} onPress={handleActivityPress} activeOpacity={0.8}>
              <View style={styles.fab}><Text style={styles.fabIcon}>+</Text></View>
            </TouchableOpacity>
          );
        }
        const onPress = () => {
          Haptics.selectionAsync();
          navigation.navigate(route.name);
        };
        return (
          <TouchableOpacity key={route.key} style={styles.tabItem} onPress={onPress} activeOpacity={0.7}>
            <Text style={[styles.tabIcon, isFocused && { transform: [{ scale: 1.1 }] }]}>{options.tabBarIcon?.({ focused: isFocused, color: isFocused ? ORANGE.primary : DARK.textTertiary, size: 24 })}</Text>
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>{options.title || route.name}</Text>
            {isFocused && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <CustomTabBar {...props} />}>
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: () => '🏠' }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore', tabBarIcon: () => '🔍' }} />
      <Tabs.Screen name="activity" options={{ tabBarIcon: () => null }} />
      <Tabs.Screen name="feed" options={{ title: 'Feed', tabBarIcon: () => '👥' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: () => '👤' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: { flexDirection: 'row', backgroundColor: DARK.surface, borderTopWidth: 1, borderTopColor: DARK.cardBorder, paddingBottom: SPACING.lg, paddingTop: SPACING.sm, alignItems: 'center', justifyContent: 'space-around' },
  tabItem: { alignItems: 'center', justifyContent: 'center', flex: 1, paddingVertical: SPACING.xs },
  tabIcon: { fontSize: 22, marginBottom: 2 },
  tabLabel: { fontSize: 10, color: DARK.textTertiary, fontWeight: '500' },
  tabLabelActive: { color: ORANGE.primary },
  tabIndicator: { position: 'absolute', bottom: -2, width: 20, height: 3, backgroundColor: ORANGE.primary, borderRadius: 1.5 },
  fabContainer: { alignItems: 'center', justifyContent: 'center', marginTop: -20 },
  fab: { width: 56, height: 56, borderRadius: 28, backgroundColor: ORANGE.primary, alignItems: 'center', justifyContent: 'center', shadowColor: ORANGE.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 6 },
  fabIcon: { fontSize: 32, color: '#FFFFFF', fontWeight: '300', lineHeight: 32 },
});
