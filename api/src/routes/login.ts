import Logger from '@harmonyjs/logger'
import EncryptionService from 'services/encryption'

const logger = Logger({
    name: 'AccountLogin',
    configuration: {
        console: true,
    },
})

const INTERNAL_ERROR = { statusCode: 500, error: 'Internal Server Error' }
const USER_NOT_FOUND_ERROR = { statusCode: 401, error: 'Bad Request', message: 'user_not_found' }
const BAD_PASSWORD_ERROR = { statusCode: 401, error: 'Bad Request', message: 'wrong_credentials' }

const LoginRoute = async (server : any, opts : any, next: () => void) => {
    server.route({
        method: 'POST',
        url: '/login',
        schema: {
            body: {
                email: { type: 'number' },
                password: { type: 'number' },
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        token: { type: 'string' }
                    }
                },
                401: {
                    type: 'object',
                    properties: {
                        statusCode: { type: 'number' },
                        error: { type: 'string' },
                        message: { type: 'string' },
                    }
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
        errorHandler(error: any, req: any, res: any) {
            return res.status(500).send(INTERNAL_ERROR)
        },
        async handler(req: any, res: any) {
            const {account} = req.conf
            const {email, password} = req.body
            if (email !== account.email) {
                return res.status(401).send(USER_NOT_FOUND_ERROR)
            }

            const isMatchingPwd =  EncryptionService.comparePassword({ password: password, salt: account.id, encrypted: account.password })
            if (!isMatchingPwd) {
                return res.status(401).send(BAD_PASSWORD_ERROR)
            }

            const token = server.jwt.sign({ userId: account.id, name: account.name, isAdmin: false })
            return res.send({token})
        },
    })
    next()
}

export default LoginRoute
