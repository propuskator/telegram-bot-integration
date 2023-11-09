import sequelizePackage from 'sequelize';
import bcrypt           from 'bcryptjs';

import sequelizeConstants from '../../../constants/sequelize.js';
import BaseModel          from './BaseModel.js';

const { DataTypes } = sequelizePackage;

export default class User extends BaseModel {
    static schema() {
        return {
            id           : { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
            workspaceId  : { type: DataTypes.BIGINT, allowNull: false },
            email        : { type: DataTypes.STRING, allowNull: false },
            passwordHash : { type: DataTypes.STRING, allowNull: false },
            mqttToken    : { type: DataTypes.STRING },
            createdAt    : { type: DataTypes.DATE(sequelizeConstants.DATE_DATATYPE_PRECISION) },
            deletedAt    : { type: DataTypes.DATE(sequelizeConstants.DATE_DATATYPE_PRECISION) },
            updatedAt    : { type: DataTypes.DATE(sequelizeConstants.DATE_DATATYPE_PRECISION) },
            password     : { type: DataTypes.VIRTUAL }
        };
    }

    static options() {
        return {
            paranoid   : true,
            timestamps : true
        };
    }

    static initRelations(sequelize) {
        const WorkspaceModel = sequelize.model('Workspace');

        this.AssociationWorkspace = this.belongsTo(WorkspaceModel, { as: 'workspace', foreignKey: 'workspaceId' });
    }

    async checkPassword(plain) {
        return bcrypt.compare(plain, this.passwordHash);
    }
}
