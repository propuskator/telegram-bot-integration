import sequelizePackage from 'sequelize';

import sequelizeConstants from '../../../constants/sequelize.js';
import BaseModel          from './BaseModel.js';

const { DataTypes, Op, VIRTUAL } = sequelizePackage;
const VIRTUAL_CODE_LENGTH        = 12;

export default class AccessSubject extends BaseModel {
    static schema(sequelize) {
        return {
            id             : { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
            workspaceId    : { type: DataTypes.BIGINT, allowNull: false },
            userId         : { type: DataTypes.BIGINT, allowNull: true },
            name           : { type: DataTypes.STRING, allowNull: false, unique: true },
            enabled        : { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
            isArchived     : { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
            isInvited      : { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
            mobileEnabled  : { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
            position       : { type: DataTypes.STRING, allowNull: true },
            email          : { type: DataTypes.STRING, allowNull: true, unique: true },
            phone          : { type: DataTypes.STRING, allowNull: true },
            avatar         : { type: DataTypes.STRING, allowNull: true },
            avatarColor    : { type: DataTypes.STRING, allowNull: true },
            popularityCoef : { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
            createdAt      : { type: DataTypes.DATE(sequelizeConstants.DATE_DATATYPE_PRECISION) },
            updatedAt      : { type: DataTypes.DATE(sequelizeConstants.DATE_DATATYPE_PRECISION) },
            deletedAt      : {
                type         : DataTypes.DATE(sequelizeConstants.DATE_DATATYPE_PRECISION),
                allowNull    : false,
                defaultValue : { [Op.eq]: sequelize.literal('0') } // defaultValue here is used only in where closure by sequelize, it seems to be the sequelize bug
            },
            virtualCode : { type: DataTypes.STRING(VIRTUAL_CODE_LENGTH), allowNull: false },
            mobileToken : {
                type : VIRTUAL,
                get() {
                    return `sbj-${this.virtualCode}`;
                }
            },
            canAttachTokens : { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
        };
    }

    static options() {
        return {
            paranoid   : true,
            timestamps : true,
            createdAt  : false,
            updatedAt  : false
        };
    }
}
