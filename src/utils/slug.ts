import { customAlphabet } from 'nanoid/non-secure';

export const slugAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
// eslint-disable-next-line regexp/use-ignore-case, regexp/prefer-range
export const slugRegex = new RegExp(`^[${slugAlphabet}]{0,12}$`);
const nanoid = customAlphabet(slugAlphabet);

export function generateSlug(length = 4) {
    return nanoid(length);
}
