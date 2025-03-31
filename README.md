# Enum-Like
A TypeScript library for creating enum-like structures, designed for those who want to avoid using native TypeScript enums.

## Basic Usage
```ts
const paymentDef = new EnumLikeClass({
  GOOGLE: { key: 'google', displayName: 'Google', dbValue: 1 },
  APPLE: { key: 'apple', displayName: 'Apple', dbValue: 2 }
} as const);

// parameter type is `'google' | 'apple'`
paymentDef.get('google'); // returns reference of paymentDef.GOOGLE

// typeof enumLike.dbValue is `1 | 2`
paymentDef.find((enumLike) => enumLike.dbValue === 1) // returns reference of paymentDef.GOOGLE

const invalidDbValue: number = 2;
paymentDef.find((enumLike) => enumLike.dbValue === invalidDbValue) // returns null
paymentDef.findOrThrow((enumLike) => enumLike.dbValue === invalidDbValue) // throws EnumLikeError

paymentDef.parseKey('google') // returns reference of paymentDef.GOOGLE
paymentDef.parsedKey('invalid') // throws EnumLikeError

paymentDef.keys() // return type is `'google' | 'apple'`
paymentDef.values() // return type is `paymentDef['GOOGLE' | 'APPLE']`
```
