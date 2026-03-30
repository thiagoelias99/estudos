import { useEffect } from 'react'
import messaging from '@react-native-firebase/messaging'
import { Platform } from 'react-native'

export function usePushNotifications(userId?: string) {
  useEffect(() => {
    console.log('usePushNotifications - userId:', userId)
    if (!userId) return

    init(userId)

    // 🔁 refresh do token
    const unsubscribeToken = messaging().onTokenRefresh((token) => {
      console.log('Token refreshed:', token)
      registerDevice(userId, token)
    })

    // 🔔 notificação em foreground
    const unsubscribeMessage = messaging().onMessage(async (msg) => {
      console.log('Push recebido foreground:', msg)
    })

    // 🧹 cleanup (IMPORTANTE)
    return () => {
      unsubscribeToken()
      unsubscribeMessage()
    }
  }, [userId])
}

async function init(userId: string) {
  console.log('Inicializando push notifications para userId:', userId)
  await requestPermission()

  console.log('Obtendo token FCM...')

  const token = await messaging().getToken()
  console.log('FCM TOKEN:', token)

  await registerDevice(userId, token)

  console.log('Push notifications inicializadas com sucesso')
}

async function requestPermission() {
  console.log('Solicitando permissão para push notifications...')
  const authStatus = await messaging().requestPermission()

  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL

  console.log('Status da permissão:', authStatus)

  if (!enabled) {
    console.log('Permissão negada')
  }

  console.log('Permissão concedida:', enabled)
}

async function registerDevice(userId: string, token: string) {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL as string

  console.log('Registrando device no backend...', { userId, token, platform: Platform.OS })

  try {
    await fetch(`${apiUrl}/register-device`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        token,
        platform: Platform.OS,
      }),
    })
  } catch (error) {
    console.log('Erro ao registrar device:', error)
  }
}