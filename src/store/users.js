import { create } from 'zustand'

export const useStore = create((set) => ({
  users: [],
  setUsers: (users) => set(() => ({ users }))
}))