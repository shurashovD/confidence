import { createSlice } from "@reduxjs/toolkit"

export const adminSlice = createSlice({
    name: 'adminState',
    initialState: {
        userId: null,
        competitionId: null,
    },
    reducers: {
        setUserId: (state, {payload}) => ({...state, userId: payload}),
        setCompetitionId: (state, {payload}) => ({...state, competitionId: payload}),
    }
})

export const { setCompetitionId, setUserId } = adminSlice.actions

export default adminSlice.reducer