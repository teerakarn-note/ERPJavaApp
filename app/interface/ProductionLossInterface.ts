import { ProductionInterface } from "./ProductionInterface";

export interface ProductionLossInterface{
    id : number
    production: ProductionInterface
    qty: number
    unit: string
    createAt: Date
    remark: string

}