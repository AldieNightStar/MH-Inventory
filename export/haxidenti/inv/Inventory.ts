namespace haxidenti.inventory {

	@Engine.dto("haxidenti.Inventory")
	export class Inventory {
		constructor(public maximum: number = 32) {
			this.slots = [];
			for (let i = 0; i < this.maximum; i++) {
				this.slots.push([0, 0]);
			}
		}

		private slots: [number, number][] = [];

		private isSlotAvailable(n: number): boolean {
			return n > 0 || n < this.maximum;
		}

		/**
		 * Get all slots as list of object. (Heavy operation)
		 */
		allSlots(): SlotInfo[] {
			const slots: SlotInfo[] = [];
			for (let i = 0; i < this.maximum; i++) {
				const slot = this.slot(i);
				if (isNull(slot)) continue;
				slots.push(slot);
			}
			return slots;
		}

		/**
		 * Get specific slot from that inventory
		 */
		slot(slotId: number): SlotInfo | null {
			if (!this.isSlotAvailable(slotId)) return null;
			return new SlotInfo(
				slotId,
				() => this.slots[slotId],
				(itemId, cnt) => { this.slots[slotId] = [itemId, cnt] }
			);
		}

		/**
		 * Get free slots that could be used for new items.
		 * If `forItemId` is specified, then it will also include slots with that item id (That have some free space)
		 */
		getFreeSlots(forItemId: number = 0): SlotInfo[] {
			const freeSlots: SlotInfo[] = [];

			for (let i = 0; i < this.maximum; i++) {
				const slot = this.slot(i);

				// Skip null slots
				if (isNull(slot)) continue;

				if (forItemId > 0) {
					if (slot.getId() === forItemId && slot.getFree() > 0) {
						freeSlots.push(slot);
						continue;
					}
				}

				if (slot.isNothing()) {
					freeSlots.push(slot);
					continue;
				}
			}

			return freeSlots;
		}

		/**
		 * Get all slots that is used for that item id
		 */
		getItemSlots(itemId: number): SlotInfo[] {
			const slots: SlotInfo[] = [];
			for (let i = 0; i < this.maximum; i++) {
				const slot = this.slot(i);
				if (isNull(slot) || slot?.isNothing()) continue;
				if (slot.getId() === itemId) slots.push(slot);
			}
			return slots;
		}

		/**
		 * Get how many items of that id could be added to this inventory
		 */
		getFreeCountForItem(itemId: number): number {
			const slots = this.getFreeSlots(itemId);
			let count = 0;
			slots.forEach(s => count += s.getFree());
			return count;
		}

		/**
		 * Add new item or stack new item to existing ones
		 */
		addItem(itemId: number, count: number): boolean {
			if (this.getFreeCountForItem(itemId) < count) return false;
			const itemMaxStack = getRegistryItem(itemId)?.maxStack || DEFAULT_ITEM_STACK;
			for (let slot of this.getFreeSlots(itemId)) {
				// Stop if no more items
				if (count < 1) break;

				// Get free count for current slot
				let free = slot.getFree();
				if (free > itemMaxStack) free = itemMaxStack;

				if (free < count) {
					// If enough space to put ALL count,
					// Then put it and end up
					count -= free;
					slot.addCount(free);
					slot.setId(itemId);
				} else {
					// If not enough space to put ALL count,
					// Then put what is free, and move next
					slot.addCount(count);
					slot.setId(itemId);
					count -= free;
					break;
				}
			}
			return true;
		}

		/**
		 * Add new item, but as a new stack, without stacking to existing ones
		 */
		addItemStack(itemId: number, count: number): boolean {
			const freeSlot = this.getFreeSlots()[0];
			if (isNull(freeSlot)) return false;
			freeSlot.setId(itemId);
			freeSlot.setCount(count);
			return true;
		}

		/**
		 * Count how many items does this inventory has for item id
		 */
		countItem(itemId: number): number {
			let count = 0;
			for (let i = 0; i < this.maximum; i++) {
				const slot = this.slot(i);
				if (isNull(slot) || slot?.isNothing()) continue;
				if (slot.getId() === itemId) {
					count += slot.getCount();
				}
			}
			return count;
		}

		/**
		 * Remove items or return false if can't. Will not touch if not enough count. Good for stores
		 */
		takeItem(itemId: number, count: number): boolean {
			if (this.countItem(itemId) < count) return false;
			for (let slot of this.getItemSlots(itemId)) {
				if (count < 1) break;
				let slotCount = slot.getCount();
				if (slotCount < count) {
					// If this count of items in this slot not enough,
					// Then just remove slot item and substract count
					count -= slotCount;
					slot.setNothing();
				} else {
					// If this count of items is enough,
					// Then decrease count and we done
					slotCount -= count;
					slot.setCount(slotCount);
					break
				}
			}
			return true;
		}

		/**
		 * Send items from one inventory to another
		 */
		transfer(itemId: number, count: number, inventory2: Inventory): boolean {
			// Check if second inventory has enough space
			if (inventory2.getFreeCountForItem(itemId) <= count) return false;

			// Take items from this inventory
			const taken = this.takeItem(itemId, count);
			if (!taken) return false;

			// Move them to another inventory
			return inventory2.addItem(itemId, count);
		}

		/**
		 * Creates UI version of this Inventory, that can be printed
		 */
		ui(transferInventory?: Inventory) {
			return new ui.InventoryUI(this, transferInventory);
		}

	}
}