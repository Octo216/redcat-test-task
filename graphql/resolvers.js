const validator = require('validator');
const { users, roles } = require("../db");

module.exports = {
  Query: {
    users: () => users,
    user: (parent, { username }) => users.find(user => user.username === username),
    userRole: (parent, { id }) => users.find(user => user.id === id).roles,
    usersByRole: (parent, { role }) => users.filter(user => user.roles.includes(role))
  },
  Mutation: {
    createUser: async function (parent, { username, email, phone }) {
      if (users.some(user => user.phone === phone)) {
        throw new Error('Phone number must be unique')
      }

      if (!validator.isEmail(email)) {
        throw new Error('E-Mail is invalid.')
      }

      let idCount = users.length

      const user = {
        id: `user-${ idCount++ }`, username, email, phone, roles: []
      }
      users.push(user)
      return user
    },
    updateUser: (parent, { id, username, email, phone }) => {
      const userIndex = users.findIndex(user => user.id === id);

      if (userIndex < 0) {
        throw new Error(`No user found with provided id: ${ id }`)
      }

      if (!validator.isEmail(email)) {
        throw new Error('E-Mail is invalid.')
      }

      const updatedUser = {
        ...users[userIndex],
        username: username || users[userIndex].username,
        email: email || users[userIndex].email,
        phone: phone || users[userIndex].phone
      }

      users[userIndex] = updatedUser
      return updatedUser
    },
    assignRole: (parent, { id, role }) => {
      if (!roles.includes(role)) {
        throw new Error(`Invalid role: ${ role }`)
      }

      const user = users.find(user => user.id === id);

      if (!user) {
        throw new Error(`No user found with provided id: ${ id }`)
      }

      if (!user.roles.includes(role)) {
        user.roles.push(role)
      } else {
        throw new Error(`User already has this role: ${ role }`)
      }

      return user
    },
    revokeRole: (parent, { id, role }) => {
      if (!roles.includes(role)) {
        throw new Error(`Invalid role: ${ role }`)
      }

      const user = users.find(user => user.id === id);

      if (!user) {
        throw new Error(`No user found with provided id: ${ id }`)
      }

      if (!user.roles.includes(role)) {
        throw new Error(`User dont has this role: ${ role }`)
      } else {
        user.roles = user.roles.filter(r => r !== role)
      }

      return user
    }
  },
};
