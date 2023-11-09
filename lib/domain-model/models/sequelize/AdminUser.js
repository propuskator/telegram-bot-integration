import sequelizePackage from 'sequelize';

import sequelizeConstants   from '../../../constants/sequelize.js';
import { createSha256Hash } from '../../../utils/common.js';
import BaseModel            from './BaseModel.js';

const { DataTypes } = sequelizePackage;

export default class AdminUser extends BaseModel {
    static schema() {
        return {
            id           : { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
            workspaceId  : { type: DataTypes.BIGINT },
            login        : { type: DataTypes.STRING, allowNull: false },
            avatar       : { type: DataTypes.STRING, allowNull: true },
            passwordHash : { type: DataTypes.STRING },
            mqttToken    : { type: DataTypes.STRING },
            createdAt    : { type: DataTypes.DATE(sequelizeConstants.DATE_DATATYPE_PRECISION) },
            updatedAt    : { type: DataTypes.DATE(sequelizeConstants.DATE_DATATYPE_PRECISION) },
            rootTopic    : {
                type : DataTypes.VIRTUAL,
                get() {
                    return createSha256Hash(this.getDataValue('login'));
                }
            }
        };
    }
}
