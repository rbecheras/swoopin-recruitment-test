import Logger from '@harmonyjs/logger'
import VehicleService from '../../../services/vehicle'

const logger = Logger({
    name: 'SetVehicleOnlineAPI',
    configuration: {
        console: true,
    },
})

const INTERNALE_ERROR = { statusCode: 500, error: 'Internal Server Error' }

const SetVehicleOnlineRoute = async (server : any, opts : any, next: () => void) => {
    server.route({
        method: 'POST',
        url: '/vehicles/online/:vehicleId',
        preHandler: server.auth([server.authenticateAccount]),
        schema: {
            params: {
                vehicleId: {type: 'string'}
            },
            response: {
                200: {
                    type: 'object',
                    properties: {},
                },
                500: {
                    type: 'object',
                    properties: {
                        statusCode: { type: 'number' },
                        error: { type: 'string' }
                    }
                },
            },
        },
        async handler(req: any, res: any) {
            const {vehicleId} = req.params
            try {
                VehicleService.setOnlineState(vehicleId, true)
            } catch (err) {
                throw INTERNALE_ERROR
            }
            return {}
        },
    })
    next()
}

export default SetVehicleOnlineRoute
