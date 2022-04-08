/* INFO:
 * This method is useful for testing asynchronous calls like EventEmitter2 events or side effects
 * Usage:
 * await retryWithSleep(() => {
 *   return sendMethodMock.mock.calls.length === 1 && sendMessageCommandConstructor.mock.calls.length === 1;
 * });
 * sleepTime and maxRetires are optional
 *
 * default sleep-retry config is in 100ms intervals to end the loop as soon as possible
 */

async function sleep(timeInMillis: number) {
  return new Promise((resolve) => setTimeout(resolve, timeInMillis));
}

export async function retryWithSleep(
  validator: () => Promise<boolean> | boolean,
  sleepTimeInMillis = 100,
  maxRetriesCount = 50,
) {
  for (let i = 0; i < maxRetriesCount; i++) {
    if (await validator()) {
      return;
    } else {
      await sleep(sleepTimeInMillis);
    }
  }
}
