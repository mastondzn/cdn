import { customAlphabet } from 'nanoid';

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export const id = (length: number = 6) => {
    // this equates to 62^6 = 3,521,614,606,208 possible combinations
    return customAlphabet(alphabet)(length);
};
