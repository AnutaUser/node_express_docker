db.createUser(
    {
        user: 'username',
        pwd: 'password',
        roles: [
            {
                role: 'readWrite',
                db: 'node_express_ts'
            }
        ]
    }
)
