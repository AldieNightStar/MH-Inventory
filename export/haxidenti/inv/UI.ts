namespace haxidenti.inventory.ui {

	export class InventoryUI implements el.Element, el.Reloadable {
		constructor(
			public inv: Inventory,
			public inv2?: Inventory
		) {
			this.invHash = inv.hash();
		}

		private selectedSlot = -1;
		private locked = false;
		private invHash = 0;

		lock(): this {
			this.locked = true;
			return this
		}

		render(s: el.Span): Void {
			s.reloadTime = 0;

			// When hash is changed, then reload this element
			s.interval(1000, () => {
				const newHash = this.inv.hash();
				if (this.invHash !== newHash) {
					this.invHash = newHash;
					s.reload();
				}
			})

			s.hr();
			this._renderSlots(s);

			if (!this.locked) {
				s.br();
				this._renderOptionsBar(s);
			}

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
				if (this.selectedSlot === slot.slotId) {
					this.selectedSlot = -1;
				} else {
					this.selectedSlot = slot.slotId;
				}
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
			const b = s.rebutton(caption, () => {
				if (!this.locked) {
					cb();
				}
			});
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

			// Protect values from dupes due to change slot value in another place
			function isValidOperation() {
				if (isNull(slot)) return;
				if (slot.getCount() != slotCount) return false;
				if (slot.getId() != slotItem) return false;
				return true;
			}

			if (slotCount > 1) {
				s.rebutton("⚔️Split x2", () => {
					if (!isValidOperation()) return;
					const newCount = Math.floor(slotCount / 2);
					const reminder = slotCount % 2
					const ok = this.inv.addItemStack(slotItem, newCount);
					console.log(newCount + reminder);
					if (ok) slot.setCount(newCount + reminder);
				})
				s.rebutton("1️⃣Take One", () => {
					if (!isValidOperation()) return;
					slot.setCount(slotCount - 1);
					if (!this.inv.addItemStack(slotItem, 1)) {
						// Fallback in case something went wrong
						slot.setCount(slotCount);
					}
				})
			}

			s.rebutton("➕Stack", () => {
				if (!isValidOperation()) return;
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
					if (!isValidOperation()) return;
					if (this.inv2!!.addItem(slotItem, slotCount)) {
						slot.setNothing();
					}
				})
			}
		}

		private _getSelectedSlot(): SlotInfo | null {
			return this.inv.slot(this.selectedSlot);
		}

		reload() {}
	}
}