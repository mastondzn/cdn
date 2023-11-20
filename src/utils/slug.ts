import { customAlphabet } from 'nanoid/non-secure';

export const slugAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
export const slugRegex = new RegExp(`^[${slugAlphabet}]{0,12}$`);

export const generateSlug = (length: number = 5) => {
    // this equates to 62^5 = 9.16132832e+8 possible combinations
    return customAlphabet(slugAlphabet)(length);
};
