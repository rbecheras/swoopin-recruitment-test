import React from 'react'
import { observer } from 'mobx-react'

import { classNamesPrefix } from 'utils/react'

import state from 'state'

import { useCallback } from 'hooks'

import { IconTruck, IconLocation, IconSpeed, IconTemperature } from 'components/shared/icons'

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
    speed: number,
    temperature: number,
}

const Vehicle = observer(({ id, name, vehicle, plate, location, online, speed, temperature }
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
                        {vehicle} ({plate})
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

            <div className={cx('__group', '__speed', { '__speed--hidden': !speed })}>
                <IconSpeed className={cx('__icon', 'speed-icon')} />
                <div className={cx('__column', '__speed-info')}>
                    <div className={cx('__speed-theme')}>
                        {speed}
                    </div>
                </div>
            </div>

            <div className={cx('__group', '__temperature', { '__temperature--hidden': !temperature })}>
                <IconTemperature className={cx('__icon', '__temperature-icon')} />
                <div className={cx('__column', '__temperature-info')}>
                    <div className={cx('__temperature-theme')}>
                        {temperature}
                    </div>
                </div>
            </div>

            { /* Buttons ([Online|Offline]) */ }
            <div className={cx('__group', '__buttons')}>
            <Button
                    className={cx('__button', { '__button--hidden': online })}
                    onClick={() => state.vehicles.setOnline(id, state)}
                >
                    Connecter
                </Button>
                <Button
                    className={cx('__button', { '__button--hidden': !online })}
                    onClick={() => state.vehicles.setOffline(id, state)}
                    >
                    Déconnecter
                </Button>
            </div>

        </div>
    )
})

export default Vehicle
