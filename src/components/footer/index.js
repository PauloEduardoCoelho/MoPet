import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function FooterTabBar(props) {
  const { state, descriptors, navigation } = props || {};
  const insets = useSafeAreaInsets();

  if (!state?.routes || !descriptors || !navigation) {
    return null;
  }

  const defaultIcon = (routeName) => {
    switch (routeName) {
      case 'CadastroAnimal':
        return 'plus-box';
      case 'AnimalList':
        return 'format-list-bulleted';
      case 'Home':
        return 'home';
      case 'Analise':
        return 'chart-bar';
      case 'Campanhas':
        return 'calendar-check';
      case 'PerfilHome':
      case 'Perfil':
        return 'account';
      default:
        return 'dots-horizontal';
    }
  };

  return (
    <SafeAreaView edges={['bottom']} style={{ backgroundColor: '#fff' }}>
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        {state.routes.map((route, index) => {
          const descriptor = descriptors[route.key] || {};
          const options = descriptor.options || {};
          const isFocused = state.index === index;

          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const color = isFocused ? '#D69A3A' : '#8c8c8c';

          // Usa o tabBarIcon se existir; senão cai no padrão por nome da rota
          const iconElement =
            typeof options.tabBarIcon === 'function'
              ? options.tabBarIcon({ focused: isFocused, color, size: 24 })
              : <Icon name={defaultIcon(route.name)} size={24} color={color} />;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tab}
              activeOpacity={0.7}
            >
              {iconElement}
              <Text style={[styles.label, isFocused && styles.labelFocused]} numberOfLines={1}>
                {typeof label === 'string' ? label : route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
    paddingTop: 8,
    paddingTop: 6,
    paddingHorizontal: 8,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 10,
  },        
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    color: '#8c8c8c',
    fontWeight: '600',
  },
  labelFocused: {
    color: '#D69A3A',
  },
});