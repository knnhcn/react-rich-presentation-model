import {
  RichPresentationModel,
  useReactRichPresentationModelFactory,
} from "../index";
import { RichPresentationModelConstructorOptions } from "../interfaces";
import { act, renderHook } from "@testing-library/react-hooks";

describe("Testing object initialization", () => {
  test("Initializes correctly on init", () => {
    const initValue = "initial value";

    const model: RichPresentationModel<string> = new RichPresentationModel({
      label: "A Rich Presentation Model",
      value: initValue,
      baseValue: initValue,
      editable: true,
      enabled: true,
      optional: false,
      tooltip: "Hello, World!",
      widgethint: "model",
      equals: ({ value, baseValue }) => true,
      validator: ({ newValue }) => true,
    });

    expect(model.value).toBe(initValue);
    expect(model.baseValue).toBe(initValue);
    expect(model.valid).toBe(true);
    expect(model.dirty).toBe(false);
  });

  test("Testing comparator on init", () => {
    const baseValue = "initial value";
    const differentValue = "different value";

    const model: RichPresentationModel<string> = new RichPresentationModel({
      label: "A Rich Presentation Model",
      value: differentValue,
      baseValue: baseValue,
      editable: true,
      enabled: true,
      optional: false,
      tooltip: "Hello, World!",
      widgethint: "model",
      equals: ({ value, baseValue }) => value === baseValue,
      validator: ({ newValue }) => true,
    });

    expect(model.value).toBe(differentValue);
    expect(model.baseValue).toBe(baseValue);
    expect(model.valid).toBe(true);
    expect(model.dirty).toBe(true);
  });

  test("Testing validator on init", () => {
    const testValue = 100;
    const testBaseValue = 50;

    const model: RichPresentationModel<number> = new RichPresentationModel({
      label: "A Rich Presentation Model",
      value: testValue,
      baseValue: testBaseValue,
      editable: true,
      enabled: true,
      optional: false,
      tooltip: "Hello, World!",
      widgethint: "model",
      equals: ({ value, baseValue }) => true,
      validator: ({ newValue }) => newValue < 150,
    });

    expect(model.value).toBe(testValue);
    expect(model.baseValue).toBe(testBaseValue);
    expect(model.valid).toBe(true);
    expect(model.dirty).toBe(false);
  });
});

describe("Testing value changes", () => {
  test("Emits when value changes", () => {
    const baseValue = 100;
    let currentValue = baseValue;

    const model: RichPresentationModel<number> = new RichPresentationModel({
      label: "A Rich Presentation Model",
      value: currentValue,
      baseValue: baseValue,
      editable: true,
      enabled: true,
      optional: false,
      tooltip: "Hello, World!",
      widgethint: "model",
      equals: ({ value, baseValue }) => true,
      validator: ({ newValue }) => true,
    });

    model.modelHasChanged.subscribe(() => {
      currentValue = 0;
    });

    model.value = 5;

    expect(currentValue).toBe(0);
  });

  test("Sets dirty and valid correctly on change", () => {
    const testValue = 100;
    const testBaseValue = testValue;

    const model: RichPresentationModel<number> = new RichPresentationModel({
      label: "A Rich Presentation Model",
      value: testValue,
      baseValue: testBaseValue,
      editable: true,
      enabled: true,
      optional: false,
      tooltip: "Hello, World!",
      widgethint: "model",
      equals: ({ value, baseValue }) => value === baseValue,
      validator: ({ newValue }) => newValue < 500,
    });

    model.value = 1000;

    expect(model.value).toBe(1000);
    expect(model.baseValue).toBe(testBaseValue);
    expect(model.dirty).toBe(true);
    expect(model.valid).toBe(false);
  });

  test("Sets dirty correctly on base value change", () => {
    const testValue = 100;
    const testBaseValue = testValue;

    const model: RichPresentationModel<number> = new RichPresentationModel({
      label: "A Rich Presentation Model",
      value: testValue,
      baseValue: testBaseValue,
      editable: true,
      enabled: true,
      optional: false,
      tooltip: "Hello, World!",
      widgethint: "model",
      equals: ({ value, baseValue }) => value === baseValue,
      validator: ({ newValue }) => newValue < 500,
    });

    model.baseValue = 5000;

    expect(model.value).toBe(testValue);
    expect(model.baseValue).toBe(5000);
    expect(model.dirty).toBe(true);
  });
});

