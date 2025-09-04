import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function NoMoreConfusionPage() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Page is intentionally left blank with just the background color */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3E4DE',
  },
  contentContainer: {
    flex: 1,
  },
});

