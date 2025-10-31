import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Map, List } from 'lucide-react-native';

type ViewMode = 'map' | 'list';

interface ViewToggleProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export default function ViewToggle({ activeView, onViewChange }: ViewToggleProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => onViewChange('map')}
        style={[
          styles.button,
          activeView === 'map' && styles.buttonActive
        ]}
        activeOpacity={0.7}
      >
        <Map 
          size={18} 
          color={activeView === 'map' ? '#000' : '#6B7280'} 
        />
        <Text 
          style={[
            styles.text,
            activeView === 'map' ? styles.textActive : styles.textInactive
          ]}
        >
          Bản đồ
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onViewChange('list')}
        style={[
          styles.button,
          activeView === 'list' && styles.buttonActive
        ]}
        activeOpacity={0.7}
      >
        <List 
          size={18} 
          color={activeView === 'list' ? '#000' : '#6B7280'} 
        />
        <Text 
          style={[
            styles.text,
            activeView === 'list' ? styles.textActive : styles.textInactive
          ]}
        >
          Danh sách
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  text: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  textActive: {
    color: '#111827',
  },
  textInactive: {
    color: '#6B7280',
  },
});
