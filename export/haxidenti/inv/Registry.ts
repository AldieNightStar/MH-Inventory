namespace haxidenti.inventory {
	export class ItemInfo {
		constructor(
			public itemName: string,
			public tags: string[],
		) {}
	}

	const registry: {[k: number]: ItemInfo} = {}

	export function defineItem(id: number, name: string, tags: string[] = []): number {
		if (!isNull(registry[id])) throw new Error("Inventory Item id: " + id + " is already registered");
		registry[id] = new ItemInfo(name, tags);
		return id;
	}

	export function itemInfo(id: number): ItemInfo {
		const item = registry[id];
		if (isNull(item)) throw new Error("Can't find Inventory item info with such id: " + id);
		return item;
	}
}