import { createSlice } from '@reduxjs/toolkit'
import storageService from '../services/storage'

const slice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    sSetUser(state, action) {
      return action.payload
    },
    sRemoveUser() {
      return null
    },
  },
})

export const setUser = (user) => {
  return async (dispatch) => {
    await storageService.saveUser(user)
    dispatch(sSetUser(user))
  }
}

export const removeUser = () => {
  return async (dispatch) => {
    await storageService.removeUser()
    dispatch(sRemoveUser())
  }
}

export const { sSetUser, sRemoveUser } = slice.actions
export default slice.reducer
