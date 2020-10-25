import React from 'react'
import { observer } from 'mobx-react'

import { classNamesPrefix } from 'utils/react'

import state from 'state'

import { useCallback } from 'hooks'

import { IconTruck, IconLocation } from 'components/shared/icons'

import './vehicle.scss'
import { Button } from '../inputs'

const block = 'driver'
const cx = classNamesPrefix(block)

type DriverProps = {
    id: string,
    name: string,
    vehicle: string,
    location: number[],
    online: boolean,
}

const Vehicle = observer(({ id, name, vehicle, location, online }
    : DriverProps) => {

    return (
        <div className={block}>

            { /* Info (name, vehicle and update time */ }
            <div className={cx('__group', '__vehicle', {
                'no-mobile': !name,
            })}
            >
                <IconTruck className={cx('__icon', '__vehicle-icon')} />
                <div className={cx('__column', '__vehicle-info')}>
                    <div className={cx('__vehicle-name')}>
                        {name}
                    </div>
                    <div className={cx('__vehicle-description')}>
                        {vehicle}
                    </div>
                </div>
            </div>

            { /* Location */ }
            <div className={cx('__group', '__location', { '__location--hidden': !location })}>
                <IconLocation className={cx('__icon', '__location-icon')} />
                <div className={cx('__column', '__location-info')}>
                    <div className={cx('__location-theme')}>
                        {parseFloat(location[0].toFixed(3))}
                        {', '}
                        {parseFloat(location[1].toFixed(3))}
                    </div>
                </div>
            </div>

            { /* Buttons ([Online|Offline]) */ }
            <div className={cx('__group', '__buttons')}>
                <Button onClick={() => state.vehicles.setOnline(id, state)}>
                    Connecter
                </Button>
            </div>

        </div>
    )
})

export default Vehicle
