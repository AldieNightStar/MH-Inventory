namespace items {
	const define = haxidenti.inventory.defineItem;

	export const R_FLOWER = define(1, "🌹Red flower", ["flower"]);
	export const Y_FLOWER = define(2, "🌻Yellow flower", ["flower"]);
	export const P_FLOWER = define(3, "🌸Pink flower", ["flower"]);
	export const W_FLOWER = define(4, "🌼White flower", ["flower"]);
	export const FLOWER_DUST = define(5, "💮Flower dust", ["flower"]);

	export const FLOWER_FOOD = define(6, "🍞Flower Food", ["food"]);

	export const STICK = define(7, "🌿Stick", []);

	export function inventory() {
		return Game.v("Inventory", () => new haxidenti.inventory.Inventory()).get();
	}


}