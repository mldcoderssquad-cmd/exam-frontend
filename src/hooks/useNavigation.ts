import { useState } from 'react'
import type { Screen } from '@/types'

export type UseNavigationReturn = {
  screen: Screen
  previousScreen: Screen
  navigate: (screen: Screen) => void
}

export function useNavigation(initial: Screen = 'login'): UseNavigationReturn {
  const [screen, setScreen] = useState<Screen>(initial)
  const [previousScreen, setPreviousScreen] = useState<Screen>(initial)

  const navigate = (s: Screen) => {
    setPreviousScreen(screen)
    setScreen(s)
  }

  return { screen, previousScreen, navigate }
}
