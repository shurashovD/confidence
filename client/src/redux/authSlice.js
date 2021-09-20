import { createSlice } from "@reduxjs/toolkit"

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        lang: window.clientInformation.language.toUpperCase() || 'EN'
    },
    reducers: {
        setLang: (state, {payload}) => ({...state, lang: payload}),
        setAuth: (state, {payload}) => ({...state, id: payload._id, role: payload.role, name: payload.name, avatar: payload.avatar})
    }
})

export const { setLang, setAuth } = authSlice.actions

export default authSlice.reducer