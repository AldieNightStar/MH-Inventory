namespace haxidenti.inventory {
	export class Ingredients {

		constructor(private inv: Inventory) {}

		private _ingredients: {[k: number]: number} = {}

		of(item: number, count: number = 1): this {
			this._ingredients[item] = count;
			return this;
		}

		isPresent(): boolean {
			for (let [id, requiredAmount] of Object.entries(this._ingredients)) {
				const item = this.inv.item(id as any);
				if (item.getAmount() < requiredAmount) return false;
			}
			return true;
		}

		remove(): boolean {
			if (!this.isPresent()) return false;
			for (let [id, requiredAmount] of Object.entries(this._ingredients)) {
				this.inv.item(id as any).remove(requiredAmount);
			}
			return true;
		}
	}
}