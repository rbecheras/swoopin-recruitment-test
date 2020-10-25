import Logger from '@harmonyjs/logger'
import VehicleService from '../../../services/vehicle'

const logger = Logger({
    name: 'GetVehiclesAPI',
    configuration: {
        console: true,
    },
})

const INTERNALE_ERROR = { statusCode: 500, error: 'Internal Server Error' }

const SetVehicleOfflineRoute = async (server : any, opts : any, next: () => void) => {
    server.route({
        method: 'POST',
        url: '/vehicles/offline/:vehicleId',
        // preHandler: server.auth([server.authenticateAccount]),
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
                VehicleService.setOnlineState(vehicleId, false)
            } catch (err) {
                throw INTERNALE_ERROR
            }
            return {}
        },
    })
    next()
}

export default SetVehicleOfflineRoute
