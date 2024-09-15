// This is your first passage
Passage.of("Start", s => {

	const BREAD = haxidenti.inventory.registerItem(1, "🥖Bread", 4);
	const BRANCH = haxidenti.inventory.registerItem(2, "🌿Branch", 4);
	const ROCK = haxidenti.inventory.registerItem(3, "🪨Rock", 16);

	const inv1 = new haxidenti.inventory.Inventory(32);
	console.log("Add BREAD", inv1.addItem(BREAD, 7));
	// console.log("Add BRANCH", inv1.addItem(BRANCH, 32));
	// console.log("Add ROCK", inv1.addItem(ROCK, 32));
	
	const inv2 = new haxidenti.inventory.Inventory(32);

	s.print(inv1.ui(inv2));
	s.print(inv2.ui(inv1));

});