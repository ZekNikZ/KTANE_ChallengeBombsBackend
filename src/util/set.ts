export default class KeySet<T, I extends string | number> {
    map: Map<I, T>;
    idExtractor: (val: T) => I;

    constructor(idExtractor: (val: T) => I) {
        this.map = new Map();
        this.idExtractor = idExtractor;
    }

    add(...items: T[]): void {
        for (const item of items) {
            this.map.set(this.idExtractor(item), item);
        }
    }

    addAll(items: T[]): void {
        this.add(...items);
    }

    has(item: T): boolean {
        return this.map.get(this.idExtractor(item)) !== undefined;
    }

    values(): IterableIterator<T> {
        return this.map.values();
    }

    delete(item: T): boolean {
        return this.map.delete(this.idExtractor(item));
    }
}
