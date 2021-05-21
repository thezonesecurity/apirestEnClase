import RolesModel, { IRoles } from "../models/Roles"
class BusinessRoles {
    constructor() {

    }
    public async createRol( rol: IRoles) {// crea un rol
        try { //para evitar k els erver se rompa evitando mandar un dato incorecto
        let roles = new RolesModel(rol);
        let result = await roles.save();
        return result;
        } 
        catch(error) {
            return null;
        } 
    }
    public async deleteRol(id: String) {
        let result = await RolesModel.remove({ _id: id });
        return result;
    }
}
export default BusinessRoles;