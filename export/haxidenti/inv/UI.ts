namespace haxidenti.inventory.ui {
	export class InventoryUI implements el.Element {
		constructor(public inv: Inventory) {}
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
			const button = s.rebutton(name, () => {
				this.selectedSlot = slot.slotId;
			});

			if (this.selectedSlot === slot.slotId) {
				button.style.backgroundColor = "grey";
			}
		}

		private _renderEmptySlot(s: el.Span, slot: SlotInfo) {
			const button = s.rebutton("...", () => {
				// Try to move item from previous slot
				if (this.selectedSlot >= 0) {
					const oldSlot = this.inv.slot(this.selectedSlot);
					console.log(oldSlot)
					console.log(oldSlot?.transferTo(slot));
				}
				// Reset slot
				this.selectedSlot = -1;
			})

			if (this.selectedSlot === slot.slotId) {
				button.style.backgroundColor = "grey";
			}
		}

	}
}