namespace haxidenti.inventory.ui {
	export class InventoryUI implements el.Element {
		constructor(public inv: Inventory) {}
		private selectedSlot = -1;

		render(s: el.Span): Void {
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
			const button = s.button(name, () => {
				// TODO
			})
			if (this.selectedSlot === slot.slotId) {
				button.style.backgroundColor = "grey";
			}
		}

		private _renderEmptySlot(s: el.Span, slot: SlotInfo) {
			s.button("...", () => {})
		}

	}
}