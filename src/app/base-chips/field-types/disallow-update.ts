import { HybridField, Field, Context, SuperContext } from "../../../main";

export default class DisallowUpdate<T extends Field> extends HybridField<T> {
	typeName = "disallow-update";
	async isProperValue(
		context: Context,
		new_value: Parameters<T["checkValue"]>[1],
		old_value?: Parameters<T["checkValue"]>[2]
	) {
		context.app.Logger.debug3(
			"DISALLOW-UPDATE",
			"Checking if this field already has a value",
			{ new_value, old_value }
		);
		if (old_value === undefined) {
			return this.virtual_field.checkValue(
				new context.app.SuperContext(),
				new_value,
				old_value
			);
		}
		return Field.invalid("You cannot change a previously set value");
	}
}