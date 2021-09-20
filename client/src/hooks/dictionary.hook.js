import { useCallback, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setDictionary } from "../redux/dictionarySlice"
import { useHttp } from "./http.hook"

export const useDictionary = () => {
    const { auth, dictionary } = useSelector(state => state)
    const dispatch = useDispatch()
    const { request } = useHttp()

    const dg = useCallback(keyParam => {
        try {
            const engPhrase = dictionary.dictionary.find(({key, lang}) => (lang === 'EN' && key === keyParam))?.phrase
            const phrase = dictionary.dictionary.find(({key, lang}) => (lang === auth.lang && key === keyParam))?.phrase ?? engPhrase
            return phrase ?? '???'
        }
        catch {
            return '???'
        }
    }, [auth.lang, dictionary.dictionary])

    const getDictionary = useCallback(async () => {
        try {
            const result = await request('/api/dictionary/get-dictionary')
            dispatch(setDictionary(result))
        }
        catch {}
    }, [dispatch, request])

    useEffect(() => {
        getDictionary()
    }, [getDictionary])
    
    return { dg, getDictionary }
}