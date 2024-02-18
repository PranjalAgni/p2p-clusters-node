Things I need?

- i will need some seed servers
- when a client joins it will register itself to some seed server
- every node has an id which can be set when starting that node
- follow auto incrementing for ids
- seed server id looks like seed1,seed2...
- nodes server id looks like node1,node2...
- seed server have a /register endpoints so nodes can register themseleves with the given id and address

- visits browser http://localhost:7000?msg=hello_there&dest=

how communication happens

seed servers mentioned in seed.txt
start all seed servers

node1 -> {msg: "hello there", destination: "someNodeId"}

node1-> asks some seed server, address to someNodeId

seed server recives request -> check in its cache -> returns if it gets it

\*if its cache miss -> seed server recursively checks with other seed servers -> some seed server will respond with id -> set in its own cache & return that to node1 -> node1 sends msg to that address and add that address in its knownlist -> return the response flow

when seed server start's up they need to know address of all their peer seed servers
vs...
when node server start's up they need to register themselves to some seed server
