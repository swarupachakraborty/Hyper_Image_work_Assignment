# Hyper Imaging Works Assignment

[DEMO](https://hyper-image-work-assignment.vercel.app/)

##### Subtask #1: Use Supabase and create instance of Postgres SQL. create these tables:
https://dbdiagram.io/d/6308a511f1a9b01b0fec09a7

##### Output of subtask#1: 
- A .SQL file with the create table commands
- Credentials to the Postgres DB / Access to Supabase

##### Subtask #2: Set up a NextJS with only API handlers for CRUD operations on each table on Supabase. It will essentially act as a tunnel to the supabase’s API.
 .
##### Output of subtask#2:
- Github repository with the code for the NextJS application
- .env file for Supabase URL and key storage

##### Subtask#3: Deploy this NextJS application to Vercel using Github connection
https://nextjs.org/learn/basics/deploying-nextjs-app/deploy

### API's
There are 32 CURD apis based on 8 tables

### USER APIS
#### Create User (`PSOT` ./api/user)
##### request body
```json
{
    "name":"Sahil",
    "username":"sahil_rrey4",
    "email":"email@yahooj.com",
    "location":"any"
}
```

##### response body
SUCCESS
```json
{
    "status": true,
    "message": "user created successfully!"
}
```
FAILED
```json
{
    "status": false,
    "message": "..."
}
```



#### Get All User (`GET` ./api/user)

##### response body
SUCCESS
```json
{
    "status": true,
    "data": [...]
}
```
FAILED
```json
{
    "status": false,
    "message": "..."
}
```

#### Update Each User (`PUT` ./api/user/:userId)
##### request body
```json
{
    "name":"Sahil",
    "username":"sahil_rrey4",
    "email":"email@yahooj.com",
    "location":"any"
}
```

##### response body
SUCCESS
```json
{
    "status": true,
    "data":{...}
    "message": "user updated successfully!"
}
```
FAILED
```json
{
    "status": false,
    "message": "..."
}
```

#### Delete Each User (`DELETE` ./api/user/:userId)

##### response body
SUCCESS
```json
{
    "status": true,
    "message": "user deleted successfully!"
}
```
FAILED
```json
{
    "status": false,
    "message": "..."
}
```










### PHYSICAL ADDRESS APIS
#### Create physical_address (`PSOT` ./api/physical_address)
##### request body
```json
{
    "user_id": "7f03e986-c01b-459a-9ac6-fca9acef7bec",
    "line1": "addwwe",
    "line2": "",
    "city": "jajpur",
    "state": "odisha",
    "country": "jajpur",
    "pincode": "755019"
}
```

##### response body
SUCCESS
```json
{
    "status": true,
    "message": "physical_address created successfully!"
}
```
FAILED
```json
{
    "status": false,
    "message": "..."
}
```



#### Get All physical_address (`GET` ./api/physical_address)

##### response body
SUCCESS
```json
{
    "status": true,
    "data": [...]
}
```
FAILED
```json
{
    "status": false,
    "message": "..."
}
```

#### Update Each Physical_address (`PUT` ./api/physical_address/:addressId)
##### request body
```json
{
    "user_id": "7f03e986-c01b-459a-9ac6-fca9acef7bec",
    "line1": "addwwe",
    "line2": "dgdrg",
    "city": "jajpur",
    "state": "odisha",
    "country": "jajpur",
    "pincode": "755020"
}
```

##### response body
SUCCESS
```json
{
    "status": true,
    "data":{...}
    "message": "physical_address updated successfully!"
}
```
FAILED
```json
{
    "status": false,
    "message": "..."
}
```

#### Delete Each physical_address (`DELETE` ./api/physical_address/:addressId)

##### response body
SUCCESS
```json
{
    "status": true,
}
```
FAILED
```json
{
    "status": false,
    "message": "..."
}
```










### ORDER APIS
#### Create order (`PSOT` ./api/order)
##### request body
```json
{
    "amount": "10",
    "delivery_charge": "5",
    "taxes": "1",
    "fee": "1",
    "discount": "2",
    "currency": "INR",
    "total": "15",
    "cashback": "2",
    "billing_address": "9ec3c5cf-5f5a-4157-a72b-5b891c956012",
    "shipping_address": "ae28f19b-a7b5-43fb-b64d-9dadf10188c3",
    "status": false,
    "profile_id": "7f03e986-c01b-459a-9ac6-fca9acef7bec"
}
```

##### response body
SUCCESS
```json
{
    "status": true,
    "message": "order created successfully!"
}
```
FAILED
```json
{
    "status": false,
    "message": "..."
}
```



#### Get All Order (`GET` ./api/order)

##### response body
SUCCESS
```json
{
    "status": true,
    "data": [...]
}
```
FAILED
```json
{
    "status": false,
    "message": "..."
}
```

#### Update Each Order (`PUT` ./api/order/:orderId)
##### request body
```json
{
    "amount": "10",
    "delivery_charge": "5",
    "taxes": "1",
    "fee": "1",
    "discount": "2",
    "currency": "INR",
    "total": "15",
    "cashback": "2",
    "billing_address": "9ec3c5cf-5f5a-4157-a72b-5b891c956012",
    "shipping_address": "ae28f19b-a7b5-43fb-b64d-9dadf10188c3",
    "status": false,
    "profile_id": "7f03e986-c01b-459a-9ac6-fca9acef7bec"
}
```

##### response body
SUCCESS
```json
{
    "status": true,
    "data":{...}
    "message": "order updated successfully!"
}
```
FAILED
```json
{
    "status": false,
    "message": "..."
}
```

#### Delete Each order (`DELETE` ./api/order/:orderId)

##### response body
SUCCESS
```json
{
    "status": true,
    "message":"order deleted successfully"
}
```
FAILED
```json
{
    "status": false,
    "message": "..."
}
```
