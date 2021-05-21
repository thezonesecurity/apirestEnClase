//trabaja como un a funcion y no como una clase
import jsonwebtoken from"jsonwebtoken";
import {Request, Response, NextFunction} from "express";
import BusinessUser from "./businessController/BusinessUser";
import { IUser } from "./models/Users";
import { IRoles } from "./models/Roles";
var jsonwebtokenSecurity = (request: Request, response: Response, next: NextFunction) => {
    var token: string = request.headers["authorization"];
    if (!token) {
        response.status(300).json({serverResponse: "no tiene acceso al endpoint u servicio..."});
        return;
    }
    jsonwebtoken.verify(token, "secret", async(err , success: any) => {
        if (err) {
            response.status(300).json({ serverResponse: "token no valido --> " + err.message});
            return;
        }
        var id = success.id;
        var user: BusinessUser = new BusinessUser();
        var userdata: IUser = await user.addUsers(id);
        if (!userdata) {
            response.status(300).json({ serverResponse: "No valido"});
            return;
        }
        var roles: Array<IRoles> = userdata.roles;
        for( var i= 0; i < roles.length; i++) {
            if (
            request.url.toLocaleLowerCase().includes(roles[i].urn.toLocaleLowerCase()) &&
            request.method.toLocaleLowerCase().includes(roles[i].method.toLocaleLowerCase())
            ) {
                next();
                return;
            }
        }
        response.status(300).json({ serverResponse: "no cuenta con los permisos corespondientes..."});
    });
};
export default jsonwebtokenSecurity;