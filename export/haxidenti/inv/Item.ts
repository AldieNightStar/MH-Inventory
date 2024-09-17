namespace haxidenti.inventory {
	
	export class Item {

		constructor(
			private _items: { [id: number]: number },
			private _itemId: number,
		) { }

		getAmount(): number {
			const amount = this._items[this._itemId];
			if (isNull(amount)) return 0;
			if (amount < 1) return 0;
			return amount;
		}

		setAmount(amount: number) {
			if (amount < 1) {
				delete this._items[this._itemId];
			} else {
				this._items[this._itemId] = amount;
			}
		}

		remove(amount: number): boolean {
			const itemAmount = this.getAmount();
			const newAmount = itemAmount - amount;
			if (newAmount < 0) return false;
			this.setAmount(newAmount)
			return true;
		}

		info(): ItemInfo {
			return itemInfo(this._itemId);
		}

		add(amount: number) {
			if (amount < 1) return;
			this._items[this._itemId] = this.getAmount() + amount;
		}

		send(amount: number, inv: Inventory): boolean {
			if (!this.remove(amount)) return false;
			inv.item(this._itemId).add(amount);
			return true;
		}

		hasTag(name: string): boolean {
			return this.info().tags.indexOf(name) !== -1
		}
	}
}