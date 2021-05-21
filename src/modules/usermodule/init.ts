import { Express } from "express";
import Routes from "./routes";
class UserModule {
    private routes: Routes;
    constructor(root: string, app: Express) {
        console.log("Init user module");
        this.routes = new Routes(root, app);
    }
}
export default UserModule;