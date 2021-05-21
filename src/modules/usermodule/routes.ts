import RoutesController from "./routeController/RoutesController";
import { Express } from "express";
import jsonwebtokenSecurity from "./middleware"
class Routes {
    private routesController: RoutesController;
    private routeparent: string;
    constructor(routeparent: string, app: Express) {
        this.routesController = new RoutesController();
        this.routeparent = routeparent;
        this.configureRoutes(app);
    }
    private configureRoutes(app: Express) {
        app.route(`${this.routeparent}/login`).post(this.routesController.login);
        //rutas de los usuarios--------------------------------------------------------------------------------
        app.route(`${this.routeparent}/users`).post(this.routesController.createUsers);//creara un usuario nuevo
        app.route(`${this.routeparent}/users`).get(jsonwebtokenSecurity, this.routesController.getUsers);//lee a un user
        app.route(`${this.routeparent}/users/:id`).put(this.routesController.upDateUsers);//lee a un user
        app.route(`${this.routeparent}/users/:id`).delete(jsonwebtokenSecurity, this.routesController.removeUsers);//lee a un user
        app.route(`${this.routeparent}/isprime`).post(this.routesController.isPrime);//ve si un nro es primo
        //para api rest con roles------------------------------------------------------------------------------
        app.route(`${this.routeparent}/roles`).post(this.routesController.createRol);//crea un rol para un user
        app.route(`${this.routeparent}/addrol/:id`).put(this.routesController.addRol);//actualiza un rol para un user
        app.route(`${this.routeparent}/roles/:id`).delete(this.routesController.removeRol);//elimina un rol para un user
        app.route(`${this.routeparent}/removerol/:id`).put(this.routesController.removeUserRol);//elimina un rol de un user asignado
        // para subir avatar a un usuario-------------------------------------------------------------
        app.route(`${this.routeparent}/uploadportrait/:id`).post(this.routesController.uploadPortrait);//sube un avatar a un user
        app.route(`${this.routeparent}/getportrait/:id`).get(this.routesController.getPortrait);//
    }
}
export default Routes;