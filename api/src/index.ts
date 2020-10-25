import path from 'path'
import fs from 'fs'
import jsYaml from 'js-yaml'
import Fastify from 'fastify'
import FastifyCors from 'fastify-cors'
import FastifyAuth from 'fastify-auth'
import FastifyJWT from 'fastify-jwt'
import Logger, { ILogger } from '@harmonyjs/logger'

import AuthenticationService from 'services/authentication'
import EncryptionService from 'services/encryption'
import VehicleService from 'services/vehicle'

import ReadinessRoute from 'routes/readiness'
import GeneralStatusRoute from 'routes/general/status'
import GeneralVersionRoute from 'routes/general/version'
import VehiclesRoute from 'routes/vehicles/vehicles'
import VehiclesByIdRoute from 'routes/vehicles/online/vehicle'

import LoginRoute from 'routes/login'

async function loadLogger() {
    return Logger({
        name: 'ApplicationImport',
        configuration: {
            console: true,
        },
    })
}

async function loadConfiguration(confPath: string, logger : ILogger) {
    logger.info('Loading configuration')

    let confAsYaml = null

    try {
        confAsYaml = fs.readFileSync(confPath, 'utf-8')
    } catch (err) {
        logger.error('Unable to load configuration. Exiting.')
        process.exit(0)
    }
    const conf: any = jsYaml.safeLoad(confAsYaml)

    logger.info('Configuration loaded')

    return conf.app
}

async function launchServer(conf : any, logger : ILogger) {
    logger.info('Launching server')

    const server = Fastify()
    server.register(FastifyCors)
    server.register(FastifyAuth)
    server.register(FastifyJWT, {
        secret: conf.encryption?.secret,
        sign: {
            algorithm: 'HS512',
            expiresIn: conf.authentication?.expiresIn ? conf.authentication.expiresIn : '1 hour',
        },
    })

    // Readiness endpoint
    server.route(ReadinessRoute)

    // Mount general endpoints
    server.route(GeneralStatusRoute)
    server.route(GeneralVersionRoute)
    
    // Endpoints
    server.register(LoginRoute)
    server.register(VehiclesRoute)
    server.register(VehiclesByIdRoute)

    // Add conf
    server.decorateRequest('conf', conf)

    // Authenticate methods
    server.decorate('authenticateAccount',
        (req: any, res: any, done: () => void) => AuthenticationService.authenticateAccount({ req, res, done }))

    await server.listen(conf.server.port, conf.server.host)
    logger.info(`Server ready at ${conf.server.host}:${conf.server.port}`)
}

async function run() {
    const logger = await loadLogger()
    const conf = await loadConfiguration(path.resolve('../conf/application.yml'), logger)

    // Configure services
    if (conf.encryption) {
        EncryptionService.configure(conf.encryption)
    }
    if (conf.account) {
        AuthenticationService.configure(conf.account)
    }
    if (conf.vehicles) {
        VehicleService.configure(conf.vehicles)
    }

    await launchServer(conf, logger)
}

run()
    .catch((err) => {
        console.error('Fatal error: ')
        console.error(err)
        process.exit(-1)
    })
