import { ProductionInterface } from "./ProductionInterface";
import { StoreInterface } from "./StoreInterface";

export interface StoreImportInterface {
    id: number;
    store: StoreInterface;
    production: ProductionInterface | null;
    qty: number;
    remark: string;
    importDate: string;
}