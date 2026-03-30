import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Home() {
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadToken()
  }, [])

  const loadToken = async () => {
    try {
      const savedToken = await AsyncStorage.getItem('token')
      setToken(savedToken)
    } catch (error) {
      console.error('Erro ao carregar token:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token')
      router.replace('/')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela Principal</Text>

      <View style={styles.tokenContainer}>
        <Text style={styles.label}>Token salvo:</Text>
        <Text style={styles.token}>{token || 'Nenhum token encontrado'}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  tokenContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    fontWeight: '600',
  },
  token: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'monospace',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
})
