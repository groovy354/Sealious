import { is, predicates } from "@sealcode/ts-predicates";
import { Field, Context } from "../../../main";
import { ArrayStorage } from "./array-storage";

export class EnumMultiple<Values extends string> extends ArrayStorage<Values> {
	typeName = "enum-multiple";

	constructor(
		public allowed_values: Values[] | ((context: Context) => Values[])
	) {
		super(allowed_values, predicates.string);
	}

	async getAllowedValues(context: Context): Promise<Values[]> {
		if (typeof this.allowed_values === "function") {
			return this.allowed_values(context);
		} else {
			return this.allowed_values;
		}
	}

	async isProperValue(ctx: Context, value: string[]) {
		if (!is(value, predicates.array(predicates.string))) {
			return Field.invalid("Not an array of strings");
		}
		const allowed_values = await this.getAllowedValues(ctx);
		const bad_values = value.filter(
			(v) => !allowed_values.includes(v as Values)
		);

		if (bad_values.length) {
			return Field.invalid(`Invalid values: ${bad_values.join(",")}`);
		}
		return Field.valid();
	}

	async encode(_: Context, value: Values[]) {
		return value;
	}
}
