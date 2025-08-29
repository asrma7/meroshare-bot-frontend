import { useEffect, useState } from 'react'

interface Capital {
    code: string
    id: number
    name: string
}

const useCapitalOptionsHandler = () => {
    const [capitalOptions, setCapitalOptions] = useState<{ value: string; label: string }[]>([])
    const [isCapitalOptionsLoading, setIsCapitalOptionsLoading] = useState(true)

    useEffect(() => {
        const fetchCapitals = async () => {
            try {
                const response = await fetch('https://webbackend.cdsc.com.np/api/meroShare/capital')
                const capitals = await response.json()
                const capitalOptions = capitals.map((capital: Capital) => ({
                    value: capital.id,
                    label: capital.name
                }))
                setCapitalOptions(capitalOptions)
                setIsCapitalOptionsLoading(false)
            } catch (error) {
                console.error(error)
                setIsCapitalOptionsLoading(false)
            }
        }

        fetchCapitals()
    }, [])

    return { capitalOptions, isCapitalOptionsLoading }
}

export default useCapitalOptionsHandler