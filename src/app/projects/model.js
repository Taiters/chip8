// @flow

export type Project = {
    id: ?string,
    title: string,
    code: string,
    user: bool,
};

export type Example = {
    title: string,
    load(): Promise<string>,
};