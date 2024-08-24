// @flow

export type Project = {
    id: ?string,
    title: string,
    code: ?string,
    rom: ?Uint8Array,
    user: bool,
};

export type Example = {
    title: string,
    load(): Promise<string>,
};