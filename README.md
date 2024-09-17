# Inventory System for `Monna Histea 2`

## Define Items
* You can create items by `id` and assign their `name` and `tags` (Optional)
```ts
// Import shorthand
const defineItem = haxidenti.inventory.defineItem;

export const R_FLOWER = defineItem(1, "🌹Red flower", ["flower"]);
export const Y_FLOWER = defineItem(2, "🌻Yellow flower", ["flower"]);
export const FOOD     = define(3, "🍞Flower Food", ["food"]);
export const STICK    = define(4, "🌿Stick", []);
export const COIN     = define(5, "🪙Coin", ["money"]);
```


## Create Inventory
```ts
// Create from scratch. Can be set into variables
const inv = new haxidenti.inventory.Inventory()

// ... or take from Variables (Changes is synchronized)
const inv = new haxidenti.inventory.fromVar("Inventory");
```


## Add some items
```ts
// Add 5 red flowers and 3 yellow ones
inv.item(R_FLOWER).add(5);
inv.item(Y_FLOWER).add(3);
```

## Remove items
```ts
// Buy food for 3 coins
// Will remove 3 coins ONLY if there enough of them
// Otherwise returns `false`
if (inv.item(COIN).remove(3)) {
	inv.item(FOOD).add(1);
}

// If you want to remove anyway
inv.item(COIN).setAmount(0);
inv.item(COIN).setAmount(inv.item(COIN).getAmount() - 3);
```



## Send to another `Inventory`
```ts
// Let us put some coins into the tip box
// tipBox is another `Inventory` object
//
// Returns false, if there is not enough items
inv.item(COIN).send(3, tipBox);
```


## Get information about item
* Do not edit `info` object
```ts
// COIN is number: 5
const info = haxidenti.inventory.itemInfo(COIN)

info.itemName // Name of the item
info.tags     // Tags: string[]

// You can also check items for tags
// returns true, if that tag is present
inv.item(COIN).hasTag("money")
```



## Render to the Screen
```ts
// Just render list of items
// Printable
inv.ui()
```
* You can also add some options to do with your items
```ts
// Printable
inv.ui()
	.option("⚙️Use", i => i.remove(1));
	.option("😋Eat", i => i.remove(1));
	.option("🗑️Drop", i => i.setAmount(0))
```
* You can filter what to show by adding `tag`
```ts
// Printable
inv.ui()
	.tag("food") // Only 'food' items will be visible
	.option("⚙️Use", i => i.remove(1));
	.option("😋Eat", i => i.remove(1));
	.option("🗑️Drop", i => i.setAmount(0))
```

## Crafting and Ingredients
* Some times you need to create crafting
* And when you want to craft some item, there is __ingredients__ needed
```ts
// Craft food using two yellow flowers and one red flower
// .remove() - removes that items from the inventory and returns true/false if there enough ingredients
const taken = inv.ingredients()
	.of(Y_FLOWER, 2)
	.of(R_FLOWER, 1)
	.remove()

// Ok. Now items gets removed, then we simply add resulted food
if (taken) {
	inv.item(FOOD).add(1);
} else {
	window.alert("Not enough ingredients :(");
}
```
* You can also check if there required ingredients present __without removing them__
```ts
// Returns true if all the ingredients is in place
inv.ingredients()
	.of(Y_FLOWER, 2)
	.of(R_FLOWER, 1)
	.isPresent();
```