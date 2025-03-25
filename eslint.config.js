import { maston } from '@mastondzn/eslint';

export default maston(
    {
        typescript: {
            projectService: true,
            tsconfigRootDir: import.meta.dirname,
        },
    },
    { ignores: ['worker-configuration.d.ts', 'migrations'] },
);
