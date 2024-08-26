export type Project = {
    title: string,
    code: string | null,
    rom: Uint8Array | null,
    file: FileSystemHandle | null,
    unsavedChanges: boolean,
};

export type Example = {
    title: string,
    load(): Promise<string>,
};