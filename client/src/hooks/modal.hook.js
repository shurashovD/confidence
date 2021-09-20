import { useCallback } from "react"
import { useDispatch } from "react-redux"
import { show } from "../redux/modalSlice"
import { MODAL_ERROR, MODAL_REGISTER, MODAL_SCORE, MODAL_SUCCESS } from "../redux/modalTypes"

export const useModal = () => {
    const dispatch = useDispatch()

    const successModal = useCallback(text => {
        dispatch(show({ text, type: MODAL_SUCCESS }))
    }, [dispatch])

    const errorModal = useCallback(text => {
        dispatch(show({ text, type: MODAL_ERROR }))
    }, [dispatch])

    const registerModal = useCallback(text => {
        dispatch(show({ text, type: MODAL_REGISTER }))
    }, [dispatch])

    const scoreModal = useCallback(text => {
        dispatch(show({ text, type: MODAL_SCORE }))
    }, [dispatch])

    return { successModal, errorModal, registerModal, scoreModal }
}