const userTableName = 'users';

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable(
        userTableName,
        {
          id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          email: {
            type: DataTypes.STRING,
            allowNull: false
          },
          password: {
            type: DataTypes.STRING,
            allowNull: false
          },
          refresh_token: {
            type: DataTypes.STRING
          },
          created_at: {
            type: DataTypes.DATE,
            allowNull: false
          },
          updated_at: {
            type: DataTypes.DATE,
            allowNull: false
          }
        },
        {
          transaction
        }
      );

      await queryInterface.addConstraint(userTableName, {
        type: 'unique',
        fields: ['email'],
        transaction
      });
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable(userTableName);
  }
};
