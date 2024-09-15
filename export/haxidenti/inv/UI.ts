namespace haxidenti.inventory.ui {
	export class InventoryUI implements el.Element {
		constructor(
			public inv: Inventory,
			public inv2?: Inventory
		) { }
		private selectedSlot = -1;

		render(s: el.Span): Void {
			s.reloadTime = 0;

			s.hr();
			this._renderSlots(s);

			s.br();
			this._renderOptionsBar(s);
			s.hr();
		}

		private _renderSlots(s: el.Span) {
			for (let slot of this.inv.allSlots()) {
				this._renderSlot(s, slot);
			}
		}

		private _renderSlot(s: el.Span, slot: SlotInfo) {
			// If slot is empty
			if (slot.isNothing()) return this._renderEmptySlot(s, slot);

			// Get name
			let name = slot.getName() || "???";

			// Get count and modify name if needed
			const count = slot.getCount();
			if (count > 1) name += (" [x" + count + "]");

			// Render button
			const isSelected = this.selectedSlot === slot.slotId;
			this._slotButton(s, name, () => {
				this.selectedSlot = slot.slotId;
			}, isSelected);
		}

		private _renderEmptySlot(s: el.Span, slot: SlotInfo) {
			const isSelected = this.selectedSlot === slot.slotId;
			this._slotButton(s, "...", () => {
				// Try to move item from previous slot
				if (this.selectedSlot >= 0) {
					const oldSlot = this.inv.slot(this.selectedSlot);
					oldSlot?.transferTo(slot)
				}
				// Reset slot
				this.selectedSlot = -1;
			}, isSelected)
		}

		private _slotButton(s: el.Span, caption: string, cb: TaskFunc, isGrey: boolean = false): HTMLButtonElement {
			const b = s.rebutton(caption, cb);
			b.className = "haxidenti_inv_slot";
			if (isGrey) {
				b.style.backgroundColor = "grey";
			}
			return b as HTMLButtonElement;
		}

		private _renderOptionsBar(s: el.Span) {
			const slot = this._getSelectedSlot();
			if (isNull(slot)) return;
			if (slot.isNothing()) return;

			const slotCount: number = slot.getCount();
			const slotItem: number = slot.getId();

			if (slotCount > 1) {
				s.rebutton("⚔️Split x2", () => {
					const newCount = Math.floor(slotCount / 2);
					const reminder = slotCount % 2
					const ok = this.inv.addItemStack(slotItem, newCount);
					console.log(newCount + reminder);
					if (ok) slot.setCount(newCount + reminder);
				})
				s.rebutton("1️⃣Take One", () => {
					slot.setCount(slotCount - 1);
					if (!this.inv.addItemStack(slotItem, 1)) {
						// Fallback in case something went wrong
						slot.setCount(slotCount);
					}
				})
			}

			s.rebutton("➕Re-Add", () => {
				slot.setNothing();
				if (!this.inv.addItem(slotItem, slotCount)) {
					// Fallback in case something went wrong
					slot.setId(slotItem);
					slot.setCount(slotCount);
				}
			});

			// If second inventory present then draw transfer button
			if (!isNull(this.inv2)) {
				s.rebutton("⏭️Transfer", () => {
					if (this.inv2!!.addItem(slotItem, slotCount)) {
						slot.setNothing();
					}
				})
			}
		}

		private _getSelectedSlot(): SlotInfo | null {
			return this.inv.slot(this.selectedSlot);
		}
	}
}