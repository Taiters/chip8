module.exports = {
    moduleFileExtensions: ['js', 'jsx'],
    moduleDirectories: ['node_modules'],

    moduleNameMapper: {
        '\\.(css|scss)$': 'identity-obj-proxy',
        '^chip8(.*)$': '<rootDir>/src$1',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
        '<rootDir>/__mocks__/fileMock.js'
    }
};
