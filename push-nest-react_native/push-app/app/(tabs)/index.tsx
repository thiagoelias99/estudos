import { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, Alert } from 'react-native'
import messaging from '@react-native-firebase/messaging'
import Clipboard from '@react-native-clipboard/clipboard'

export default function HomeScreen() {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    requestPermission()
    getToken()
  }, [])

  async function requestPermission() {
    const authStatus = await messaging().requestPermission()

    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL

    if (!enabled) {
      Alert.alert('Permissão negada para notificações')
    }
  }

  async function getToken() {
    try {
      const fcmToken = await messaging().getToken()
      console.log('FCM TOKEN:', fcmToken)
      setToken(fcmToken)
    } catch (error) {
      console.log('Erro ao pegar token:', error)
    }
  }

  function copyToken() {
    if (!token) return
    Clipboard.setString(token)
    Alert.alert('Token copiado!')
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#0f172a',
        padding: 20,
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          fontSize: 22,
          fontWeight: 'bold',
          color: 'white',
          marginBottom: 20,
        }}
      >
        🔔 FCM Token
      </Text>

      <TouchableOpacity onPress={copyToken} activeOpacity={0.8}>
        <Text
          selectable
          style={{
            color: '#38bdf8',
            fontSize: 12,
            backgroundColor: '#1e293b',
            padding: 12,
            borderRadius: 8,
          }}
        >
          {token || 'Carregando token...'}
        </Text>
      </TouchableOpacity>

      <Text
        style={{
          color: '#94a3b8',
          marginTop: 10,
          fontSize: 12,
        }}
      >
        (Toque para copiar)
      </Text>
    </View>
  )
}