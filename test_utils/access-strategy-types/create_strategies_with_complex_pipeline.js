const Query = require("../../lib/datastore/query.js");

module.exports = {
	allow_deny: function(App) {
		const access_strategies = [
			"complex-deny-pipeline",
			"complex-allow-pipeline",
		];

		for (const strategy of access_strategies) {
			App.createChip(Sealious.AccessStrategyType, {
				name: strategy,
				getRestrictingQuery: async function() {
					const query = new Query();
					const id = query.lookup({
						from: "numbers",
						localField: "body.number",
						foreignField: "sealious_id",
					});
					return query.match({
						[`${id}._id`]: {
							$exists: strategy === "complex-allow-pipeline",
						},
					});
				},
				checker_function: function() {
					return Promise.resolve();
				},
				item_sensitive: true,
			});
		}
	},
};