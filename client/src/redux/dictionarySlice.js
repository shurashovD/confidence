import { createSlice } from "@reduxjs/toolkit"

export const dictionarySlice = createSlice({
    name: 'dictionary',
    initialState: {},
    reducers: {
        setDictionary: (state, {payload}) => ({...state, dictionary: payload})
    }
})

export const {setDictionary} = dictionarySlice.actions

export default dictionarySlice.reducer