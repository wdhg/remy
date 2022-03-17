# Remy
Remy is a formal language for recipes for easier processing with software.

With Remy, recipes can be programatically analyised, combined, and altererd.


# Example

All example recipes are from https://based.cooking/, and are in the public domain.

```
# Equipment

Knife.
ChoppingBoard.
Bowl.

# Ingredients

2 lb Corn, frozen, defrosted.
1/2 RedOnion, finelyChopped.
4 Radishes, thinSliced, chopped.
few pinches Cilantro, finelyChopped.
1-2 Jalepenos, finelyChopped.
2-3 Limes, juiced as LimeJuice.
Salt.
Pepper.

# Steps

Chop everything until cornKernelSized.
Mix it in Bowl.
Cover Bowl.
Refridgerate it for 1 hour - 1 day.
```

# Documentation

## Recipe Overview

A recipe is split into three sections:

1. The equipment list.
2. The ingredient list.
3. The recipe steps.

### Equipments and Ingredients

Equipment and ingredients are written the exact same way. An example ingredient entry is:

```
1/4 cup LemonJuice, roughlyChopped as Juice.
```

These have the following pieces of information (in order):

- Quantity (e.g. `1/3 cup`).
- Noun (in PascalCase, e.g. `LemonJuice`).
- Adjectives (a comma seperated list, starting with a comma, of camelCase adjectives) (optional).
- Renaming clause (optional).
- A full stop terminator.

### Steps

An example step is:

```
Chop everything until cornKernelSized.
```

Steps can be chained together by using `and`. This is useful for creating :

```
Place Chickpeas in Pot
  and Add BakingSoda to Chickpeas
  and Cover it with few inches Water
  and Boil Pot for 20 minutes.
```

These have the following structure:

- Adverbs (a comma sperarated list of camelCase adverbs) (optional).
- Verb (in PascalCase).
- List of quantified names (comma seperated, quantities optional, at least one name required).
- A 'with' clause (to describe what the action should be done with) (optional).
- A 'location' clause (to describe where the action should be done) (optional).
- An 'at' clause (to describe at what level the action should be done, e.g. `at medium-low`) (optional).
- A 'for' clause (to describe how long the action should be done for) (optional).
- An 'until' clause (to describe which conditions should be met before stopping the action, e.g. `until soft`) (optional).

## Specifics

### Nouns, Verbs, Adverbs and Adjectives

Remy is built around nouns, verbs, adverbs and adjectives. Nouns and verbs can be any PascalCase string, and adverbs and adjectives can be any camelCase string.

### Quantities

Quantities are optional, and they are composed to two parts: a value and a unit. The value can be:

- An integer (e.g. `4`).
- A decimal (e.g. `2.5`).
- A fraction (e.g. `1/2`).

The units are optional within the quantity, and they can be any camelCase string (e.g. `tsp`, `lb`, `cups`).

### Quantified Nouns

Nouns can be quantified, meaning there can be a quantity before any noun (e.g. `4 Bananas`, `500 g Flour`).
