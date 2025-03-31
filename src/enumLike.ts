export type EnumLikeKey = string;
export type EnumLike<T extends EnumLikeKey> = { key: T };
export type EnumLikeDef<T extends EnumLike<EnumLikeKey> = EnumLike<EnumLikeKey>> = Record<
  string,
  T
>;

export class EnumLikeInternalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnumLikeInternalError';
  }
}

export class EnumLikeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnumLikeError';
  }
}

export class EnumLikeClass<
  TEnumLikeKey extends EnumLikeKey,
  TEnumLike extends EnumLike<TEnumLikeKey>,
> {
  private enumLikeByKey: Map<TEnumLikeKey, TEnumLike>;

  constructor(enumLikeDef: Readonly<EnumLikeDef<TEnumLike>>) {
    this.enumLikeByKey = new Map();

    for (const enumLike of Object.values(enumLikeDef)) {
      if (this.enumLikeByKey.has(enumLike.key)) {
        throw new EnumLikeError(`Duplicate key: ${enumLike.key}`);
      }

      this.enumLikeByKey.set(enumLike.key, enumLike);
    }
  }

  get(key: TEnumLike['key']): TEnumLike {
    const ret = this.enumLikeByKey.get(key);
    if (ret === undefined) {
      throw new EnumLikeInternalError(`EnumLike not found: ${key}`);
    }

    return ret;
  }

  parseKey(key: EnumLikeKey, error?: Error): TEnumLike {
    const enumLikeEntry = Array.from(this.enumLikeByKey.entries()).find(
      ([enumLikeKey]) => enumLikeKey === key
    );

    if (enumLikeEntry === undefined) {
      throw error ?? new EnumLikeError(`EnumLike not found: ${key}`);
    }

    return enumLikeEntry[1];
  }

  find(predicate: (enumLike: TEnumLike) => boolean): TEnumLike | null {
    return Array.from(this.enumLikeByKey.values()).find((enumLike) => predicate(enumLike)) ?? null;
  }

  findOrThrow(predicate: (enumLike: TEnumLike) => boolean, error?: Error): TEnumLike {
    const enumLike = this.find(predicate);
    if (enumLike === null) {
      throw error ?? new EnumLikeError('EnumLike not found');
    }

    return enumLike;
  }

  keys(): TEnumLike['key'][] {
    return Array.from(this.enumLikeByKey.keys());
  }

  values(): TEnumLike[] {
    return Array.from(this.enumLikeByKey.values());
  }
}
