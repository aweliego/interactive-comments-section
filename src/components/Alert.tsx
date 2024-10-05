import { useEffect } from 'react'

import { AlertInterface } from '../types'

type AlertProps = {
    alerts: AlertInterface[]
    removeAlert: (id: number) => void
}

const Alert = ({
    alerts,
    removeAlert
}: AlertProps) => {

    useEffect(() => {
        const timeouts = alerts.map((alert) => {
            return setTimeout(() => {
                removeAlert(alert.id)
            }, 3000)
        })

        return () => {
            timeouts.forEach(timeout => clearTimeout(timeout))
        }
    }, [alerts, removeAlert])

    return (
        <div className="fixed bottom-5 right-5 space-y-2">
            {alerts.map((alert) => (
                <aside
                    key={alert.id}
                    className={`${alert.type === 'success' ? 'bg-primary-green-success' : 'bg-primary-red-soft'} text-white p-4 rounded shadow-lg`}
                >
                    {alert.text}
                </aside>
            ))}
        </div>
    )
}

export default Alert