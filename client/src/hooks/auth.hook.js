import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setAuth } from "../redux/authSlice"
import { registerReset } from "../redux/registerSlice"

export const useAuth = () => {
    const { auth } = useSelector(state => state)
    const dispatch = useDispatch()

    const id = auth.id

    const storageName = 'confidence'

    const login = useCallback(({_id, role, name, avatar}) => {
        dispatch(setAuth({_id, role, name, avatar}))
        localStorage.setItem(storageName, JSON.stringify({id: _id, role, name, avatar}))
    }, [dispatch])

    const logout = useCallback(() => {
        dispatch(registerReset())
        dispatch(setAuth({_id: null, role: null, name: null, avatar: null}))
        localStorage.removeItem(storageName)
    }, [dispatch])

    const checkAuth = useCallback(() => {
        const data = JSON.parse(localStorage.getItem(storageName))
        if ( data && data.role && data.id ) {
            login({_id: data.id, role: data.role, name: data.name, avatar: data.avatar})
        }
    }, [login])

    return { login, logout, id, checkAuth }
}