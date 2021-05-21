import { Request, Response } from "express";
import BusinessUser from "../businessController/BusinessUser";
import sha1 from "sha1";//para encriptar el pàssword
import { ISimpleUser, IUser } from "../models/Users";
import BusinessRoles from "../businessController/BusinessRoles";
import jsonwebtoken from "jsonwebtoken";
import isEmpty from "is-empty";
import path from "path";
interface Icredentials {
    email: string,
    password: string
}
class RoutesController {
    constructor() {

    }
    public async login(request: Request, response: Response) {
        var credentials: Icredentials = request.body;
        if (credentials.email == undefined) {
            response.status(300).json({ serverResponse: "Es necesario el parametro de email..."});
            return;
        }
        if (credentials.password == undefined) {
            response.status(300).json({ serverResponse: "Es necesario el parametro del password..."});
            return;
        }
        credentials.password = sha1(credentials.password);//se cifra el password
        const user: BusinessUser = new BusinessUser();
        let result: Array<IUser> = await user.readUsers(credentials, 0, 1);
        if ( result.length == 1) {//si los credenciales son aceptados
            var loginUser: IUser= result[0];
            var token: string = jsonwebtoken.sign({id: loginUser._id, email: loginUser}, "secret");
            response.status(200).json({ severResponse: {email: loginUser.email, username: loginUser, token} });
            return;
        }
        response.status(200).json({ severResponse: "credenciales no validos u incorrectas..."});
    }
    public async createUsers(request: Request, response: Response) {//ayuda con la creacion de un user
       //return response.status(201).json({ server: "hola mundo- meethod post" });
        var user: BusinessUser = new BusinessUser();
        var userData = request.body;
        userData["registerdate"] = new Date();
        userData["password"] = sha1(userData["password"]);//para encriptar el password
        let result = await user.addUsers(userData);
        response.status(201).json({ serverResponse: result });

    }
    public async getUsers(request: Request, response: Response) {//ayuda a ver los user
        //return response.status(201).json({ server: "hola mundo- meethod get" });
        var user: BusinessUser = new BusinessUser();
        const result: Array<IUser> = await user.readUsers();
        response.status(200).json({ severResponse: result});

    }
    public async upDateUsers(request: Request, response: Response) {//ayuda con la actualizacion de user
        var user: BusinessUser = new BusinessUser();
        let id: string = request.params.id;
        var params = request.body;
        var result = await user.updateUsers(id, params);
        response.status(200).json({ serverResponse: result});
    }
    public async removeUsers(request: Request, response: Response) {//aytuda a eliminar los user
        var user: BusinessUser = new BusinessUser();
        let id: string = request.params.id;
        let result = await user.deleteUsers(id);
        response.status(200).json({ serverRespopnse: result});
    }
    //ejemplo
    public async isPrime(request: Request, response: Response) {// ve si un nro es primo
        const data = request.body;
        var number = Number(data.number);
        for (var i = 2; i < number / 2; i++) {
            if (number % i == 0) {
                return response.status(200).json({ number, msn: "No es primo" });
            }
        }
        return response.status(200).json({ number, msn: "Es primo" })
    }
    //para api rest --------------------------------------------------------------------------------

