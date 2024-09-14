// This is your first passage
Passage.of("Start", s => {
	const BREAD = 1;
	const WATER = 2;
	const STICK = 3;

	haxidenti.inventory.ITEMS[BREAD] = "🥖Bread"
	haxidenti.inventory.ITEMS[WATER] = "💧Bottle of Water"
	haxidenti.inventory.ITEMS[STICK] = "🌿Wooden Stick"

	const inv = new haxidenti.inventory.Inventory("Testing Inventory",
		[
			BREAD, BREAD, WATER,
			WATER, WATER,
			STICK, STICK, STICK, STICK
		], true, 10);


	const inv2 = new haxidenti.inventory.Inventory("Another Inventory", [], true, 32);
	
	s.println(inv);
	s.println(inv2);
});