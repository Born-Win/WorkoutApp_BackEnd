const setTableName = 'sets';
const outcomeTableName = 'outcomes';

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      setTableName,
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        reps: {
          type: DataTypes.DECIMAL,
          allowNull: false
        },
        comment: {
          type: DataTypes.STRING
        },
        outcome_id: {
          type: DataTypes.INTEGER,
          references: {
            model: outcomeTableName,
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
      }
    );
  },

  down: queryInterface => {
    return queryInterface.dropTable(setTableName);
  }
};
