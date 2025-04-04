export async function dryRunAwait(seconds: number) {
  const miliseconds = seconds * 1000;
  await new Promise((resolve) => setTimeout(resolve, miliseconds));
}