describe("Testing different validations", () => {
  test("String email regex validation", () => {
    const email = "mail@somearbitrarymailaddresse.com";

    const model: RichPresentationModel<string> = new RichPresentationModel({
      label: "A Rich Presentation Model",
      value: email,
      baseValue: email,
      editable: true,
      enabled: true,
      optional: false,
      tooltip: "Hello, World!",
      widgethint: "model",
      equals: ({ value, baseValue }) => true,
      validator: ({ newValue }) =>
        RegExp(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/).test(newValue),
    });

    expect(model.value).toBe(email);
    expect(model.baseValue).toBe(email);
    expect(model.valid).toBe(true);
    expect(model.dirty).toBe(false);
  });

  test("Number is integer validation", () => {
    const shortPi = 3.14159;

    const model: RichPresentationModel<number> = new RichPresentationModel({
      label: "A Rich Presentation Model",
      value: shortPi,
      baseValue: shortPi,
      editable: true,
      enabled: true,
      optional: false,
      tooltip: "Hello, World!",
      widgethint: "model",
      equals: ({ value, baseValue }) => true,
      validator: ({ newValue }) => Number.isInteger(newValue),
    });

    expect(model.value).toBe(shortPi);
    expect(model.baseValue).toBe(shortPi);
    expect(model.valid).toBe(false);
    expect(model.dirty).toBe(false);
  });
});

describe("Testing complex object", () => {
  interface Limbs {
    legs: number;
    arms: number;
    head: number;
  }
  interface Humanable {
    firstName: string;
    lastName: string;
    age: number;
    limbs: Limbs;
    calculateSomething: () => number;
  }

  const isHumanable = (human: Humanable) =>
    human.age < 100 &&
    human.limbs.head === 1 &&
    human.limbs.arms === 2 &&
    human.limbs.legs === 2;

  const humanableEquals = (human: Humanable, otherHuman: Humanable) => {
    const sameLimbs =
      human.limbs.arms === otherHuman.limbs.arms &&
      human.limbs.head === otherHuman.limbs.head &&
      human.limbs.legs === otherHuman.limbs.legs;

    const sameCalculation =
      human.calculateSomething() === otherHuman.calculateSomething();

    const sameOthers =
      human.firstName === otherHuman.firstName &&
      human.lastName === otherHuman.lastName &&
      human.age === otherHuman.age;

    return sameLimbs && sameCalculation && sameOthers;
  };

  const human: Humanable = {
    firstName: "Ocean",
    lastName: "Sear",
    age: 42,
    limbs: {
      legs: 2,
      arms: 2,
      head: 1,
    },
    calculateSomething: () => 1 + 1,
  };

  const dog: Humanable = {
    firstName: "Spike",
    lastName: "Dogge",
    age: 3,
    limbs: {
      legs: 4,
      arms: 0,
      head: 1,
    },
    calculateSomething: () => 1 + 1,
  };

  test("A human has 1 head, 2 legs and 2 arms.", () => {
    const model: RichPresentationModel<Humanable> = new RichPresentationModel({
      label: "A Rich Presentation Model",
      value: human,
      baseValue: human,
      editable: true,
      enabled: true,
      optional: false,
      tooltip: "Hello, World!",
      widgethint: "model",
      equals: ({ value, baseValue }) => humanableEquals(value, baseValue),
      validator: ({ newValue }) => isHumanable(newValue),
    });

    expect(model.value).toBe(human);
    expect(model.baseValue).toBe(human);
    expect(model.valid).toBe(true);
    expect(model.dirty).toBe(false);
  });

  test("A dog ist not a human.", () => {
    const model: RichPresentationModel<Humanable> = new RichPresentationModel({
      label: "A Rich Presentation Model",
      value: dog,
      baseValue: dog,
      editable: true,
      enabled: true,
      optional: false,
      tooltip: "Hello, World!",
      widgethint: "model",
      equals: ({ value, baseValue }) => humanableEquals(value, baseValue),
      validator: ({ newValue }) => isHumanable(newValue),
    });

    expect(model.value).toBe(dog);
    expect(model.baseValue).toBe(dog);
    expect(model.valid).toBe(false);
    expect(model.dirty).toBe(false);
  });
});

describe("Testing model factory hook", () => {
  test("Testing hook creation", () => {
    const valueToCheck = "Value";

    const options: RichPresentationModelConstructorOptions<string> = {
      label: "A Rich Presentation Model",
      value: valueToCheck,
      baseValue: valueToCheck,
      editable: true,
      enabled: true,
      optional: false,
      tooltip: "Hello, World!",
      widgethint: "model",
      equals: ({ value, baseValue }) => true,
      validator: ({ newValue }) => newValue.length < 255,
    };

    const { result } = renderHook(() =>
      useReactRichPresentationModelFactory(options)
    );

    expect(result.current.uiModel.value).toBe(valueToCheck);
  });

  test("Testing hook updating ui model", () => {
    const options: RichPresentationModelConstructorOptions<string> = {
      label: "A Rich Presentation Model",
      value: "Value",
      baseValue: "Base value",
      editable: true,
      enabled: true,
      optional: false,
      tooltip: "Hello, World!",
      widgethint: "model",
      equals: ({ value, baseValue }) => true,
      validator: ({ newValue }) => newValue.length < 255,
    };

    const { result } = renderHook(() =>
      useReactRichPresentationModelFactory(options)
    );

    act(() => {
      result.current.setValue("Change 1");
      result.current.setValue("Change 2");
    });

    expect(result.current.uiModel.value).toBe("Change 2");
  });
});
