import {
    observable, action, computed, autorun, when,
} from 'mobx'
import { now } from 'mobx-utils'

import {moment, base64, axios} from 'utils/misc'
import {AxiosInstance} from "axios";

type Vehicle = {
    id: string,
    name: string,
    vehicle: string,
    location: number[],
    online: boolean,
}

const vehicleTypes: any = {
    truck: 'Camion',
}

export default class StateVehicles {
    @observable list: Vehicle[] = []

    @observable configuration: any

    @observable selectedVehicleId: string | null = null

    api: AxiosInstance | null = null

    session: any = null

    constructor(session: any, configurationPromise: any) {
        this.session = session

        if (typeof window !== 'undefined') {
            configurationPromise.then((configuration: any) => {
                this.configuration = configuration

                // Create API client
                this.api = axios.create({
                    baseURL: `${this.configuration.endpoint.host}`,
                    timeout: 10000,
                    headers: { 'Content-Type': 'application/json' },
                    responseType: 'json',
                })

                autorun(() => {
                    if (session.online && session.token) {
                        this.updateVehicles(session).then(() => {})
                    }
                })

                autorun(() => {
                    now(1000)
                    if (session.online && session.token) {
                        this.updateVehicles(session).then(() => {})
                    }
                })

                when(() => session.token, () => {
                    this.updateVehicles(session).then(() => {})
                })
            })
        }
    }

    @action.bound async updateVehicles(session: any) {
        const {data: vehicles} = await this.api({
            url: 'vehicles',
            method: 'get',
            headers: { Authorization: `Bearer ${session.token}` }
        })
        this.updateList(vehicles)
    }

    @action.bound updateList(vehicles: any[]) {
        this.list = vehicles
            .slice()
            .sort((v1: Vehicle, v2: Vehicle) => v1.name.toLowerCase().localeCompare(v2.name.toLowerCase()))
            .map((vehicle: any) => {
                return {
                    ...vehicle,
                    vehicle: vehicleTypes[vehicle.vehicle] ? vehicleTypes[vehicle.vehicle] : 'Inconnu',
                }
            })
    }

    @action.bound selectVehicle(id: string) {
        this.selectedVehicleId = id
    }

    @action.bound async setOnline(id: string, session: any) {
        try {
            this.api({
                method: 'post',
                url: `/vehicles/online/${id}`,
                headers: { Authorization: `Bearer ${session.token}` },
            })
        } catch (err) {
            console.error(err)
            console.error(err.message)
        }
    }

    @computed get all() : Vehicle[] {
        return this.list
    }

    @computed get online() : Vehicle[] {
        return this.list.filter((vehicle: any) => vehicle.online)
    }

    @computed get selectedVehicle() : Vehicle | null {
        if (this.selectedVehicleId) {
            const vehicle = this.list.find((vehicle: any) => vehicle.id === this.selectedVehicleId)
            if (vehicle) {
                return vehicle
            }
        }
        return null
    }
}
