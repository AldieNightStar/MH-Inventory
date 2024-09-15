namespace haxidenti.inventory {

	export class SlotInfo {
		constructor(
			public slotId: number,
			private _get: () => [number, number],
			private _update: (id: number, count: number) => void
		) { }

		getId() {
			const [id] = this._get();
			return id;
		}

		getCount() {
			const [, count] = this._get();
			return count;
		}

		getRegistryInfo(): ItemInfo | null {
			const id = this.getId();
			if (id < 1) return null;

			return getRegistryItem(id) || null;
		}

		getName(): string | null {
			const info = this.getRegistryInfo();
			if (isNull(info)) return null;
			return info.name;
		}

		getTags(): string[] {
			const info = this.getRegistryInfo();
			if (isNull(info)) return [];
			return info.tags;
		}

		getMax(): number {
			// For Nothing
			if (this.getId() === 0) return DEFAULT_ITEM_STACK;

			const info = this.getRegistryInfo();
			if (isNull(info)) return 0;
			return info.maxStack;
		}

		getFree(): number {
			const max = this.getMax();
			const free = max - this.getCount();
			// If less than 0 then return 0 and if more than max then return max
			if (free > 0) return free;
			if (free > max) return max;
			return 0;
		}

		isNothing(): boolean {
			return this.getId() === 0 || this.getCount() < 1;
		}

		setCount(count: number) {
			const max = this.getMax();
			let id = this.getId();
			if (count < 0) {
				count = 0;
				id = 0;
			}
			if (count > max) count = max;
			this._update(id, count);
		}

		setId(n: number) {
			if (n < 0) n = 0;
			this._update(n, this.getCount())
		}

		addCount(n: number): boolean {
			const newCount = this.getCount() + n;
			if (newCount > this.getMax()) return false;
			this.setCount(newCount);
			return true;
		}

		setNothing() {
			this._update(0, 0);
		}

		transferTo(slot2: SlotInfo): boolean {
			// Do not allow to send items to itself
			if (this === slot2) return false;

			// Current Slot has have something
			if (this.isNothing() || this.getCount() < 1) return false;

			// Slot 2 myst have exact type or be empty
			if (!slot2.isNothing() || slot2.getId() !== this.getId()) return false;

			// Slot 2 have to have free space for Current Slot items
			if (slot2.getFree() < this.getCount()) return false;

			// Make transition
			slot2.addCount(this.getCount())
			slot2.setId(this.getId());
			this.setNothing();

			return true;
		}
	}

	@Engine.dto("haxidenti.Inventory")
	export class Inventory {
		constructor(public maximum: number = 32) {
			this.slots = [];
			for (let i = 0; i < this.maximum; i++) {
				this.slots.push([0, 0]);
			}
		}

		private slots: [number, number][] = [];

		isSlotAvailable(n: number): boolean {
			return n > 0 || n < this.maximum;
		}

		allSlots(): SlotInfo[] {
			const slots: SlotInfo[] = [];
			for (let i = 0; i < this.maximum; i++) {
				const slot = this.slot(i);
				if (isNull(slot)) continue;
				slots.push(slot);
			}
			return slots;
		}

		slot(slotId: number): SlotInfo | null {
			if (!this.isSlotAvailable(slotId)) return null;
			return new SlotInfo(
				slotId,
				() => this.slots[slotId],
				(itemId, cnt) => { this.slots[slotId] = [itemId, cnt] }
			);
		}

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

		getItemSlots(itemId: number): SlotInfo[] {
			const slots: SlotInfo[] = [];
			for (let i = 0; i < this.maximum; i++) {
				const slot = this.slot(i);
				if (isNull(slot) || slot?.isNothing()) continue;
				if (slot.getId() === itemId) slots.push(slot);
			}
			return slots;
		}

		getFreeCountForItem(itemId: number): number {
			const slots = this.getFreeSlots(itemId);
			let count = 0;
			slots.forEach(s => count += s.getFree());
			return count;
		}

		addItem(itemId: number, count: number): boolean {
			if (this.getFreeCountForItem(itemId) < count) return false;
			for (let slot of this.getFreeSlots(itemId)) {
				// Stop if no more items
				if (count < 1) break;

				// Get free count for current slot
				const free = slot.getFree();

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

		transfer(itemId: number, count: number, inventory2: Inventory): boolean {
			// Check if second inventory has enough space
			if (inventory2.getFreeCountForItem(itemId) <= count) return false;

			// Take items from this inventory
			const taken = this.takeItem(itemId, count);
			if (!taken) return false;

			// Move them to another inventory
			return inventory2.addItem(itemId, count);
		}

		ui() {
			return new ui.InventoryUI(this);
		}

	}
}