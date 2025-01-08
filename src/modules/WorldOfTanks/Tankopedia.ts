import { Fuse } from "fuse.js"
import ClientModule from "../ClientModule"
import {
	extractTopModules,
	localize,
	resolveEntry,
} from "../mixins/Encyclopedia"
import type BaseClient from "../../clients/BaseClient"
import type APIResponse from "../../responses/APIResponse"

/**
 * Mapping between module types and their ID field names.
 */
const MODULE_ID_FIELDS: Record<string, string> = {
	vehicleChassis: "suspension_id",
	vehicleEngine: "engine_id",
	vehicleGun: "gun_id",
	vehicleRadio: "radio_id",
	vehicleTurret: "turret_id",
}

type SingleVehicleData = {
	modules_tree: null // TODO
}

type VehicleModule = {
	module_id: string // TODO
}

type VehicleData = {
	[key in string]: SingleVehicleData
}

/**
 * @classdesc Module for the World of Tanks Tankopedia endpoint.
 * @extends ClientModule
 */
class Tankopedia extends ClientModule {
	private fuse: Fuse

	/**
	 * Constructor.
	 * @param {BaseClient} client - The API client this module belongs to.
	 */
	constructor(client: BaseClient) {
		super(client, "tankopedia")

		/**
		 * The module's Fuse object.
		 * @type {Fuse}
		 * @private
		 */
		this.fuse = new Fuse([], {
			keys: ["name", "short_name"],
		})
	}

	/**
	 * Searches for a vehicle by name or ID and returns its entry from the
	 *   `encyclopedia/vehicles` endpoint.
	 * @param {(number|string)} identifier - The vehicle identifier to use for
	 *   lookup.
	 * If a number is supplied, it is treated as the vehicle's ID.
	 * If a string is supplied, the identifier is matched against vehicle names
	 *   with the closest match being selected.
	 * @returns {Promise.<?Object, Error>} A promise resolving to the data for the
	 *   matched vehicle, or `null` if no vehicles were matched.
	 */
	findVehicle(
		identifier: number | string
	): Promise<SingleVehicleData | null> {
		return resolveEntry.call(this, {
			identifier,
			indexEndpoint: "encyclopedia/vehicles",
			dataEndpoint: "encyclopedia/vehicles",
			identifierKey: "tank_id",
			fuse: this.fuse,
			searchFields: ["name", "short_name"],
		})
	}

	/**
	 * Returns the vehicle profile for a given vehicle.
	 * @param {number} vehicleId - The vehicle ID to use for lookup.
	 * @param {string} [profile='stock'] - The vehicle profile to lookup. Can be
	 *   a profile ID, or one of `'stock'` or `'top'`. The top configuration is
	 *   determined by picking the most expensive modules to research in the
	 *   vehicle's research tree.
	 * @returns {Promise.<?Object, Error>} A promise resolving to the data for the
	 *   matched vehicle profile, or `null` if no vehicle was matched.
	 */
	findVehicleProfile(
		vehicleId: number,
		profile: string = "stock"
	): Promise<Record<string, unknown> | null> {
		if (profile === "stock") {
			return this.client
				.get<VehicleData>("encyclopedia/vehicleprofile", {
					tank_id: vehicleId,
				})
				.then(
					(response) =>
						(response.data && response.data[vehicleId]) ?? null
				)
		} else if (profile === "top") {
			return this.findVehicle(vehicleId)
				.then(
					(
						vehicleData: SingleVehicleData | null
					): Promise<APIResponse<Record<string, unknown>>> | null => {
						if (!vehicleData) {
							return null
						}

						const topModules: Record<string, VehicleModule> =
							extractTopModules(vehicleData.modules_tree)
						const queryFields = Object.keys(topModules).reduce(
							(accumulated, next) => {
								const fieldName = MODULE_ID_FIELDS[next]

								if (!fieldName) {
									//TODO: throw proper error
									throw new Error(
										`Field name '${next}' not found`
									)
								}

								if (!topModules[next]) {
									//TODO: throw proper error
									throw new Error(
										`Field name '${next}' not found in topModules`
									)
								}

								return {
									...accumulated,
									[fieldName]: topModules[next].module_id,
								}
							},
							{} as Record<string, unknown>
						)

						return this.client.get<Record<string, unknown>>(
							"encyclopedia/vehicleprofile",
							{
								...queryFields,
								tank_id: vehicleId,
							}
						)
					}
				)
				.then(
					(result) =>
						(result && result.data && result.data[vehicleId]) ??
						null
				)
		}

		return this.client
			.get<Record<string, Record<string, unknown>>>(
				"encyclopedia/vehicleprofile",
				{
					tank_id: vehicleId,
					profile_id: profile,
				}
			)
			.then(
				(response) =>
					(response.data && response.data[vehicleId]) ?? null
			)
	}

	/**
	 * Localizes a crew role slug.
	 * @param {string} slug - The slug.
	 * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
	 *   translated slug, or `undefined` if it couldn't be translated.
	 */
	localizeCrewRole(slug: string): Promise<string | undefined> {
		return localize.call(this, {
			method: "encyclopedia/info",
			type: "vehicle_crew_roles",
			slug,
		})
	}

	/**
	 * Localizes a language slug.
	 * @param {string} slug - The slug.
	 * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
	 *   translated slug, or `undefined` if it couldn't be translated.
	 */
	localizeLanguage(slug: string): Promise<string | undefined> {
		return localize.call(this, {
			method: "encyclopedia/info",
			type: "languages",
			slug,
		})
	}

	/**
	 * Localizes an achievement section slug. The returned value is the section's
	 *   name.
	 * @param {string} slug - The slug.
	 * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
	 *   translated slug, or `undefined` if it couldn't be translated.
	 */
	localizeAchievementSection(slug: string): Promise<string | undefined> {
		return localize
			.call(this, {
				method: "encyclopedia/info",
				type: "achievement_sections",
				slug,
			})
			.then(
				(section: undefined | { name?: string }) =>
					section && section.name
			)
	}

	/**
	 * Localizes a vehicle type slug.
	 * @param {string} slug - The slug.
	 * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
	 *   translated slug, or `undefined` if it couldn't be translated.
	 */
	localizeVehicleType(slug: string): Promise<string | undefined> {
		return localize.call(this, {
			method: "encyclopedia/info",
			type: "vehicle_types",
			slug,
		})
	}

	/**
	 * Localizes a vehicle nation slug.
	 * @param {string} slug - The slug.
	 * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
	 *   translated slug, or `undefined` if it couldn't be translated.
	 */
	localizeVehicleNation(slug: string): Promise<string | undefined> {
		return localize.call(this, {
			method: "encyclopedia/info",
			type: "vehicle_nations",
			slug,
		})
	}
}

export default Tankopedia
