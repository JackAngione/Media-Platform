const { MeiliSearch } = require('meilisearch')
const movies = require('./movies.json')
const users = require("./users.json")
const {meiliSearch_Master_Key} = require("../secret_keys")
const client = new MeiliSearch({
    host: 'http://0.0.0.0:7700',
    apiKey: meiliSearch_Master_Key
})
//client.getKeys() .then((res) => console.log(res))
client.index("users").deleteAllDocuments()
    .then((res) => console.log(res))
/*
client.createIndex('users', {primaryKey: 'user_id'})
    .then((res) => console.log(res))


client.index('users').addDocuments(users)
    .then((res) => console.log(res))



*/

/*
client.deleteIndex("users")
    .then((res) => console.log(res))
*/


//client.index('movies').search('botman').then((res) => console.log(res))

