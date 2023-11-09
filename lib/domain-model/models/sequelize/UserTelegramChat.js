import sequelizePackage from 'sequelize';

import sequelizeConstants from '../../../constants/sequelize.js';
import BaseModel          from './BaseModel.js';
import User               from './User.js';

const { DataTypes } = sequelizePackage;

export default class UserTelegramChat extends BaseModel {
    static schema() {
        return {
            userId : {
                type       : DataTypes.BIGINT,
                primaryKey : true,
                allowNull  : false,
                references : {
                    model    : User,
                    key      : 'id',
                    onDelete : 'CASCADE'
                }
            },
            chatId    : { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, allowNull: false },
            createdAt : { type: DataTypes.DATE(sequelizeConstants.DATE_DATATYPE_PRECISION) },
            updatedAt : { type: DataTypes.DATE(sequelizeConstants.DATE_DATATYPE_PRECISION) }
        };
    }

    static options() {
        return {
            tableName : 'users_telegram_chats'
        };
    }

    static initRelations() {
        this.associationBelongsToUser = this.belongsTo(User, {
            foreignKey : 'userId',
            as         : 'user',
            onDelete   : 'CASCADE'
        });
    }
}
