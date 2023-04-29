const tableName = 'muscle_groups';
const constraintName = 'muscle_groups_name_uk';

module.exports = {
  up: queryInterface => {
    return queryInterface.addConstraint(tableName, {
      type: 'unique',
      name: constraintName,
      fields: ['name']
    });
  },

  down: queryInterface => {
    return queryInterface.removeConstraint(tableName, constraintName);
  }
};
