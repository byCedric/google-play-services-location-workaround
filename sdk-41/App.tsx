import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [permission, requestPermission] = useForegroundPermission();
  const [location, setLocation] = useState<Location.LocationObject | null | undefined>(undefined);

  const onLocation = useCallback(async () => {
    setLocation(null);
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.LocationAccuracy.Low,
      });
      console.log('LOCATION RECEIVED', location);
      setLocation(location);
    } catch (error) {
      console.error('LOCATION ERROR', error);
    }
  }, []);

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text>We need access to your location</Text>
        <Button onPress={requestPermission} title="Grant permission" />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Load up your current location!</Text>
      <Button onPress={onLocation} disabled={location === null} title="Get Location" />
      {!!location && <Text>{JSON.stringify(location, null, 2)}</Text>}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function useForegroundPermission(): [Location.LocationPermissionResponse | null, () => void] {
  const [permission, setPermission] = useState<Location.LocationPermissionResponse | null>(null);

  const getPermission = useCallback(() => {
    Location.getForegroundPermissionsAsync()
      .then(setPermission)
      .catch((error) => console.error('LOCATION PERMISSION ERROR', error));
  }, [setPermission]);

  const requestPermission = useCallback(() => {
    Location.requestForegroundPermissionsAsync()
      .then(setPermission)
      .catch((error) => console.error('LOCATION PERMISSION ERROR', error));
  }, [setPermission]);

  useEffect(() => getPermission(), []);

  return [permission, requestPermission];
}
