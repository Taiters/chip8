// @flow

export type Project = {
    id: ?string,
    title: string,
    code: string
};

export type Example = {
    title: string,
    load(): Promise<string>,
};