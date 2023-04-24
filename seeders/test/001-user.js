const userTableName = 'users';

const defaultPasswordHash = '$2b$10$GeFUhQYdmu3VsFnnTGiaUOfhI3eJC6pHfPAB/vb3lwAeFNh1.9wX2'; // 123456

const userData = [
  {
    email: 'platform.admin1@fakemail.com',
    password: defaultPasswordHash,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    email: 'platform.admin2@fakemail.com',
    password: defaultPasswordHash,
    created_at: new Date(),
    updated_at: new Date(),
  }
];

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert(userTableName, userData);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete(userTableName, {
      email: userData.map(user => user.email)
    });
  }
};
