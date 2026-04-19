import { configureStore, createSlice } from '@reduxjs/toolkit'

const dummySlice = createSlice({
  name: 'dummy',
  initialState: { value: 0 },
  reducers: {}
})

export const store = configureStore({
  reducer: {
    dummy: dummySlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
