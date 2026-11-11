import { ProductionInterface } from "./ProductionInterface";

export interface ProductionLogInterface{
    id : number;
    production : ProductionInterface;
    qty: number;
    unit : string;
    createAt: Date;
    remark: string
}