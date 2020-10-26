import Logger from '@harmonyjs/logger'

function AuthenticationService() {
    const instance = ({

        logger: Logger({ name: 'Authentication', configuration: { console: true } }),

        account: null as any,

        configure(account: any) {
            this.account = account
        },

        async authenticateAccount(args: {req: any, res: any, done: (err: any) => void}) {
            let decoded
            try {
                // Decode JSON
                decoded = await args.req.jwtVerify()
            } catch (e) {
                return args.res.code(401).send({
                    statusCode: 401,
                    error: 'Credentials invalid',
                    message: e.message,
                })
            }

            // Verify payload
            if (!decoded?.payload?.userId)
                return args.res.code(500).send({
                    statusCode: 500,
                    error: 'Internal Server Error',
                    message: 'No userId found in token payload',
                })

            // Verify account matching
            if (decoded.payload.userId !== this.account.id)
                return args.res.code(500).send({
                    statusCode: 500,
                    error: 'Internal Server Error',
                    message: 'Token doesnt match with a valid account',
                })

            const user = this.account
            return Object.assign(args.req, { user })
        },
    })

    return instance
}

export default AuthenticationService()
