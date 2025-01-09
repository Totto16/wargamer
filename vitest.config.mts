import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: [
            //  'test/**/clients/*.ts',
            // 'test/**/errors/*.ts',
            // 'test/**/modules/*.ts',
            //'test/**/modules/common/*.ts',
            //TODO: fix those tests
            // 'test/**/modules/WorldOfTanks/*.ts',
            //'test/**/modules/WorldOfTanksBlitz/*.ts',
            //'test/**/modules/WorldOfTanksConsole/*.ts',
            //'test/**/modules/WorldOfWarplanes/*.ts',
            'test/**/modules/WorldOfWarships/*.ts',
            // 'test/**/responses/*.ts',
            //  'test/**/utils/*.ts',
            //  'test/**/WargamerTest.ts',
        ],
        exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/cypress/**',
            '**/.{idea,git,cache,output,temp}/**',
            '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
            '**/*.d.ts',
        ],
        typecheck: {
            tsconfig: './tsconfig.test.json',
        },
    },
})
