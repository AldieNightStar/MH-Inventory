namespace haxidenti.inventory.ui {
	export type Option = (item: Item) => void

	export class InventoryUI implements el.Element, el.Reloadable {
		constructor(private inv: Inventory) { }

		private hasTag?: string
		private _options: [string, Option][] = [];

		option(name: string, o: Option): this {
			this._options.push([name, o]);
			return this;
		}

		tag(tag: string): this {
			this.hasTag = tag;
			return this;
		}

		render(s: el.Span): Void {
			s.reloadTime = 0;

			let items: Item[]
			if (!isNull(this.hasTag)) {
				items = this.inv.allByTag(this.hasTag);
			} else {
				items = this.inv.all();
			}

			items.forEach(item => this.renderItem(s, item));
		}

		private renderItem(s: el.Span, item: Item) {
			s.print(item.info().itemName + " [" + item.getAmount() + "]");
			// Render options
			for (let [name, option] of this._options) {
				s.rebutton(name, () => {
					option(item);
				})
			}
			s.br();
		}

		reload() { }
	}
}