const outcomeTableName = 'outcomes';
const exerciseTableName = 'exercises';

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable(
        outcomeTableName,
        {
          id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          weight: {
            type: DataTypes.DECIMAL,
            allowNull: false
          },
          comment: {
            type: DataTypes.STRING
          },
          date: {
            type: DataTypes.STRING,
            allowNull: false
          },
          exercise_id: {
            type: DataTypes.INTEGER,
            references: {
              model: exerciseTableName,
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

      await queryInterface.addConstraint(outcomeTableName, {
        type: 'unique',
        fields: ['exercise_id', 'date', 'weight'],
        transaction
      });
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable(outcomeTableName);
  }
};
