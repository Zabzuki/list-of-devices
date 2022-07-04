import { getMostRecentDevices } from './getMostRecentDevices'

/**
 * Counts the number of executions of the given function.
 * This helps to verify that the solution does not call one of the methods multiple times.
 **/
const callCount = <Result>(
	fn: (...args: unknown[]) => Result,
): {
	fn: (...args: unknown[]) => Result
	count: () => number
	reset: () => void
} => {
	let n = 0
	return {
		fn: (...args: unknown[]) => {
			n++
			return fn(...args)
		},
		count: () => n,
		reset: () => {
			n = 0
		},
	}
}

describe('getMostRecentDevices', () => {
	describe('example', () => {
		const getFavoritedDevicesCounter = callCount(async () =>
			Promise.resolve([
				{ id: 1, name: 'Assignat' },
				{ id: 10, name: 'Moonbeam' },
			]),
		)
		const getLastAccessDevicesCounter = callCount(async () =>
			Promise.resolve([
				{ id: 6, name: 'Copperas' },
				{ id: 1, name: 'Assignat' },
				{ id: 7, name: 'Caviling' },
			]),
		)
		const example = getMostRecentDevices({
			getFavoritedDevices: getFavoritedDevicesCounter.fn,
			getLastAccessDevices: getLastAccessDevicesCounter.fn,
		})

		it.each([
			[1, ['Assignat']],
			[3, ['Assignat', 'Moonbeam', 'Copperas']],
			[4, ['Assignat', 'Moonbeam', 'Copperas', 'Caviling']],
		])('should solve the example for N=%d', async (N, expected) => {
			getFavoritedDevicesCounter.reset()
			getLastAccessDevicesCounter.reset()
			expect(await example({ id: 42 }, N)).toEqual(expected)
			expect(getFavoritedDevicesCounter.count()).toEqual(1)
			expect(getLastAccessDevicesCounter.count()).toEqual(1)
		})

		it('should reject if not enough brands (N=5)', async () =>
			expect(example({ id: 42 }, 5)).rejects.toThrow(/Not enough data/))
	})

	describe('should reject if both promises reject', () => {
		test('reject with both promises rejecting', async () => {
			const { fn: getFavoritedDevices, count: getFavoritedDevicesCallCount } =
				callCount(async () =>
					Promise.reject(new Error('Internal Server Error')),
				)
			const { fn: getLastAccessDevices, count: getLastAccessDevicesCallCount } =
				callCount(async () =>
					Promise.reject(new Error('Internal Server Error')),
				)
			await expect(
				getMostRecentDevices({
					getFavoritedDevices,
					getLastAccessDevices,
				})({ id: 42 }, 1),
			).rejects.toThrow(/Not enough data/)
			expect(getFavoritedDevicesCallCount()).toEqual(1)
			expect(getLastAccessDevicesCallCount()).toEqual(1)
		})
		test('resolve with getFavoritedDevices promise rejecting', async () => {
			const { fn: getFavoritedDevices, count: getFavoritedDevicesCallCount } =
				callCount(async () =>
					Promise.reject(new Error('Internal Server Error')),
				)
			const { fn: getLastAccessDevices, count: getLastAccessDevicesCallCount } =
				callCount(async () =>
					Promise.resolve([
						{ id: 6, name: 'Copperas' },
						{ id: 1, name: 'Assignat' },
						{ id: 7, name: 'Caviling' },
					]),
				)
			await expect(
				getMostRecentDevices({
					getFavoritedDevices,
					getLastAccessDevices,
				})({ id: 42 }, 1),
			).resolves.toEqual(['Copperas'])
			expect(getFavoritedDevicesCallCount()).toEqual(1)
			expect(getLastAccessDevicesCallCount()).toEqual(1)
		})
		test('resolve with getLastAccessDevices promise rejecting', async () => {
			const { fn: getFavoritedDevices, count: getFavoritedDevicesCallCount } =
				callCount(async () =>
					Promise.resolve([
						{ id: 1, name: 'Assignat' },
						{ id: 10, name: 'Moonbeam' },
					]),
				)
			const { fn: getLastAccessDevices, count: getLastAccessDevicesCallCount } =
				callCount(async () =>
					Promise.reject(new Error('Internal Server Error')),
				)
			await expect(
				getMostRecentDevices({
					getFavoritedDevices,
					getLastAccessDevices,
				})({ id: 42 }, 1),
			).resolves.toEqual(['Assignat'])
			expect(getFavoritedDevicesCallCount()).toEqual(1)
			expect(getLastAccessDevicesCallCount()).toEqual(1)
		})
	})
})
