import { configureStore } from '@reduxjs/toolkit'
import adminSlice from './adminSlice'
import authReducer from './authSlice'
import dictionarySlice from './dictionarySlice'
import modalSlice from './modalSlice'
import registerSlice from './registerSlice'

export const store = configureStore({
    reducer: {
        adminState: adminSlice,
        auth: authReducer,
        dictionary: dictionarySlice,
        modal: modalSlice,
        registerState: registerSlice
    }
})