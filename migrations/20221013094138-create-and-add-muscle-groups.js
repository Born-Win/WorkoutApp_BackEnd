const muscleGroupTableName = 'muscle_groups';

const muscleGroups = [
  {
    id: 1,
    name: 'Chest'
  },
  {
    id: 2,
    name: 'Back'
  },
  {
    id: 3,
    name: 'Arms'
  },
  {
    id: 4,
    name: 'Legs'
  },
  {
    id: 5,
    name: 'Shoulders'
  },
  {
    id: 6,
    name: 'Abs'
  }
];

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        muscleGroupTableName,
        {
          id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false
          }
        },
        { transaction }
      );

      await queryInterface.bulkInsert(muscleGroupTableName, muscleGroups, {
        transaction
      });
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable(muscleGroupTableName);
  }
};
