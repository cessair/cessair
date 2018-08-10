// Type definitions for @cessair/object 1.0.1
// Definitions by: Yongbin Min <https://www.cichol.com>
// Definitions: https://github.com/cessair/cessair
// TypeScript Version: 3.0

export {};

type Primitive = boolean | number | string | symbol | void;
type NonFunctionPropertyNames < T > = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];
type Glaciated < T > = T extends any[] ? GlaciatedArray<T[number]> : T extends Primitive ? T : GlaciatedObject<T>;
interface GlaciatedArray<T> extends ReadonlyArray<Glaciated<T>> {}
type GlaciatedObject < T > = { readonly [P in NonFunctionPropertyNames<T>]: Glaciated<T[P]> };

declare global {
    interface ObjectConstructor {
        /**
         * Execute **Object.freeze** in deeply.
         *
         * @param target Target object.
         **/
        glaciate<T>(target: T[]): ReadonlyArray<Glaciated<T>>;
        glaciate<T extends Function>(target: T): T;
        glaciate<T>(target: T): T extends Primitive ? T : Glaciated<T>;

        /**
         * Create structure definition as known as **data class of Kotlin** or **case class of Scala**.
         **/
        struct<
            S extends { [P: string]: (new (...args: any[]) => any) | null | undefined },
            D extends { [P in keyof S]?: InstanceType<S[P]> }
        >(
            schema: S,
            defaultValues?: D
        ): (new (schema: { [P in keyof D]?: D[P] } & { [P in Exclude<keyof S, keyof D>]-?: InstanceType<S[P]> }) => {
            [P in keyof S]: InstanceType<S[P]>
        }) & {
            schema: S;
        };
    }
}
