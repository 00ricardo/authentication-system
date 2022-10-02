import randomToken from 'random-token'
const none = undefined
export const groups = [
    { id: 1, name: "unregistered" },
    { id: 2, name: "user" },
    { id: 3, name: "admin" },
]
export const users = [
    { id: 1, username: 'john@gmail.com', password: randomToken(64), first_name: 'John', last_name: 'Snow', email: 'john@gmail.com', active: true, groupId: 2 },
    { id: 2, username: 'rhanyra@gmail.com', password: randomToken(64), first_name: 'Rhanyra', last_name: 'Targaryan', email: 'rhanyra@gmail.com', active: true, groupId: 2 },
    { id: 3, username: 'viserys@gmail.com', password: randomToken(64), first_name: 'Viserys', last_name: 'Targaryan', email: 'viserys@gmail.com', active: true, groupId: 2 },
    { id: 4, username: 'arya@gmail.com', password: randomToken(64), first_name: 'Arya', last_name: 'Stark', email: 'arya@gmail.com', active: true, groupId: 2 },
    { id: 5, username: 'allicent@gmail.com', password: randomToken(64), first_name: 'Allicent', last_name: 'Hightower', email: 'allicent@gmail.com', active: true, groupId: 2 },
    { id: 6, username: 'deamon@gmail.com', password: randomToken(64), first_name: 'Deamon', last_name: 'Targaryan', email: 'deamon@gmail.com', active: true, groupId: 2 },
    { id: 7, username: 'balerion@gmail.com', password: randomToken(64), first_name: 'Balerion', last_name: 'The Conquerer', email: 'balerion@gmail.com', active: true, groupId: 2 },
    { id: 8, username: 'aemon@gmail.com', password: randomToken(64), first_name: 'Aemon', last_name: 'Targaryan', email: 'aemon@gmail.com', active: true, groupId: 2 },
    { id: 9, username: 'criston@gmail.com', password: randomToken(64), first_name: 'Sir', last_name: 'Criston', email: 'criston@gmail.com', active: true, groupId: 2 },
    { id: 10, username: 'cersei@gmail.com', password: randomToken(64), first_name: 'Cersei', last_name: 'Lannister', email: 'cersei@gmail.com', active: true, groupId: 2 },
    { id: 11, username: 'stark@gmail.com', password: randomToken(64), first_name: 'House', last_name: 'Stark', email: 'stark@gmail.com', active: true, groupId: 2 },
    { id: 12, username: 'targaryan@gmail.com', password: randomToken(64), first_name: 'House', last_name: 'Targaryan', email: 'targaryan@gmail.com', active: true, groupId: 2 },
    { id: 13, username: 'aegon@gmail.com', password: randomToken(64), first_name: 'Aegon', last_name: 'Targaryan', email: 'aegon@gmail.com', active: true, groupId: 2 },
    { id: 14, username: 'darx@gmail.com', password: randomToken(64), first_name: 'Darx', last_name: 'Druida', email: 'darx@gmail.com', active: true, groupId: 2 },
]

export default none