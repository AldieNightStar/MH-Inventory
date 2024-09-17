namespace haxidenti.inventory {
	export function fromVar(name: string): Inventory {
		return Game.v(name, () => new Inventory()).get();
	}
}