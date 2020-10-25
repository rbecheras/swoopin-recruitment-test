import Logger from '@harmonyjs/logger'

function AuthenticationService() {
    const instance = ({

        logger: Logger({ name: 'Authentication', configuration: { console: true } }),

        account: null as any,

        configure(account: any) {
            this.account = account
        },

        async authenticateAccount(args: {req: any, res: any, done: (error?: Error) => void }) {

            try {
                // Decode JSON
                const decoded = await args.req.jwtVerify()
        
                if (!decoded?.payload?.userId) 
                    return args.res.code(500).send({
                        statusCode: 500,
                        error: 'Internal Server Error',
                        message: 'No userId found in token payload',
                    })
        
                // Verify account is present
                if (this.account && (decoded.payload.userId !== this.account!.id))
                    return args.res.code(500).send({
                        statusCode: 500,
                        error: 'Internal Server Error',
                        message: 'No userId found in token payload',
                    })
        
                const user = this.account
                return Object.assign(args.req, { user })
            } catch (e) {
                return args.res.code(401).send({
                    statusCode: 401,
                    error: 'Credentials invalid',
                    message: e.message,
                })
            }
        },
    })

    return instance
}

export default AuthenticationService()
