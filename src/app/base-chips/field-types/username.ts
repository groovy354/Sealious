import Context from "../../../context";
import { Field } from "../../../main";

import me_synonyms from "../../../misc/me-synonyms";
import TextStorage from "./text-storage";

export default class Username extends TextStorage {
	typeName = "username";

	async isProperValue(_: Context, new_value: string, old_value: string) {
		if (old_value === new_value) {
			return Field.valid();
		}
		if (me_synonyms.indexOf(new_value) !== -1) {
			return Field.invalid(
				`'${new_value}' is a reserved keyword. Please pick another username.`
			);
		}

		const response = await this.app.collections.users
			.suList()
			.filter({ username: new_value })
			.fetch();

		if (!response.empty) {
			return Field.invalid("Username already taken");
		}
		return Field.valid();
	}
}