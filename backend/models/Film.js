// models/Film.js
module.exports = (sequelize, DataTypes) => {
  const Film = sequelize.define('Film', {
    film_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    genre_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    duration_min: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rating: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    release_date: {
      type: DataTypes.DATEONLY
    },
    poster_url: {
      type: DataTypes.STRING(255)
    }
  }, {
    tableName: 'films',
    timestamps: false
  });

  return Film;
};