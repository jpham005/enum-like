import { describe, expect, test } from 'vitest';
import {
  EnumLikeClass,
  EnumLikeError,
  EnumLikeInternalError,
  type EnumLikeDef,
} from '../src/enumLike';

describe('EnumLikeClass', () => {
  describe('constructor', () => {
    test('can construct with valid enumLikeDef', () => {
      new EnumLikeClass({
        TEST: { key: 'test', value: 1 },
        TEST2: { key: 'test2', value: 2 },
      } as const satisfies EnumLikeDef<{ key: string; value: number }>);
    });

    test('must have narrowed types after construction', () => {
      const enumLikeDef = {
        TEST: { key: 'test', value: 1 },
        TEST2: { key: 'test2', value: 2 },
      } as const;

      const enumLike = new EnumLikeClass(enumLikeDef);

      expect(enumLike.get('test')).toBe(enumLikeDef.TEST);
      expect(enumLike.get('test2')).toBe(enumLikeDef.TEST2);
      // @ts-expect-error should raise type check error
      expect(() => enumLike.get('test3')).toThrowError(EnumLikeInternalError);
    });

    test('cannot construct with duplicated keys', () => {
      expect(() => {
        new EnumLikeClass({
          TEST: { key: 'test', value: 1 },
          TEST2: { key: 'test', value: 2 },
        } as const);
      }).toThrowError(EnumLikeError);
    });
  });

  describe('get()', () => {
    test('must return reference of input enumLike', () => {
      const enumLikeDef = {
        TEST: { key: 'test', value: 1 },
      } as const;
      const enumLike = new EnumLikeClass(enumLikeDef);

      expect(enumLike.get('test')).toBe(enumLikeDef.TEST);
    });
  });

  describe('parseKey()', () => {
    test('when key matches, must return reference of input enumLike', () => {
      const enumLikeDef = {
        TEST: { key: 'test', value: 1 },
      } as const;
      const enumLike = new EnumLikeClass(enumLikeDef);

      expect(enumLike.parseKey('test')).toBe(enumLikeDef.TEST);
    });

    test('when key matches, return type must be narrowed', () => {
      const enumLikeDef = {
        TEST: { key: 'test', value: 1 },
      } as const;
      const enumLike = new EnumLikeClass(enumLikeDef);

      const parsed = enumLike.parseKey('test');

      expect(parsed.key === 'test').toBe(true);
      // @ts-expect-error should raise type check error
      expect(parsed.key === 'test1').toBe(false);
      expect(parsed.value === 1).toBe(true);
      // @ts-expect-error should raise type check error
      expect(parsed.value === 2).toBe(false);
    });

    test('when key does not match, must throw error', () => {
      const enumLikeDef = {
        TEST: { key: 'test', value: 1 },
      } as const;
      const enumLike = new EnumLikeClass(enumLikeDef);

      expect(() => enumLike.parseKey('test2')).toThrowError();
    });

    test('when key does not match and error is provided, must throw provided error', () => {
      const enumLikeDef = {
        TEST: { key: 'test', value: 1 },
      } as const;
      const enumLike = new EnumLikeClass(enumLikeDef);
      const error = new Error('Custom error');

      expect(() => enumLike.parseKey('test2', error)).toThrowError(error);
    });
  });

  describe('find', () => {
    test('when predicate returns true, must return reference of input enumLike', () => {
      const enumLikeDef = {
        TEST: { key: 'test', value: 1 },
      } as const;
      const enumLike = new EnumLikeClass(enumLikeDef);

      const found = enumLike.find((enumLike) => enumLike.key === 'test');

      expect(found).toBe(enumLikeDef.TEST);
    });

    test('return type must be narrowed', () => {
      const enumLikeDef = {
        TEST: { key: 'test', value: 1 },
      } as const;
      const enumLike = new EnumLikeClass(enumLikeDef);

      const found = enumLike.find((enumLike) => enumLike.key === 'test');

      expect(found?.key === 'test').toBe(true);
      // @ts-expect-error should raise type check error
      expect(found?.key === 'test1').toBe(false);
      expect(found?.value === 1).toBe(true);
      // @ts-expect-error should raise type check error
      expect(found?.value === 2).toBe(false);
    });

    test('when predicate returns false, must return null', () => {
      const enumLikeDef = {
        TEST: { key: 'test', value: 1 },
      };

      const enumLike = new EnumLikeClass(enumLikeDef);

      const found = enumLike.find((enumLike) => enumLike.key === 'test2');
      expect(found).toBe(null);
    });
  });

  describe('findOrThrow', () => {
    test('when predicate returns true, must return reference of input enumLike', () => {
      const enumLikeDef = {
        TEST: { key: 'test', value: 1 },
      } as const;
      const enumLike = new EnumLikeClass(enumLikeDef);

      const found = enumLike.findOrThrow((enumLike) => enumLike.key === 'test');

      expect(found).toBe(enumLikeDef.TEST);
    });

    test('when predicate returns false, must throw error', () => {
      const enumLikeDef = {
        TEST: { key: 'test', value: 1 },
      } as const;
      const enumLike = new EnumLikeClass(enumLikeDef);

      // @ts-expect-error should raise type check error
      expect(() => enumLike.findOrThrow((enumLike) => enumLike.key === 'test2')).toThrowError();
    });

    test('when predicate returns false and error is provided, must throw provided error', () => {
      const enumLikeDef = {
        TEST: { key: 'test', value: 1 },
      } as const;
      const enumLike = new EnumLikeClass(enumLikeDef);
      const error = new Error('Custom error');

      expect(() =>
        // @ts-expect-error should raise type check error
        enumLike.findOrThrow((enumLike) => enumLike.key === 'test2', error)
      ).toThrowError(error);
    });
  });

  describe('keys()', () => {
    test('must return all keys of enumLikeDef', () => {
      const enumLikeDef = {
        TEST: { key: 'test', value: 1 },
        TEST2: { key: 'test2', value: 2 },
      } as const;

      const enumLike = new EnumLikeClass(enumLikeDef);

      expect(enumLike.keys()).toEqual(['test', 'test2']);
    });

    test('return type of keys() must have union type of provided EnumLikeDef keys', () => {
      const enumLikeDef = {
        TEST: { key: 'test', value: 1 },
        TEST2: { key: 'test2', value: 2 },
      } as const;

      const enumLike = new EnumLikeClass(enumLikeDef);

      for (const key of enumLike.keys()) {
        if (key === 'test') {
          expect(enumLike.get(key)).toBe(enumLikeDef.TEST);
        }

        if (key === 'test2') {
          expect(enumLike.get(key)).toBe(enumLikeDef.TEST2);
        }

        // @ts-expect-error should raise type check error
        if (key === 'test3') {
          expect(() => enumLike.get(key)).toThrowError(EnumLikeInternalError);
        }
      }
    });
  });

  describe('values()', () => {
    test('must return all values of enumLikeDef', () => {
      const enumLikeDef = {
        TEST: { key: 'test', value: 1 },
        TEST2: { key: 'test2', value: 2 },
      };

      const enumLike = new EnumLikeClass(enumLikeDef);

      expect(enumLike.values()).toEqual([enumLikeDef.TEST, enumLikeDef.TEST2]);
    });

    test('return type of values() must have union type of provided EnumLikeDef values', () => {
      const enumLikeDef = {
        TEST: { key: 'test', value: 1 },
        TEST2: { key: 'test2', value: 2 },
      } as const;

      const enumLike = new EnumLikeClass(enumLikeDef);

      for (const value of enumLike.values()) {
        if (value.key === 'test') {
          expect(enumLike.get(value.key)).toBe(enumLikeDef.TEST);
        }

        if (value.key === 'test2') {
          expect(enumLike.get(value.key)).toBe(enumLikeDef.TEST2);
        }

        // @ts-expect-error should raise type check error
        if (value.key === 'test3') {
          // @ts-expect-error should raise type check error
          expect(enumLike.parseKey(value.key)).toThrowError();
        }
      }
    });
  });
});
