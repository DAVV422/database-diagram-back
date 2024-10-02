export interface NodoAtributo {
    name: string;
    type: string;
    visibility: string;
}

export interface NodoDiagrama {
    key: number;
    name: string;
    loc: any;
    attributes: Array<NodoAtributo>;
}