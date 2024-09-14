namespace haxidenti.inventory {

	/**
	 * Add here crafts that would be used as a crafting recipes
	 */
	export const CRAFTS: Craft[] = []

	function countEach(items: number[]): {[k: number]: number} {
		const m = {};

		for (let item of items) {
			let n = m[item];
			if (isNull(n)) {
				n = 0;
				m[item] = n;
			}
			n += 1;
			m[item] = n;
		}

		return m;
	}

	function keys(o: object): [number, number][] {
		return Object.keys(o) as any as [number, number][];
	}

	export class Craft {
		constructor(private ingredients: number[], private result: number[]) { }

		/**
		 * Check that Inventory has enough ingredients and able to contain result
		 */
		fits(inv: Inventory): boolean {
			const items = countEach(this.ingredients);

			// Check that items is enough
			for (let [id, count] of keys(items)) {
				if (inv.count(id) < count) return false; 
			}

			// Check that there is enough space for result items
			const itemsAfterCraft = inv.len() + this.result.length - this.ingredients.length;
			if (itemsAfterCraft > inv.slots) return false;

			// Good to go
			return true;
		}

		/**
		 * Do a craft for specific inventory
		 */
		craft(inv: Inventory): boolean {
			if (!this.fits(inv)) return false;
			this.result.forEach(i => inv.add(i));
			return true;
		}
	}
}