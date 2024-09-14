# Inventory System for `Monna Histea 2`

## Description
* Allows to add items manipulations
* `Inventory` can be rendered to visualize

## Code
```ts
// Create inventory with items and slot count of 32
const inv = new haxidenti.Inventory("My Inventory", [ITEM1, ITEM2], 32)

// Add new item
inv.add(ITEM3)

// Remove item
// Returns true if success
inv.remove(ITEM3)

// Remove exact amount if items
// Returns true if removed, and false if not (or if there was less than expected)
// [!] Good for store stuff (Buy / Sell)
inv.removeFew(ITEM1, 3)

// Get how much items is in there of such type
// Returns number
inv.count(ITEM1)


// Transfer specific item type to a second inventory
// Returns true if success
inv.transfer(ITEM2, inv2)
```