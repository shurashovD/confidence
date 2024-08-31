import { useCallback, useEffect, useState } from "react"
import { Loader } from "../components/Loader"
import { Navbar } from "../components/Navbar"
import { useDictionary } from "../hooks/dictionary.hook"
import { useHttp } from "../hooks/http.hook"

export const RegisterListPage = () => {
    const [list, setList] = useState([])
    const { dg } = useDictionary()
    const { clearError, error, request, isLoading } = useHttp()

    const links = [
        {title: dg('registration'), to: '/register'}
    ]

    const getList = useCallback( async () => {
        try {
            const response = await request('/api/notes/register-list')
            setList(response)
        }
        catch {}
    }, [request])

    useEffect(getList, [getList])

    return (
        <div className="container-fluid min-vh-100 p-0 m-0 d-flex flex-column">
            { isLoading && <Loader /> }
            <Navbar links={links} />
            {!isLoading && <table className="table text-primary">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Category</th>
                        <th scope="col">RFID</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map(({ number, master, category, rfid, completed }, index) => (
                        <tr key={index}>
                            <td>{number}</td>
                            <td>{master.name}</td>
                            <td>{dg(category)}</td>
                            <td>{completed ? "-" : rfid}</td>
                        </tr>
                    ))}
                </tbody>
            </table>}
            
        </div>
    )
}