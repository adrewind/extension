
// FIXME: decompose this module, it is too messy
export const body = document.getElementsByTagName('body')[0] || null;
export class NoElementError extends Error {}
