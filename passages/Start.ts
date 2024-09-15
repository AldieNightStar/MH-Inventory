// This is your first passage
Passage.of("Start", s => {
	const Inventory = haxidenti.inventory.Inventory;
	const registerItem = haxidenti.inventory.registerItem;

	const BREAD = registerItem(1, "🥖Bread", 4);
	const BRANCH = registerItem(2, "🌿Branch", 4);
	const ROCK = registerItem(3, "🪨Rock", 16);

	const inv1 = new Inventory(32);
	console.log("Add BREAD", inv1.addItem(BREAD, 7));
	console.log("Add BRANCH", inv1.addItem(BRANCH, 32));
	console.log("Add ROCK", inv1.addItem(ROCK, 32));
	
	const inv2 = new Inventory(32);

	s.title("Inv1")
	s.print(inv1.ui(inv2));
	s.title("Inv2")
	s.print(inv2.ui(inv1));

	s.button("Clear all inventory", () => {
		inv1.allSlots().forEach(s => s.setNothing());
	})

});