type TemplateType = 'custom' | 'id' | 'translate' | 'date';  // 'image' | 'link' | 'date';

export interface IColumn {
    field: string;
    header?: string;
    headerFunction?: () => string;
    template?: TemplateType;
    width?: string;
}

export class Column implements IColumn {
    constructor(public field: string, public header?: string,public headerFunction?: () => string, public template?: TemplateType, public width?: string) {}
}

export function createColumn({field, header, headerFunction, template, width}: IColumn): Column {
    return new Column(field, header, headerFunction, template, width);
}