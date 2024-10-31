import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';

const App = () => {
  const [dogImage, setDogImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;

  const fetchDogImage = async () => {
    setLoading(true);
    const headers = new Headers({
      "Content-Type": "application/json",
      "x-api-key": "DEMO-API-KEY"
    });

    const requestOptions = {
      method: 'GET',
      headers: headers,
      redirect: 'follow'
    };

    try {
      const response = await fetch("https://api.thedogapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=1", requestOptions);
      const result = await response.json();
      if (result && result.length > 0) {
        setDogImage(result[0].url); 
      }
    } catch (error) {
      console.error('Erro ao buscar imagem:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDogImage();
  }, []);


  const startSpinAnimation = () => {
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 800,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  const handleRefresh = () => {
    startSpinAnimation(); 
    fetchDogImage(); 
  };

 
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Imagem aleatória de um cachorro</Text>
      {dogImage ? (
        <Image source={{ uri: dogImage }} style={styles.image} />
      ) : (
        <Text>Carregando...</Text>
      )}

      {/* Botão para atualizar a imagem */}
      <TouchableOpacity onPress={handleRefresh} style={styles.button} disabled={loading}>
        <Animated.View style={[styles.iconContainer, { transform: [{ rotate: spin }] }]}>
          <Text style={styles.buttonText}>🔄</Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 18,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 24,
    color: '#fff',
  },
});

export default App;
