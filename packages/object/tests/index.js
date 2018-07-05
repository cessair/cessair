import '../sources';

test('should be able to freeze an object deeply', () => {
    const testObject = {
        array: [ 1, 2, 3 ],

        nested: {
            array: [ 4, 5, 6 ],
            string: 'Hello, world!'
        }
    };

    Object.glaciate(testObject);

    expect(() => testObject.array.push(4)).toThrow(TypeError);
    expect(() => testObject.nested.array.push(7)).toThrow(TypeError);

    expect(() => {
        testObject.nested.string = 'Yeah!';
    }).toThrow(TypeError);
});

test('should be able to construct structure by given schema', () => {
    const Human = Object.struct({ name: String, age: Number });
    const [ alice, bob ] = [ new Human({ name: 'Alice', age: 19 }), new Human({ name: 'Bob', age: 18 }) ];

    // Should be share the same schema.
    expect(Human.schema).toStrictEqual({ name: String, age: Number });

    // Should have properties defined by the schema.
    expect(alice.name).toBe('Alice');
    expect(alice.age).toBe(19);
    expect(bob.name).toBe('Bob');
    expect(bob.age).toBe(18);

    // Should be able to set new value.
    alice.name = 'Alice the Kitty';
    bob.age = 20;

    expect(alice.name).toBe('Alice the Kitty');
    expect(bob.age).toBe(20);

    // Should not be able to define new property.
    expect(() => {
        alice.height = 168;
    }).toThrow(TypeError);

    expect(() => {
        bob.weight = 72;
    }).toThrow(TypeError);

    expect(alice).not.toHaveProperty('height');
    expect(bob).not.toHaveProperty('weight');
});

test('should be able to construct structure with default values', () => {
    const AnimalSchema = { class: String, family: String, species: String };

    const [ Animal, Mammalia, Felidae, Tiger ] = [
        Object.struct(AnimalSchema),
        Object.struct(AnimalSchema, { class: 'Mammalia' }),
        Object.struct(AnimalSchema, { class: 'Mammalia', family: 'Felidae' }),
        Object.struct(AnimalSchema, { class: 'Mammalia', family: 'Felidae', species: 'Panthera tigris' })
    ];

    const [ tigerAsAnimal, tigerAsMammalia, tigerAsFelidae, tiger ] = [
        new Animal({ class: 'Mammalia', family: 'Felidae', species: 'Panthera tigris' }),
        new Mammalia({ family: 'Felidae', species: 'Panthera tigris' }),
        new Felidae({ species: 'Panthera tigris' }),
        new Tiger({})
    ];

    // Should be share the same schema.
    expect(Animal.schema).toStrictEqual(Mammalia.schema);
    expect(Mammalia.schema).toStrictEqual(Felidae.schema);
    expect(Felidae.schema).toStrictEqual(Tiger.schema);

    // Should be the same as each other.
    expect(tigerAsAnimal).toStrictEqual(tigerAsMammalia);
    expect(tigerAsMammalia).toStrictEqual(tigerAsFelidae);
    expect(tigerAsFelidae).toStrictEqual(tiger);

    // Should be able to ignore default value by initializer.
    const lionAsAnimal = new Animal({ class: 'Mammalia', family: 'Felidae', species: 'Panthera leo' });
    const lionByTiger = new Tiger({ species: 'Panthera leo' });

    expect(lionAsAnimal).toStrictEqual(lionByTiger);
});
