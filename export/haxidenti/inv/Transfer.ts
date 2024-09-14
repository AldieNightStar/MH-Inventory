namespace haxidenti.inventory {

	/**
	 * Internal. Used to transfer items between inventories
	 */
	export class Transfer {
		static current: {inv: Inventory | null, item: number, slot: number} = {
			inv: null,
			slot: 0,
			item: 0
		}

		static setTransfer(i: Inventory, slot: number, item: number) {
			this.current.inv = i;
			this.current.item = item;
			this.current.slot = slot;
		}

		static isTransfer(): boolean {
			return !isNull(this.current.inv);
		}

		static isTransferInv(inv: Inventory): boolean {
			return this.current.inv === inv;
		}

		static cancelTransfer() {
			this.current.inv = null;
		}

		static doTransfer(newInv: Inventory): boolean {
			if (this.isTransfer()) {
				const oldInv = this.current.inv!!;
				const oldSlot = this.current.slot;
				const itemId = this.current.item;

				// Do not allow inventory to transfer to itself
				if (oldInv === newInv) return false;

				// Confirm that there still item with correct id
				if (oldInv.items[oldSlot] !== itemId) return false;

				// Check that new inventory will have enough space
				if (newInv.len() + 1 > newInv.slots) return false;

				// Remove old Item
				oldInv.items.splice(oldSlot, 1);

				// Add to the new inventory
				newInv.add(itemId);

				// Update inventories
				oldInv.reload();
				newInv.reload()

				// Reset transfer
				this.cancelTransfer();

				return true;
			}
			return false;
		}
	}
}