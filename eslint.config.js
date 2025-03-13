import { maston } from '@mastondzn/eslint';

export default maston({
    typescript: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
    },
});
