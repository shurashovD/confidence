import { createSlice } from "@reduxjs/toolkit"

const init = {
    name: '',
    mail: '',
    category: null,
    masterId: null
}

export const registerSlice = createSlice({
    name: 'registerState',
    initialState: init,
    reducers: {
        registerSetName: (state, {payload}) => ({...state, name: payload, masterId: null}),
        registerSetMail: (state, {payload}) => ({...state, mail: payload}),
        registerSetCategory: (state, {payload}) => ({...state, category: payload}),
        registerSetMasterId: (state, {payload}) => ({...state, name: payload.name, mail: payload.mail, masterId: payload.masterId}),
        registerReset: () => init
    }
})

export const { registerSetName, registerSetMail, registerSetCategory, registerSetMasterId, registerReset } = registerSlice.actions

export default registerSlice.reducer