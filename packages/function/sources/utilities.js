export const redefineContextName = (context, name) => {
    const descriptor = Reflect.getOwnPropertyDescriptor(context, 'name');

    Reflect.defineProperty(context, 'name', Object.assign(descriptor, { value: name }));
};

export const AnyType = [ undefined, null, Function ];
