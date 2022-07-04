type Device = { id: number; name: string }

class UnprocessableError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'UnprocessableError'
	}
}

export const getMostRecentDevices =
	({
		getFavoritedDevices,
		getLastAccessDevices,
	}: {
		getFavoritedDevices: (id: number) => Promise<Device[]>
		getLastAccessDevices: (id: number) => Promise<Device[]>
	}) =>
	async (user: { id: number }, n: number): Promise<string[]> => {
		try {
			const allDevices = await Promise.allSettled([
				getFavoritedDevices(user.id),
				getLastAccessDevices(user.id),
			])

			if (
				allDevices[0].status === 'rejected' &&
				allDevices[1].status === 'rejected'
			) {
				throw Error
			}

			const favoritedDevices =
				allDevices[0].status === 'fulfilled' ? allDevices[0].value : []
			const lastAccessedDevices =
				allDevices[1].status === 'fulfilled' ? allDevices[1].value : []

			const favoritedDevicesNames = favoritedDevices.map(
				(device) => device.name,
			)
			const lastAccessedDevicesNames = lastAccessedDevices.map(
				(device) => device.name,
			)

			const allDeviceNames = [
				...favoritedDevicesNames,
				...lastAccessedDevicesNames,
			]

			const uniqueDeviceNames = [...new Set(allDeviceNames)]

			if (uniqueDeviceNames.length < n) {
				throw Error
			}

			return uniqueDeviceNames.slice(0, n)
		} catch (error: unknown) {
			throw new UnprocessableError(`Not enough data`)
		}
	}
