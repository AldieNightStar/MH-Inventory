Passage.of("Start", s => {
	s.println("Home")
	s.hr();

	s.passln("Go to flower valley", "FV");
	s.passln("Go to flower crafter", "FC");
	s.passln("Go to kitchen", "Kitchen");

});

Passage.of("FV", s => {
	const itemInfo = haxidenti.inventory.itemInfo;
	const inv = items.inventory();

	s.println("You are on Flower valley");
	s.passln("Back", "Start");
	s.hr();

	const invUi = inv.ui()
		.option("🗑️1", i => i.remove(1))
		.option("🗑️5", i => i.setAmount(i.getAmount() - 5))
		.option("🗑️ALL", i => i.setAmount(0))

	const message = s.println("");

	s.button("Find something", () => {
		const item = Util.randChoose([
			items.R_FLOWER,
			items.P_FLOWER,
			items.W_FLOWER,
			items.Y_FLOWER,
			items.STICK
		])
		message.innerText = "Nice, you found: " + itemInfo(item).itemName;
		inv.item(item).add(Util.rand(1, 10));
		invUi.reload();
	})

	s.hr();

	s.print(invUi);

})

Passage.of("FC", s => {
	const inv = items.inventory();

	s.println("Flower crafter Room");
	s.passln("Back", "Start");
	s.hr();

	const invUi = inv.ui();
	s.print(invUi);

	s.hr();

	const message = s.println("")
	function messageOk(item: number) {
		message.innerText = "🟢Crafted " + haxidenti.inventory.itemInfo(item).itemName;
		invUi.reload();
	}
	function messageBad() {
		message.innerText = "🔴Bad! Can't find all the ingredients!";
	}

	s.buttonln("💮Craft dust (🌹1, 🌻1, 🌼2)", () => {
		const ok = inv.ingredients()
			.of(items.R_FLOWER, 1)
			.of(items.Y_FLOWER, 1)
			.of(items.W_FLOWER, 2)
			.remove()
		if (ok) {
			messageOk(items.FLOWER_DUST)
			inv.item(items.FLOWER_DUST).add(1);
		} else {
			messageBad();
		}
	})

	s.buttonln("Make food (💮5, 🌿1)", () => {
		const ok = inv.ingredients()
			.of(items.FLOWER_DUST, 5)
			.of(items.STICK, 1)
			.remove();
		if (ok) {
			messageOk(items.FLOWER_FOOD);
			inv.item(items.FLOWER_FOOD).add(1);
		} else {
			messageBad();
		}
	})

})

Passage.of("Kitchen", s => {
	const inv = items.inventory();

	s.println("Kitchen")
	s.passln("Back", "Start");
	s.hr();

	s.print(
		inv.ui()
			.tag("food").option("Eat", i => i.remove(1))
	);

})