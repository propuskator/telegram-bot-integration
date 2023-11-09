import sequelizePackage from 'sequelize';

import sequelizeConstants from '../../../constants/sequelize.js';
import BaseModel          from './BaseModel.js';

const { DataTypes } = sequelizePackage;

export default class Workspace extends BaseModel {
    static schema() {
        return {
            id          : { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
            name        : { type: DataTypes.STRING, allowNull: false, unique: true },
            accessToken : { type: DataTypes.STRING, allowNull: false, unique: true },
            createdAt   : { type: DataTypes.DATE(sequelizeConstants.DATE_DATATYPE_PRECISION) },
            updatedAt   : { type: DataTypes.DATE(sequelizeConstants.DATE_DATATYPE_PRECISION) }
        };
    }

    static options() {
        return {
            timestamps : false
        };
    }
}