    public async addRol(request: Request, response: Response) {//añade un rol de un user
        let idUs: string = request.params.id;
        let idRol = request.body.idRol;
        if ( idUs == null && idRol == null) {
            response.status(300).json({ serverResponse: "No se definio los id de uaurio ni de roles"});
            return;
        } 
        var user: BusinessUser = new BusinessUser();
        var result = await user.addRol(idUs, idRol);
        if ( result == null ) {
            response.status(300).json({ serverResponse: "el rol o ususario no existe"});
            return ;
        }
        response.status(200).json({ serverResponse: result});
    }
    public async createRol(request: Request, response: Response) {//crea un rol de un user
        let roles: BusinessRoles = new BusinessRoles();
        var rolesData: any = request.body;
        let result = await roles.createRol(rolesData);
        if (result == null) {
            response.status(300).json({ serverResponse: "el rol tiene parametros no validos "});
            return;
        }
        response.status(201).json({ serverResponse: result });
    }
    public async removeRol(request: Request, response: Response) {//elimina un rol
        let roles: BusinessRoles = new BusinessRoles();
        let idRol: string = request.params.id;
        let result = await roles.deleteRol(idRol);
        response.status(201).json({ serverResponse: result });
    }
    public async removeUserRol(request: Request, response: Response) {//elimina un rol de un user
        let roles: BusinessUser = new BusinessUser();
        let idUs: string = request.params.id;
        let idRol: string = request.body.idRol;
        let result = await roles.removeRol(idUs, idRol);
        response.status(200).json({ serverResponse: result });
    }
    // para config el avatar.........................................................
    /*PARA SUBIR SOLO UN AVATAR
    public async uploadPortrait(request: Request, response: Response) {//sube avatar
        var id: string = request.params.id;
        if (!id) {
            response.status(300).json({ serverResponse: "El id es requerido para subir el avatar..." });
            return;
        }
        if (isEmpty(request.files)) {
            response.status(300).json({ serverResponse: "No existe el archivo adjunto del avatar..."});
            return;
        }
        var user: BusinessUser = new BusinessUser();
        var userToUpdate: IUser = await user.readUsers(id);
        if (!userToUpdate) {
            response.status(300).json({ serverResponse: "el id de usuario es incorrecto..."});
            return;
        }
        var dir = `${__dirname}/../../../../avatarfiles`;
        //console.log(dir);//muestra la cadena de la variable dir
        //console.log(path.resolve(dir));//
        var absolutepath = path.resolve(dir);
        var files: any = request.files;
        var file: any = files.portrait;
        console.log(file);//para ver metadatos del archivo
        var filehash: string = sha1(new Date().toString()).substr(0, 7);
        var newname: string = `${filehash}_${file.name}`;
        var totalpath = `${absolutepath}/${newname}`;
        file.mv(totalpath, (err: any, success: any) => {
            if (err) {
                response.status(300).json({ serverResponse: "no se pudo guardar el archivo..."});
                return;
            }
        });
        userToUpdate.uriavatar = "/api/getportrait/" + id;
        userToUpdate.pathavatar = totalpath;
        var userResult: IUser = await userToUpdate.save();
        var simpleUser: ISimpleUser = {username: userResult.username, uriavatar:userResult.uriavatar, 
            pathavatar: userResult.pathavatar};
        response.status(200).json({ serverResponse: simpleUser });
    }
    */
   //PARA SUBIR MAS DE UN AVATAR
   public async uploadPortrait(request: Request, response: Response) {//sube avatar 2 oi mas avataares
        var id: string = request.params.id;
        if (!id) {
            response.status(300).json({ serverResponse: "El id es requerido para subir el avatar..." });
            return;
        }
        if (isEmpty(request.files)) {
            response.status(300).json({ serverResponse: "No existe el archivo adjunto del avatar..."});
            return;
        }
        var user: BusinessUser = new BusinessUser();
        var userToUpdate: IUser = await user.readUsers(id);
        if (!userToUpdate) {
            response.status(300).json({ serverResponse: "el id de usuario es incorrecto..."});
            return;
        }
        var dir = `${__dirname}/../../../../avatarfiles`;
        var absolutepath = path.resolve(dir);
        var files: any = request.files;
        
        var key: Array<string> = Object.keys(files);//para ver metadatos del archivo
        var copyDirectory = (totalpath: string, file: any) => {//--------------------------
            return new Promise((resolve, reject) => {
                file.mv(totalpath, (err: any, success: any) => {
                    if (err) {
                        resolve(false);
                        return;
                    }
                    resolve(true);//nos dick se a subidocon exito el avatar
                    return;
                });
            });
        };
        for (var i= 0; i < key.length; i++) {
            var file: any = files[key[i]];
            var filehash: string = sha1(new Date().toString()).substr(0, 7);
            var newname: string = `${filehash}_${file.name}`;
            var totalpath = `${absolutepath}/${newname}`;
            await copyDirectory(totalpath, file);
            userToUpdate.uriavatar = "/api/getportrait/" + id;
            userToUpdate.pathavatar = totalpath;
            var userResult: IUser = await userToUpdate.save();    
        }
        var simpleUser: ISimpleUser = {username: userResult.username, uriavatar:userResult.uriavatar, 
            pathavatar: userResult.pathavatar};
        response.status(200).json({ serverResponse: simpleUser });   
    }

    public async getPortrait(request: Request, response: Response) {////para ver el avatar
        var id: string = request.params.id;
        if (!id) {
            response.status(300).json({ serverResponse: "idenetificador no encontrado..."});
            return;
        }
        var user: BusinessUser = new BusinessUser();
        var userData: IUser = await user.readUsers(id);
        if (!userData) {
            response.status(300).json({ serverResponse: "Error no existe usuario"});
            return;
        } 
        if (userData.pathavatar == null) {
            response.status(300).json({serverResponse: "no exsite avatar..."});
            return;
        }
        response.sendFile(userData.pathavatar);
        response.sendFile(userData.pathavatar);//para ver el avatar
    }
    
}
export default RoutesController;