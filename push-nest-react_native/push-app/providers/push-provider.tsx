import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { usePushNotifications } from "../hooks/use-push-notifications"

export function PushProvider({ children }: any) {
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    console.log('Carregando usuário... no provider')
    loadUser()
  }, [])

  async function loadUser() {
    const token = await AsyncStorage.getItem('token')

    // 👉 aqui você pode trocar por JWT decode depois
    if (token) {
      setUserId(token)
    }
  }

  console.log('User ID no provider:', userId)

  usePushNotifications(userId || undefined)

  return children
}