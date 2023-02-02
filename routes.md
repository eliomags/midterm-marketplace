# Routes (GET/POST)

## Browse (Index):

1. GET /items
2. GET /items (filtered by price)
3. GET /favourites (view your favourites)
4. GET /messages (view your messages)
5. GET /admin (view your items)

## Read (Show):

1. GET /items/{id}
2. Product page
   2.1. GET item/id ()
3. Messages
   3.1 GET /messages (list of messages by product by other user)
   3.2 GET /messages/:product_id/:user_id (other side of the msg)

## Edit (Update):

1. GET /items/:id/edit
2. POST /items/:id

## Add (Create):

1. GET /items/new + POST /items
2. POST /favourites (inside GET /items + /items/:id)
3. GET /items/:id/new POST /items/:id/message (re to Read 2.1)
4. GET /messages/:product_id/:user_id/new POST /messages/:product_id/:user_id (re to Read 3.2)

## Delete:

1. POST /items/{id}/delete
2. POST /favourites/{id}/remove
