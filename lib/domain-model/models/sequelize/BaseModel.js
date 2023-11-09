import sequelizePackage from 'sequelize';

const { Model } = sequelizePackage;

export default class BaseModel extends Model {
    static init(sequelize, options = {}) {
        super.init(this.schema(sequelize), { ...options, sequelize });
    }

    static schema() {
        return {};
    }

    static options() {
        return {};
    }

    static initRelationsAndHooks(sequelize) {
        if (this.initRelations) this.initRelations(sequelize);
        if (this.initHooks) this.initHooks(sequelize);
    }
}
