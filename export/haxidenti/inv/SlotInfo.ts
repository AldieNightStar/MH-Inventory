namespace haxidenti.inventory {

	export class SlotInfo {
		constructor(
			public slotId: number,
			private _get: () => [number, number],
			private _update: (id: number, count: number) => void
		) { }

		/**
		 * Get item id
		 */
		getId() {
			const raw = this._get();
			if (isNull(raw)) return 0;

			const [id] = raw;
			return id;
		}

		/**
		 * Get item stack count
		 */
		getCount() {
			const raw = this._get();
			if (isNull(raw)) return 0;

			const [, count] = raw;
			return count;
		}

		/**
		 * Get information about that item or null, if unknown
		 */
		getRegistryInfo(): ItemInfo | null {
			const id = this.getId();
			if (id < 1) return null;

			return getRegistryItem(id) || null;
		}

		/**
		 * Get name of that item or null, if unknown
		 */
		getName(): string | null {
			const info = this.getRegistryInfo();
			if (isNull(info)) return null;
			return info.name;
		}

		/**
		 * Get tags of that item
		 */
		getTags(): string[] {
			const info = this.getRegistryInfo();
			if (isNull(info)) return [];
			return info.tags;
		}

		/**
		 * Get maximum stack of that item
		 */
		getMax(): number {
			// For Nothing
			if (this.getId() === 0) return DEFAULT_ITEM_STACK;

			const info = this.getRegistryInfo();
			if (isNull(info)) return 0;
			return info.maxStack;
		}

		/**
		 * Get free space for new items in this stack
		 */
		getFree(): number {
			const max = this.getMax();
			const free = max - this.getCount();
			// If less than 0 then return 0 and if more than max then return max
			if (free > 0) return free;
			if (free > max) return max;
			return 0;
		}

		/**
		 * Checks whether this slot is pointing to nothing-item
		 */
		isNothing(): boolean {
			return this.getId() === 0 || this.getCount() < 1;
		}

		/**
		 * Set stack count by hands
		 */
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

		/**
		 * Change itemId
		 */
		setId(itemId: number) {
			let count = this.getCount();
			const max = this.getMax();
			if (itemId < 1) {
				itemId = 0;
				count = 0;
			}
			if (count > max) count = max;
			this._update(itemId, count)
		}

		/**
		 * Add some amount to that stack. Will return false if too many
		 */
		addCount(n: number): boolean {
			const newCount = this.getCount() + n;
			if (newCount > this.getMax()) return false;
			this.setCount(newCount);
			return true;
		}

		/**
		 * Erases content of that slot
		 */
		setNothing() {
			this._update(0, 0);
		}

		/**
		 * Tries to move data inside that slot to another. Will return false if can't or slot2 is not free
		 */
		transferTo(slot2: SlotInfo): boolean {
			// Do not allow to send items to itself
			if (this === slot2) return false;

			// Current Slot has have something
			if (this.isNothing() || this.getCount() < 1) return false;

			// Slot 2 myst have exact type or be empty
			if (!(slot2.isNothing() || slot2.getId() === this.getId())) return false;

			// Slot 2 have to have free space for Current Slot items
			if (slot2.getFree() < this.getCount()) return false;

			// Make transition
			slot2.addCount(this.getCount())
			slot2.setId(this.getId());
			this.setNothing();

			return true;
		}
	}

}