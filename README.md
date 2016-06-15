# nextanime
Anime recommendations website

## Project Setup

1) Requirements

- An installation of node.js (with npm)
- A mysql database

2) Installing

After downloading/cloning, run the following commands:

`npm install -g bower && npm install -g gulp && npm install && bower install`

3) Config

Copy the file `.env.example` into a new file called `.env`, and edit its values.

## Developing

### Fixing compatibility between Adonis and standard code

Adonis uses ES6 generators in order to make the code more readable. However, this may create some issues when trying to interface with classic node.js code.

#### Calling a generator function (with yield) from within a normal function

Fixed using the `co` module.  
Example: Requesting a user from the database for verification with passport.

    passport.use('local', new LocalStrategy(
      function (username, password, done) {
        return co(function* () {
          const user = yield User.where('username', username).first().fetch();
          ...
        });
      }
    ))

#### Transforming a callback function into a generator function

Done using promises.

Example:
    
    class Recommendation {
    ...
      addLike (userId, itemId, omitUpdate) {
        return new Promise((resolve, reject) => {
          raccoon.liked(userId, itemId, omitUpdate, function(results) {
            resolve(results)
          })
        })
      }
    ...
    }
    
Usage:

    yield Recommendation.addLike(userId, itemId, true);
