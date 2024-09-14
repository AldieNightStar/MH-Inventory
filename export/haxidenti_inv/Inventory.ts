namespace haxidenti.inventory {

	/**
	 * Register item numbers to names here. So it will be displayed correctly
	 */
	export const ITEMS: { [k: number]: string } = {}

	/**
	 * Set custom item name when it's unknown to the Inventory system
	 */
	export let UNKNOWN_ITEM = "💀Unknown Item";


	@Engine.dto("haxidenti.Inventory")
	export class Inventory implements el.Element, el.Reloadable {
		constructor(
			public name: string,
			public items: number[],
			public craftable: boolean = true,
			public slots: number = 12,
		) { }

		/**
		 * Get count of all items inside
		 */
		len(): number {
			return this.items.length;
		}

		/**
		 * Add new item. Returns true if was added ok
		 */
		add(item: number): boolean {
			if (this.items.length >= this.slots) return false;
			this.items.push(item);
			return true;
		}

		/**
		 * Get amount of exact item type
		 */
		count(item: number): number {
			let count = 0;
			this.items.forEach(invItem => {
				if (item === invItem) {
					count += 1;
				}
			});
			return count;
		}

		/**
		 * Will remove items only if there minimum amount.
		 * Otherwise will return false and will not remove anything
		 */
		removeFew(item: number, count: number) {
			if (this.count(item) >= count) {
				for (let i = 0; i < count; i++) {
					this.remove(item);
				}
				return true;
			}
			return false;
		}

		/**
		 * Remove single item and return true if there was it, or false if not
		 */
		remove(item: number): boolean {
			let id = -1;
			for (let i = 0; i < this.items.length; i++) {
				const invItem = this.items[i];
				if (invItem === item) {
					id = i;
					break
				}
			}
			if (id !== -1) {
				this.items.splice(id, 1);
			}

			return id !== -1;
		}

		/**
		 * Send item to another inventory
		 */
		transfer(item: number, toInv: Inventory) {
			if (this === toInv) return false;

			const hasItem = this.count(item) > 0
			if (!hasItem) return false;

			const addedOk = toInv.add(item);
			if (!addedOk) return false;

			this.remove(item);
			return true;
		}

		/**
		 * Do a craft inside this Inventory
		 */
		craft(craft: Craft) {
			craft.craft(this);
		}



		/**
		 * Rendering function
		 */
		render(s: el.Span): Void {
			s.reloadTime = 0;

			s.hr();
			s.printCenter("💼" + this.name);
			s.hr();

			// Render items
			this._renderItems(s);

			// Render additional slot
			this._renderAdditionalSlot(s);

			s.hr();
			this._renderCrafts(s);
		}

		private _renderCrafts(s: el.Span) {
			const crafts = CRAFTS.filter(c => c.fits(this));
			if (crafts.length > 0) {
				s.printCenter("⚒️Crafting⚒️");
				s.hr();
				for (let craft of crafts) {
					s.print(craft);
				}
				s.hr();
			}
		}

		private _renderItems(s: el.Span) {
			for (let i = 0; i < this.items.length; i++) {
				const item = this.items[i];

				// Calculate name
				let itemName = ITEMS[item];
				if (isNull(itemName)) itemName = UNKNOWN_ITEM;
				
				// Print button
				s.button(itemName, () => {
					Transfer.setTransfer(this, i, item);
				});
			}
		}

		private _renderAdditionalSlot(s: el.Span) {
			if (this.len() >= this.slots) return;
			s.button("➕...", () => {
				if (Transfer.doTransfer(this)) {
					this.reload();
				}
			})
		}

		/**
		 * Just for reloading
		 */
		reload() {}

	}

}