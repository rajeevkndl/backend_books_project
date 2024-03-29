# Required -

NodeJS

MongoDb

ExpressJS

bcrypt(for password security)

jsonwebtoken(to create tokens)

win-node-env (for environment setup)


# Steps

1). Install node modules using npm i in backend folder.

2). Do npm start in backend folder, it will run server for your api.

3). Now you can create users, login and get token for running all the apis.

API curl for creating user - curl --location 'http://localhost:8000/api/users' \
--form 'user="{
    \"username\": \"testuser1\",
    \"email\": \"testing@gmail.com\",
    \"password\":\"ab(#cd*9013\"
}"'

API curl for user login and getting token - curl --location 'http://localhost:8000/api/users/login' \
--form 'user="{
    \"usernameOrEmail\": \"testing@gmail.com\",
    \"password\":\"ab(#cd*9013\"
}"'

 4). With this you can now add books with curl - curl --location 'http://localhost:8000/api/book' \
--header 'X-Auth: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoicmFqZWV2IiwiZW1haWwiOiJyYWplZXZrdW5kaWFsQGdtYWlsLmNvbSIsImlhdCI6MTcxMTY5MDYxMSwiZXhwIjoxNzExNjk0MjExfQ.iONPQQ0We4qo5DH898RHIPgfRWxaPWzCWKViSptDkVw' \
--header 'Content-Type: application/json' \
--data '{
    "books": [
        {
            "title": "testbook1",
            "author": "author1",
            "ISBN": "189124",
            "quantity": 4
        }
    ]
}'
5). user can add the available books in their account and later return it.
        
