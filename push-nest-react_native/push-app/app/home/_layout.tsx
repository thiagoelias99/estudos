import { Slot } from "expo-router"
import { PushProvider } from "../../providers/push-provider"

export default function Layout() {
  return (
    <PushProvider>
      <Slot />
    </PushProvider>
  )
}