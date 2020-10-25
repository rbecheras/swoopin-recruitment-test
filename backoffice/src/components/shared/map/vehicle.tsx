import React from 'react'
import { observer } from 'mobx-react'

import { classNamesPrefix } from 'utils/react'
import cx from 'classnames'

import './vehicle.scss'

const block = 'driver'

type DriverProps = {
    id: string,
    name: string,
    vehicle: string,
    plate: string,
    speed: number,
    temperature: number,
    online: boolean,
    onClick: () => void,
}

const Vehicle = observer(({ id, name, vehicle, plate, speed, temperature, online, onClick }
    : DriverProps) => {

    return (
        <div className={cx(block, {'driver__online': online})} onClick={() => onClick()}>
            <div>
                <div>
                    {name}
                </div>
                <div>
                    {vehicle} ({plate})
                </div>
                <div>
                    {speed} km/h - {temperature} °C
                </div>
            </div>
        </div>
    )
})

export default Vehicle
