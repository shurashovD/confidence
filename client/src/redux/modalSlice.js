import { createSlice } from "@reduxjs/toolkit"

export const modalSlice = createSlice({
    name: 'modal',
    initialState: {
        type: null, text: null, show: false
    },
    reducers: {
        show: (state, {payload}) => ({...state, text: payload.text, type: payload.type, show: true}),
        hide: (state) => ({...state, show: false})
    }
})

export const { show, hide } = modalSlice.actions

export default modalSlice.reducer