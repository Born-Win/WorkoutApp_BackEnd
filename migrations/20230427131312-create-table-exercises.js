const exerciseTableName = 'exercises';
const userTableName = 'users';
const muscleGroupTableName = 'muscle_groups';

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable(
        exerciseTableName,
        {
          id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false
          },
          user_id: {
            type: DataTypes.INTEGER,
            references: {
              model: userTableName,
              key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
          },
          muscle_group_id: {
            type: DataTypes.INTEGER,
            references: {
              model: muscleGroupTableName,
              key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
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

      await queryInterface.addConstraint(exerciseTableName, {
        type: 'unique',
        fields: ['user_id', 'name'],
        transaction
      });
      await queryInterface.addConstraint(exerciseTableName, {
        type: 'check',
        where: DataTypes.where(
          DataTypes.fn('CHAR_LENGTH', DataTypes.col('name')),
          {
            [DataTypes.Op.between]: [2, 30]
          }
        ),
        fields: ['name'],
        transaction
      });
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable(exerciseTableName);
  }
};
