namespace haxidenti.inventory {

	export class ItemInfo {
		constructor(
			public name: string,
			public maxStack: number,
			public tags: string[] = []
		) {}
	}

	export let DEFAULT_ITEM_STACK = 32;

	const ITEM_REG: {[k: number]: ItemInfo} = {}

	export function getRegistryItem(id: number): ItemInfo | undefined {
		return ITEM_REG[id]
	}

	export function registerItem(id: number, name: string, maxStack: number = 32, tags: string[] = []): number {
		if (maxStack < 1) maxStack = 1;
		if (id < 1) throw new Error("Id of item should be greater than zero");
		if (!isNull(ITEM_REG[id])) throw new Error("Item with id " + id + " is already exist");
		const info = new ItemInfo(name, maxStack, tags);
		ITEM_REG[id] = info;
		return id;
	}

}