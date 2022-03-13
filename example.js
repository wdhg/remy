const ohm = require("ohm-js");
const fs = require("fs");

const grammarContents = fs.readFileSync("grammar.ohm");
const grammar = ohm.grammar(grammarContents);
const semantics = grammar.createSemantics();

semantics.addOperation("visit", {
  // visit
  Recipe: (_equipment, equipment, _ingredients, ingredients, _steps, steps) => {
    return {
      equipment: equipment.children.map((e) => e.visit()),
      ingredients: ingredients.children.map((i) => i.visit()),
      steps: steps.children.map((s) => s.visit()),
    };
  },
  Requirement: (name, _comma, adjectives, _as, newName, _dot) => {
    return {
      ...name.visit(),
      adjectives: adjectives.children.map((a) => a.visit()),
      newName: newName.children.map((n) => n.visit())[0],
    };
  },
  // step
  Step: (head, _and, tail, _dot) =>
    [head.visit()].concat(tail.children.map((a) => a.visit())),
  SubStep: (
    maybeAdverbs,
    action,
    names,
    maybeWith,
    maybeLocator,
    maybeAt,
    maybeFor,
    maybeUntil
  ) => {
    return {
      adverbs: maybeAdverbs.children.map((a) => a.visit()),
      action: action.visit(),
      names: names.visit(),
      with: maybeWith.children.map((x) => x.visit())[0],
      locator: maybeLocator.children.map((x) => x.visit())[0],
      at: maybeAt.children.map((x) => x.visit())[0],
      for: maybeFor.children.map((x) => x.visit())[0],
      until: maybeUntil.children.map((x) => x.visit())[0],
    };
  },
  StepWith: (_with, names) => names.visit(),
  StepLocator: (locator, name) => {
    return {
      locator: locator.visit(),
      name: name.visit(),
    };
  },
  StepAt: (_at, level) => level.visit(),
  StepFor: (_for, duration) => duration.visit(),
  StepUntil: (_until, predicate) => predicate.visit(),
  StepPredicate_temperature: (_temperature, _spaces, _is, temperature) => {
    return {
      type: "temperature",
      temperature: temperature.visit(),
    };
  },
  StepPredicate_nounAdjectives: (name, _is, adjectives) => {
    return {
      type: "nounAdjectives",
      name: name.visit(),
      adjectives: adjectives.visit(),
    };
  },
  StepPredicate_adjectives: (adjectives) => {
    return {
      type: "adjectives",
      adjectives: adjectives.visit(),
    };
  },
  StepNouns_it: (_it) => {
    return {
      type: "it",
    };
  },
  StepNouns_everything: (_everything) => {
    return {
      type: "everything",
    };
  },
  StepNouns_nouns: (names) => {
    return {
      type: "nouns",
      names: names.visit(),
    };
  },
  // quantified
  QuantifiedNouns: (head, _comma, tail) =>
    [head.visit()].concat(tail.children.map((a) => a.visit())),
  QuantifiedNoun_range: (quantity1, _dash, quantity2, name) => {
    return {
      type: "range",
      lower: quantity1.visit(),
      upper: quantity2.visit(),
      name: name.visit(),
    };
  },
  QuantifiedNoun_quantified: (quantity, name) => {
    return {
      type: "quantified",
      quantity: quantity.visit(),
      name: name.visit(),
    };
  },
  QuantifiedNoun_unquantified: (name) => {
    return {
      type: "unquantified",
      name: name.visit(),
    };
  },
  // quantities
  Quantity_all: (_all) => {
    return {
      type: "all",
    };
  },
  Quantity_fewUnit: (_few, unit) => {
    return {
      type: "fewUnit",
      unit: unit.visit(),
    };
  },
  Quantity_few: (_few) => {
    return {
      type: "few",
    };
  },
  Quantity_numberUnit: (value, unit) => {
    return {
      type: "numberUnit",
      value: value.visit(),
      unit: unit.visit(),
    };
  },
  Quantity_number: (value) => {
    return {
      type: "number",
      value: value.visit(),
    };
  },
  // durations
  Duration_range: (duration) => {
    return {
      type: "range",
      duration: duration.visit(),
    };
  },
  Duration_single: (duration) => {
    return {
      type: "single",
      duration: duration.visit(),
    };
  },
  DurationRange: (lower, _dash, upper) => {
    return {
      lower: lower.visit(),
      upper: upper.visit(),
    };
  },
  DurationSingle: (value, unit) => {
    return {
      value: value.visit(),
      unit: unit.visit(),
    };
  },
  // temperature
  Temperature: (degrees, unit) => {
    return {
      degrees: degrees.visit(),
      unit: unit.visit(),
    };
  },
  TempUnit: (u) => u.sourceString,
  // numbers
  Number_fraction: (lhs, _slash, rhs) => lhs.visit() / rhs.visit(),
  Number_decimal: (lhs, _dot, rhs) => Number(`${lhs.visit()}.${rhs.visit()}`),
  Number_integer: (x) => x.visit(),
  Integer: (digits) => Number(digits.children.map((d) => d.visit()).join("")),
  digit: (d) => d.sourceString,
  // words
  Locator: (locator) => locator.sourceString,
  Level: (level) => level.sourceString,
  Adjectives: (head, _commas, tail) =>
    [head.visit()].concat(tail.children.map((a) => a.visit())),
  Adverbs: (head, _commas, tail) =>
    [head.visit()].concat(tail.children.map((a) => a.visit())),
  Noun: (s) => s.visit(),
  Verb: (s) => s.visit(),
  UnitNoun: (s) => s.visit(),
  Adjective: (s) => s.visit(),
  pascalCase: (head, tail) => {
    return head.visit() + tail.children.map((l) => l.visit()).join("");
  },
  camelCase: (head, tail) => {
    return head.visit() + tail.children.map((l) => l.visit()).join("");
  },
  upper: (c) => c.sourceString,
  lower: (c) => c.sourceString,
  letter: (c) => c.sourceString,
});

const visitContents = fs.readFileSync("./examples/Hummus.rmy");
const match = grammar.match(visitContents);
const r = semantics(match).visit();
console.log(r);
