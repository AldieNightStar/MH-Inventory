# Inventory System for `Monna Histea 2`

## Description
* Allows to add items manipulations
* `Inventory` can be rendered to visualize

## Register Items
```ts
// Define constants and item unique numbers
const BREAD = 1;
const BRANCH = 2;
const ROCK = 3;

// Register them
// Each would have their name
haxidenti.inventory.ITEMS[BREAD] = "🥖Bread";
haxidenti.inventory.ITEMS[BRANCH] = "🌿Tree Branch";
haxidenti.inventory.ITEMS[ROCK] = "🪨Rock";

// You can set name of unknown item (If there would be any)
haxidenti.inventory.UNKNOWN_ITEM = "➕Unknown Item➕";
```

## Usage
```ts
// Create inventory with items and slot count of 32
const inv = new haxidenti.Inventory("My Inventory", [BREAD, BRANCH, ROCK, ROCK], 32)

// Add new item
inv.add(BREAD)

// Remove item
// Returns true if success
inv.remove(BRANCH)

// Remove exact amount if items
// Returns true if removed, and false if not (or if there was less than expected)
// [!] Good for store stuff (Buy / Sell)
inv.removeFew(BRANCH, 3)

// Get how much items is in there of such type
// Returns number
inv.count(ROCK)


// Transfer specific item type to a second inventory
// Returns true if success
inv.transfer(ROCK, inv2)
```