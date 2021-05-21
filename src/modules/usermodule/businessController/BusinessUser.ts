import UsersModel, {IUser} from "../models/Users";
import UserModule from "../init";
import RolesModel, { IRoles } from "../models/Roles";
class BusinessUser {
    constructor() {

    }
    /** 
     * overload= es una sobre carga de funciones
     * **/
    public async readUsers(): Promise<Array<IUser>>;
    public async readUsers(id: string): Promise<IUser>;
    public async readUsers(query: any, skip: number, limit: number): Promise<Array<IUser>>;

    public async readUsers(params1?: string | any, params2?: number, params3?: number): Promise<Array<IUser> | IUser> {// Lee los users con ayuda del file  RouteController
        if (params1 && typeof params1 == "string") {
            var result: IUser = await UsersModel.findOne({ _id: params1});
            return result;
        } else if(params1) {
            let skip = params2? params2: 0; //si existe params2 sino params2 toma el valor 0
            let limit = params3? params3: 1; //si existe params3 sino params3 toma el valor 1
            let listUser: Array<IUser> = await UsersModel.find(params1).skip(params2).limit(params3);
            return listUser;
        } else {
            let listUser: Array<IUser> = await UsersModel.find();
            return listUser;
        }
    }//fin de  overload
    //eperaciones CRUD
    public async addUsers(user: IUser) { // Crea un user con ayuda del file  RouteController
        try {
        let userDb = new UsersModel(user);
        let result = await userDb.save();
        return result; 
        }
        catch (err) {
            return err;
        }
    }
    /*
    public async readUsers() {// Lee los users con ayuda del file  RouteController
        let listUser: Array<IUser> = await UsersModel.find();
        return listUser;
    }*/
    public async updateUsers(id: String, user: any) {// Actualiza los users con ayuda del file  RouteController
        let result = await UsersModel.update( { _id: id}, { $set: user});
        return result;
    }
    public async deleteUsers(id: String) {// Elimina los users con ayuda del file  RouteController
        let result = await UsersModel.remove({ _id: id});
        return result;
    }
    public async addRol(idUs: string, idRol: string) { //añade roles y hace referencia a file businessRoles y el proceso esta en file RouteCOntroller
        let user = await UsersModel.findOne({ _id: idUs});
        if (user != null ) {
            let rol = await RolesModel.findOne({ _id: idRol});// findOne ace referencia a un dato ene specifico
            if (rol != null) {
                user.roles.push(rol);
                return await user.save();
            }
            return null;
        }
        return null;
    }
    public async removeRol(idUs: string, idRol: string) {//elimina roles y hace referencia a file businessRoles y el proceso esta en file RouteCOntroller
        let user = await UsersModel.findOne({ _id: idUs});
        var rol = await RolesModel.findOne({ _id: idRol});// findOne ace referencia a un dato ene specifico
        if ( user != null && rol != null) {
            let newRoles: Array<IRoles> = user.roles.filter((intem: IRoles) => {
                if (intem.name == rol.name) {
                    return false;
                }
                return true;
            });
            user.roles = newRoles;
            return await user.save();
        }
        return null;
    }
}
export default BusinessUser;