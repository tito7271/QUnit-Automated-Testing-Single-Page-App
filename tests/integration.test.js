const baseUrl = 'http://localhost:3030/'
QUnit.config.reorder = false

let user = {
    email: '',
    password: '123456'
}

let token = ''
let userId = ''

let game = {
    title: '',
    category: '',
    maxLevel: '71',
    imageUrl: './images/ZombieLang.png',
    summary: ''
}

let lastCreatedGameId = ''

let gameIdForComments = ''


QUnit.module('user functionalities', () => {
    QUnit.test('registration', async (assert) => {
        // Arrange
        let path = 'users/register'

        let random = Math.floor(Math.random() * 10000)
        let email = `test${random}@mail.com`
        user.email = email

        // Act
        let response = await fetch(baseUrl + path, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        let json = await response.json()

        // Assert
        assert.ok(response.ok, 'user registered successfully')

        assert.ok(json.hasOwnProperty('email'), 'email exists')
        assert.equal(json['email'], user.email, 'correct expected email')
        assert.strictEqual(typeof json.email, 'string', 'email has correct property')

        assert.ok(json.hasOwnProperty('password'), 'password exists')
        assert.equal(json['password'], user.password, 'correct expected password')
        assert.strictEqual(typeof json.password, 'string', 'password has correct property')

        assert.ok(json.hasOwnProperty('accessToken'), 'accessToken exists')
        assert.strictEqual(typeof json.accessToken, 'string', 'accessToken has correct property')

        assert.ok(json.hasOwnProperty('_id'), '_id exists')
        assert.strictEqual(typeof json._id, 'string', '_id has correct property')

        assert.ok(json.hasOwnProperty('_createdOn'), '_createdOn exists')
        assert.strictEqual(typeof json._createdOn, 'number', '_createdOn has correct property')

        token = json['accessToken']
        userId = json['_id']
        sessionStorage.setItem('game-user', JSON.stringify(user))
    })

    QUnit.test('login', async (assert) => {
        // Arrange
        let path = 'users/login'

        // Act
        let response = await fetch(baseUrl + path, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        let json = await response.json()

    // Assert
        assert.ok(response.ok, 'user logged in correctly')

        assert.ok(json.hasOwnProperty('email'), 'email exists')
        assert.strictEqual(json['email'], user.email, 'correct expected email')
        assert.strictEqual(typeof json.email, 'string', 'email has correct property')

        assert.ok(json.hasOwnProperty('password'), 'password exists')
        assert.strictEqual(json['password'], user.password, 'correct expected password')
        assert.strictEqual(typeof json.password, 'string', 'password has correct property')

        assert.ok(json.hasOwnProperty('accessToken'), 'accessToken exists')
        assert.strictEqual(typeof json.accessToken, 'string', 'accessToken has correct property')

        assert.ok(json.hasOwnProperty('_id'), '_id exists')
        assert.strictEqual(typeof json._id, 'string', '_id has correct property')

        assert.ok(json.hasOwnProperty('_createdOn'), '_createdOn exists')
        assert.strictEqual(typeof json._createdOn, 'number', '_createdOn has correct property')

        token = json['accessToken']
        userId = json['_id']
        sessionStorage.setItem('game-user', JSON.stringify(user))
    })

})

QUnit.module('games functionalities', () => {
    QUnit.test('get all games', async (assert) => {
        // Arrange
        let path = 'data/games'
        let queryParams = '?sortBy=_createdOn%20desc' 

        // Act
        let response = await fetch(baseUrl + path + queryParams)
        let json = await response.json()

        // Assert
        assert.ok(response.ok, 'successfull response')
        assert.ok(Array.isArray(json), 'response is array')

        json.forEach(jsonProperty => {
            assert.ok(jsonProperty.hasOwnProperty('category'), 'property category exists')
            assert.strictEqual(typeof jsonProperty.category, 'string', 'property category has correct type')

            assert.ok(jsonProperty.hasOwnProperty('imageUrl'), 'property imageUrl exists')
            assert.strictEqual(typeof jsonProperty.imageUrl, 'string', 'property imageUrl has correct type')

            assert.ok(jsonProperty.hasOwnProperty('maxLevel'), 'property maxLevel exists')
            assert.strictEqual(typeof jsonProperty.maxLevel, 'string', 'property maxLevel has correct type')

            assert.ok(jsonProperty.hasOwnProperty('title'), 'property title exists')
            assert.strictEqual(typeof jsonProperty.title, 'string', 'property title has correct type')

            assert.ok(jsonProperty.hasOwnProperty('summary'), 'property summary exists')
            assert.strictEqual(typeof jsonProperty.summary, 'string', 'property summary has correct type')

            
            assert.ok(jsonProperty.hasOwnProperty('_createdOn'), 'property _createdOn exists')
            assert.strictEqual(typeof jsonProperty._createdOn, 'number', 'property _createdOn has correct type')

            assert.ok(jsonProperty.hasOwnProperty('_id'), 'property _id exists')
            assert.strictEqual(typeof jsonProperty._id, 'string', 'property _id has correct type')

            assert.ok(jsonProperty.hasOwnProperty('_ownerId'), 'property _ownerId exists')
            assert.strictEqual(typeof jsonProperty._ownerId, 'string', 'property _ownerId has correct type')

        });
    })

    QUnit.test('create game functionality', async (assert) => {
        // Arrange
        let path = 'data/games'
        let random = Math.floor(Math.random() * 10000)

        game.title = `Random game title ${random}`
        game.category = `Random game category ${random}`
        game.summary = `Random game summary ${random}`

        // Act
        let response = await fetch(baseUrl + path, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify(game)
        })
        let json = await response.json()
        lastCreatedGameId = json._id

        // Assert
        assert.ok(response.ok, 'successfull response')

        assert.ok(json.hasOwnProperty('category'), 'property category exists')
        assert.strictEqual(typeof json.category, 'string', 'property category has correct type')
        assert.strictEqual(json.category, game.category, 'category has expected value')

        assert.ok(json.hasOwnProperty('imageUrl'), 'property imageUrl exists')
        assert.strictEqual(typeof json.imageUrl, 'string', 'property imageUrl has correct type')
        assert.strictEqual(json.imageUrl, game.imageUrl, 'imageUrl has expected value')

        assert.ok(json.hasOwnProperty('maxLevel'), 'property maxLevel exists')
        assert.strictEqual(typeof json.maxLevel, 'string', 'property maxLevel has correct type')
        assert.strictEqual(json.maxLevel, game.maxLevel, 'maxLevel has expected value')

        assert.ok(json.hasOwnProperty('summary'), 'property summary exists')
        assert.strictEqual(typeof json.summary, 'string', 'property summary has correct type')
        assert.strictEqual(json.summary, game.summary, 'maxLevel has expected value')

        assert.ok(json.hasOwnProperty('title'), 'property title exists')
        assert.strictEqual(typeof json.title, 'string', 'property title has correct type')
        assert.strictEqual(json.title, game.title, 'title has expected value')

        assert.ok(json.hasOwnProperty('_createdOn'), 'property _createdOn exists')
        assert.strictEqual(typeof json._createdOn, 'number', 'property _createdOn has correct type')

        assert.ok(json.hasOwnProperty('_id'), 'property _id exists')
        assert.strictEqual(typeof json._id, 'string', 'property _id has correct type')

        assert.ok(json.hasOwnProperty('_ownerId'), 'property _ownerId exists')
        assert.strictEqual(typeof json._ownerId, 'string', 'property _ownerId has correct type')
    })

    QUnit.test('get by id functionality', async (assert) => {
        // Arrange
        let path = 'data/games'

        // Act
        let response = await fetch(baseUrl + path + `/${lastCreatedGameId}`)
        let json = await response.json()

        // Assert
        assert.ok(response.ok, 'successfull response')

        assert.ok(json.hasOwnProperty('category'), 'property category exists')
        assert.strictEqual(typeof json.category, 'string', 'property category has correct type')
        assert.strictEqual(json.category, game.category, 'category has expected value')

        assert.ok(json.hasOwnProperty('imageUrl'), 'property imageUrl exists')
        assert.strictEqual(typeof json.imageUrl, 'string', 'property imageUrl has correct type')
        assert.strictEqual(json.imageUrl, game.imageUrl, 'imageUrl has expected value')

        assert.ok(json.hasOwnProperty('maxLevel'), 'property maxLevel exists')
        assert.strictEqual(typeof json.maxLevel, 'string', 'property maxLevel has correct type')
        assert.strictEqual(json.maxLevel, game.maxLevel, 'maxLevel has expected value')

        assert.ok(json.hasOwnProperty('summary'), 'property summary exists')
        assert.strictEqual(typeof json.summary, 'string', 'property summary has correct type')
        assert.strictEqual(json.summary, game.summary, 'maxLevel has expected value')

        assert.ok(json.hasOwnProperty('title'), 'property title exists')
        assert.strictEqual(typeof json.title, 'string', 'property title has correct type')
        assert.strictEqual(json.title, game.title, 'title has expected value')

        assert.ok(json.hasOwnProperty('_createdOn'), 'property _createdOn exists')
        assert.strictEqual(typeof json._createdOn, 'number', 'property _createdOn has correct type')

        assert.ok(json.hasOwnProperty('_id'), 'property _id exists')
        assert.strictEqual(typeof json._id, 'string', 'property _id has correct type')

        assert.ok(json.hasOwnProperty('_ownerId'), 'property _ownerId exists')
        assert.strictEqual(typeof json._ownerId, 'string', 'property _ownerId has correct type')
    })

    QUnit.test('edit game functionality', async (assert) => {
        // Arrange
        let path = 'data/games'
        let random = Math.floor(Math.random() * 10000)

        game.title = `Updated title ${random}`
        game.category = `Updated category ${random}`
        game.summary = `Updated summary ${random}`

        // Act
        let response = await fetch(baseUrl + path + `/${lastCreatedGameId}`, {
            method: "PUT",
            headers: {
                'content-type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify(game)
        })
        let json = await response.json()

        // Assert
        assert.ok(response.ok, 'successfull response')

        assert.ok(json.hasOwnProperty('category'), 'property category exists')
        assert.strictEqual(typeof json.category, 'string', 'property category has correct type')
        assert.strictEqual(json.category, game.category, 'category has expected value')

        assert.ok(json.hasOwnProperty('imageUrl'), 'property imageUrl exists')
        assert.strictEqual(typeof json.imageUrl, 'string', 'property imageUrl has correct type')
        assert.strictEqual(json.imageUrl, game.imageUrl, 'imageUrl has expected value')

        assert.ok(json.hasOwnProperty('maxLevel'), 'property maxLevel exists')
        assert.strictEqual(typeof json.maxLevel, 'string', 'property maxLevel has correct type')
        assert.strictEqual(json.maxLevel, game.maxLevel, 'maxLevel has expected value')

        assert.ok(json.hasOwnProperty('summary'), 'property summary exists')
        assert.strictEqual(typeof json.summary, 'string', 'property summary has correct type')
        assert.strictEqual(json.summary, game.summary, 'maxLevel has expected value')

        assert.ok(json.hasOwnProperty('title'), 'property title exists')
        assert.strictEqual(typeof json.title, 'string', 'property title has correct type')
        assert.strictEqual(json.title, game.title, 'title has expected value')

        assert.ok(json.hasOwnProperty('_createdOn'), 'property _createdOn exists')
        assert.strictEqual(typeof json._createdOn, 'number', 'property _createdOn has correct type')

        assert.ok(json.hasOwnProperty('_id'), 'property _id exists')
        assert.strictEqual(typeof json._id, 'string', 'property _id has correct type')

        assert.ok(json.hasOwnProperty('_ownerId'), 'property _ownerId exists')
        assert.strictEqual(typeof json._ownerId, 'string', 'property _ownerId has correct type')

        assert.ok(json.hasOwnProperty('_updatedOn'), 'property _updatedOn exists')
        assert.strictEqual(typeof json._updatedOn, 'number', 'property _updatedOn has correct type')
    })

    QUnit.test('delete game functionality', async (assert) => {
        // Arrange
        let path = 'data/games'

        // Act
        let response = await fetch(baseUrl + path + `/${lastCreatedGameId}`, {
            method: "DELETE",
            headers: {
                'X-Authorization': token
            }
        })
        assert.ok(response.ok, 'deleted successfully')
    })  
})

QUnit.module('comment functionality', () => {
    QUnit.test('newly created game - no comments (empty)', async (assert) => {
        // Arrange
        let pathForCreateGame = 'data/games'
        
        let gameId = (await fetch(baseUrl + pathForCreateGame, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify(game)
        })
        .then(response => response.json()))._id

        gameIdForComments = gameId

        let queryParams = `?where=gameId%3D%22${gameIdForComments}%22`

        // Act
        let pathForComments = 'data/comments'

        let response = await fetch(baseUrl + pathForComments + queryParams)
        let json = await response.json()

        // Assert
        assert.ok(response.ok, 'successfull response')

        assert.ok(Array.isArray(json), 'response is array')
        assert.ok(json.length === 0, 'array is empty')
    })

    QUnit.test('create a new comment)', async (assert) => {
        // Arrange
        let path = 'data/comments'
        let random = Math.floor(Math.random() * 10000)
        let comment = {
            gameId: gameIdForComments,
            comment: `test comment content ${random}`
        }
        
        // Act
        let response = await fetch(baseUrl + path, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify(comment)
        })
        let json = await response.json()

        // Assert
        assert.ok(response.ok, 'successfull response')

        assert.ok(json.hasOwnProperty('comment'), 'comment exists')
        assert.strictEqual(json.comment, comment.comment, 'correct expected comment')
        assert.strictEqual(typeof json.comment, 'string', 'comment has correct property')

        assert.ok(json.hasOwnProperty('gameId'), 'gameId: exists')
        assert.strictEqual(json.gameId, comment.gameId, 'correct expected gameId:')
        assert.strictEqual(typeof json.gameId, 'string', 'email has correct property')

        assert.ok(json.hasOwnProperty('_createdOn'), '_createdOn: exists')
        assert.strictEqual(typeof json._createdOn, 'number', 'email has correct property')

        assert.ok(json.hasOwnProperty('_id'), '_id: exists')
        assert.strictEqual(typeof json._id, 'string', 'email has correct property')
    })

    QUnit.test('get comments by game id)', async (assert) => {
        // Arrange
        let path = 'data/comments'
        let queryParams = `?where=gameId%3D%22${gameIdForComments}%22`

        // Act
        let response = await fetch(baseUrl + path + queryParams)
        let json = await response.json()

        // Assert
        assert.ok(response.ok, 'successfull response')
        assert.ok(Array.isArray(json), 'the response is array')

        json.forEach(element => {
            assert.ok(element.hasOwnProperty('comment'), 'comment exists')
            assert.strictEqual(typeof element.comment, 'string', 'comment has correct property')
    
            assert.ok(element.hasOwnProperty('gameId'), 'gameId: exists')
            assert.strictEqual(typeof element.gameId, 'string', 'email has correct property')
    
            assert.ok(element.hasOwnProperty('_createdOn'), '_createdOn: exists')
            assert.strictEqual(typeof element._createdOn, 'number', 'email has correct property')
    
            assert.ok(element.hasOwnProperty('_id'), '_id: exists')
            assert.strictEqual(typeof element._id, 'string', 'email has correct property')
        });
    })
})
