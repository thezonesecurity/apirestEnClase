import mongoose, { Schema, Document } from "mongoose";
import RolesModel, { IRoles } from "./Roles";
//import app from "../../../app";
export interface ISimpleUser { //solo funciona como una interface sin eredar del documento
    username?: string;
    email?: string;
    registerdate?: Date;
    password?: String;
    roles?: Array<IRoles>;
    uriavatar?: string; //va a obtener la uri de la app k se kiere acceder -> fileuplorad
    pathavatar?: string; //va a tener la direccion del servidor > fileuplorad
}
export interface IUser extends Document { //es una interface que ereda del documento
    username: string;
    email: string;
    registerdate: Date;
    password: String;
    roles: Array<IRoles>;
    uriavatar: string;
    pathavatar: string;
}
const userSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    registerDate: { type: Date, required: false},
    password: { type: String, required: true},
    roles: { type: [RolesModel.schema] }, // hace referencia a roleschema de file Roles
    uriavatar: { type: String},
    pathavatar: {type: String}
});
export default mongoose.model<IUser>("User", userSchema);