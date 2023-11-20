import { customAlphabet } from 'nanoid/non-secure';

export const slugAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
export const slugRegex = new RegExp(`^[${slugAlphabet}]{0,12}$`);
const nanoid = customAlphabet(slugAlphabet);

export const generateSlug = (length: number = 4) => {
    return nanoid(length);
};
