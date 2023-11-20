import { customAlphabet } from 'nanoid/non-secure';

export const slugAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
export const slugRegex = new RegExp(`^[${slugAlphabet}]{0,12}$`);

export const generateSlug = (length: number = 4) => {
    // this equates to 62^5 = ~916000000 possible combinations
    return customAlphabet(slugAlphabet)(length);
};
