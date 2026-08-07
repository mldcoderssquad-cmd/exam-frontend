import { useState } from 'react'

export function useSearch(initial = '') {
  const [search, setSearch] = useState(initial)
  return { search, setSearch }
}
