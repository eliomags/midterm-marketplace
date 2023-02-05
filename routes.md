# Routes (GET/POST)

## Browse (Index):

1. GET /items (filtered by price)
2. GET /favourites (view your favourites)
3. GET /messages (view your messages)
4. GET /admin (view your items)

## Read (Show):

1. GET /items/{id}
2. GET /messages/:product_id/:user_id (other side of the msg)

## Edit (Update):

1. GET /items/:id/edit
2. POST /items/:id

## Add (Create):

1. GET /items/new + POST /items
2. POST /favourites (inside GET /items + /items/:id)
3. GET /messages/:product_id/:user_id/new POST /messages/:product_id/:user_id

## Delete:

1. POST /items/{id}/delete
2. POST /favourites/{id}/remove
