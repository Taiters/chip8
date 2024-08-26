export type Project = {
    id: string | null,
    title: string,
    code: string | null,
    rom: Uint8Array | null,
    user: boolean,
};

export type Example = {
    title: string,
    load(): Promise<string>,
};