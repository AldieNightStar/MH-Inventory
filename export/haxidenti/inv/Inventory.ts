namespace haxidenti.inventory {

	@Engine.dto("haxidenti.Inventory")
	export class Inventory {
		constructor() { }

		private _items: { [id: number]: number } = {}

		item(item: number): Item {
			return new Item(this._items, item);
		}

		all(): Item[] {
			const items: Item[] = [];
			for (let [item, count] of numberEntries(this._items)) {
				if (count < 1) continue;
				items.push(new Item(this._items, item));
			}
			return items;
		}

		allByTag(tag: string): Item[] {
			return this.all().filter(i => i.hasTag(tag));
		}

		size(): number {
			let count = 0;
			for (let item of this.all()) {
				count += item.getAmount()
			}
			return count;
		}

		ingredients(): Ingredients {
			return new Ingredients(this);
		}

		ui(): ui.InventoryUI {
			return new ui.InventoryUI(this);
		}
	}

	function numberEntries(o: any): [number, number][] {
		return Object.entries(o) as any as [number, number][]
	}
}