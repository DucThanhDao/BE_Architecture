Authen flow: section5: 30:05


# PUT/PATCH: when to use
- PUT
    + Using when we have case that need to add new to DB
    + Update full keys
    + Ex: update --> found --> update exist
                 --> notFound --> create new in DB
- PATCH
    + Using when we need to update part of keys in documents

- When update anything in db, before run, we must replace all `null` and `undefined` value in request

