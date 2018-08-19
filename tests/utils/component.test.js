import {classNames} from 'chip8/utils/component.js';

describe('classNames', () => {
    test('returns expected class names', () => {
        const result = classNames({
            foo: false,
            bar: true,
            baz: false,
            hello: true,
        });

        expect(result).toEqual('bar hello');
    });
});
