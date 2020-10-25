import Logger from '@harmonyjs/logger'
import VehicleService from '../../services/vehicle'

const logger = Logger({
    name: 'GetVehiclesAPI',
    configuration: {
        console: true,
    },
})

const VehiclesRoute = async (server : any, opts : any, next: () => void) => {
    server.route({
        method: 'GET',
        url: '/vehicles',
        // preHandler: server.auth([server.authenticateAccount]),
        schema: {
            response: {
                200: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: {type: 'string'},
                            name: {type: 'string'},
                            vehicle: {type: 'string'},
                            speed: {type: 'number'},
                            temperature: {type: 'number'},
                            plate: {type: 'string'},
                            online: {type: 'boolean'},
                            location: {
                                type: 'array',
                                items: {
                                    type: 'number'
                                }
                            },
                            updatedAt: {type: 'string'}
                        }
                    }
                },
            },
        },
        async handler(req: any, res: any) {
            return VehicleService.vehicles
        },
    })
    next()
}

export default VehiclesRoute
