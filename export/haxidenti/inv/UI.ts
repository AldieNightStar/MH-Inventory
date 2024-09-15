namespace haxidenti.inventory.ui {
	export class InventoryUI implements el.Element {
		constructor(public inv: Inventory) { }
		private selectedSlot = -1;

		render(s: el.Span): Void {
			s.reloadTime = 0;

			s.hr();
			this._renderSlots(s);
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
			const isSelected = this.selectedSlot === slot.getId();
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

	}
}