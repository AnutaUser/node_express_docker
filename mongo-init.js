db.createUser(
    {
        user: 'username',
        pwd: 'password',
        roles: [
            {
                role: 'readWrite',
                db: 'db_nodejs_express'
            }
        ]
    }
)
