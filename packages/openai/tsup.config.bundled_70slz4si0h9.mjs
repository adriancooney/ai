var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// package.json
var package_exports = {};
__export(package_exports, {
  default: () => package_default
});
var package_default;
var init_package = __esm({
  "package.json"() {
    package_default = {
      name: "@ai-sdk/openai",
      version: "3.0.0-beta.47",
      license: "Apache-2.0",
      sideEffects: false,
      main: "./dist/index.js",
      module: "./dist/index.mjs",
      types: "./dist/index.d.ts",
      files: [
        "dist/**/*",
        "CHANGELOG.md",
        "internal.d.ts"
      ],
      scripts: {
        build: "pnpm clean && tsup --tsconfig tsconfig.build.json",
        "build:watch": "pnpm clean && tsup --watch",
        clean: "rm -rf dist *.tsbuildinfo",
        lint: 'eslint "./**/*.ts*"',
        "type-check": "tsc --build",
        "prettier-check": 'prettier --check "./**/*.ts*"',
        test: "pnpm test:node && pnpm test:edge",
        "test:update": "pnpm test:node -u",
        "test:watch": "vitest --config vitest.node.config.js",
        "test:edge": "vitest --config vitest.edge.config.js --run",
        "test:node": "vitest --config vitest.node.config.js --run"
      },
      exports: {
        "./package.json": "./package.json",
        ".": {
          types: "./dist/index.d.ts",
          import: "./dist/index.mjs",
          require: "./dist/index.js"
        },
        "./internal": {
          types: "./dist/internal/index.d.ts",
          import: "./dist/internal/index.mjs",
          module: "./dist/internal/index.mjs",
          require: "./dist/internal/index.js"
        }
      },
      dependencies: {
        "@ai-sdk/provider": "workspace:*",
        "@ai-sdk/provider-utils": "workspace:*"
      },
      devDependencies: {
        "@ai-sdk/test-server": "workspace:*",
        "@types/node": "20.17.24",
        "@vercel/ai-tsconfig": "workspace:*",
        tsup: "^8",
        typescript: "5.8.3",
        zod: "3.25.76"
      },
      peerDependencies: {
        zod: "^3.25.76 || ^4.1.8"
      },
      engines: {
        node: ">=18"
      },
      publishConfig: {
        access: "public"
      },
      homepage: "https://ai-sdk.dev/docs",
      repository: {
        type: "git",
        url: "git+https://github.com/vercel/ai.git"
      },
      bugs: {
        url: "https://github.com/vercel/ai/issues"
      },
      keywords: [
        "ai"
      ]
    };
  }
});

// tsup.config.ts
import { defineConfig } from "tsup";
var tsup_config_default = defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    sourcemap: true,
    define: {
      __PACKAGE_VERSION__: JSON.stringify(
        (await Promise.resolve().then(() => (init_package(), package_exports))).default.version
      )
    }
  },
  {
    entry: ["src/internal/index.ts"],
    outDir: "dist/internal",
    format: ["cjs", "esm"],
    dts: true,
    sourcemap: true,
    define: {
      __PACKAGE_VERSION__: JSON.stringify(
        (await Promise.resolve().then(() => (init_package(), package_exports))).default.version
      )
    }
  }
]);
export {
  tsup_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFja2FnZS5qc29uIiwgInRzdXAuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJ7XG4gIFwibmFtZVwiOiBcIkBhaS1zZGsvb3BlbmFpXCIsXG4gIFwidmVyc2lvblwiOiBcIjMuMC4wLWJldGEuNDdcIixcbiAgXCJsaWNlbnNlXCI6IFwiQXBhY2hlLTIuMFwiLFxuICBcInNpZGVFZmZlY3RzXCI6IGZhbHNlLFxuICBcIm1haW5cIjogXCIuL2Rpc3QvaW5kZXguanNcIixcbiAgXCJtb2R1bGVcIjogXCIuL2Rpc3QvaW5kZXgubWpzXCIsXG4gIFwidHlwZXNcIjogXCIuL2Rpc3QvaW5kZXguZC50c1wiLFxuICBcImZpbGVzXCI6IFtcbiAgICBcImRpc3QvKiovKlwiLFxuICAgIFwiQ0hBTkdFTE9HLm1kXCIsXG4gICAgXCJpbnRlcm5hbC5kLnRzXCJcbiAgXSxcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcImJ1aWxkXCI6IFwicG5wbSBjbGVhbiAmJiB0c3VwIC0tdHNjb25maWcgdHNjb25maWcuYnVpbGQuanNvblwiLFxuICAgIFwiYnVpbGQ6d2F0Y2hcIjogXCJwbnBtIGNsZWFuICYmIHRzdXAgLS13YXRjaFwiLFxuICAgIFwiY2xlYW5cIjogXCJybSAtcmYgZGlzdCAqLnRzYnVpbGRpbmZvXCIsXG4gICAgXCJsaW50XCI6IFwiZXNsaW50IFxcXCIuLyoqLyoudHMqXFxcIlwiLFxuICAgIFwidHlwZS1jaGVja1wiOiBcInRzYyAtLWJ1aWxkXCIsXG4gICAgXCJwcmV0dGllci1jaGVja1wiOiBcInByZXR0aWVyIC0tY2hlY2sgXFxcIi4vKiovKi50cypcXFwiXCIsXG4gICAgXCJ0ZXN0XCI6IFwicG5wbSB0ZXN0Om5vZGUgJiYgcG5wbSB0ZXN0OmVkZ2VcIixcbiAgICBcInRlc3Q6dXBkYXRlXCI6IFwicG5wbSB0ZXN0Om5vZGUgLXVcIixcbiAgICBcInRlc3Q6d2F0Y2hcIjogXCJ2aXRlc3QgLS1jb25maWcgdml0ZXN0Lm5vZGUuY29uZmlnLmpzXCIsXG4gICAgXCJ0ZXN0OmVkZ2VcIjogXCJ2aXRlc3QgLS1jb25maWcgdml0ZXN0LmVkZ2UuY29uZmlnLmpzIC0tcnVuXCIsXG4gICAgXCJ0ZXN0Om5vZGVcIjogXCJ2aXRlc3QgLS1jb25maWcgdml0ZXN0Lm5vZGUuY29uZmlnLmpzIC0tcnVuXCJcbiAgfSxcbiAgXCJleHBvcnRzXCI6IHtcbiAgICBcIi4vcGFja2FnZS5qc29uXCI6IFwiLi9wYWNrYWdlLmpzb25cIixcbiAgICBcIi5cIjoge1xuICAgICAgXCJ0eXBlc1wiOiBcIi4vZGlzdC9pbmRleC5kLnRzXCIsXG4gICAgICBcImltcG9ydFwiOiBcIi4vZGlzdC9pbmRleC5tanNcIixcbiAgICAgIFwicmVxdWlyZVwiOiBcIi4vZGlzdC9pbmRleC5qc1wiXG4gICAgfSxcbiAgICBcIi4vaW50ZXJuYWxcIjoge1xuICAgICAgXCJ0eXBlc1wiOiBcIi4vZGlzdC9pbnRlcm5hbC9pbmRleC5kLnRzXCIsXG4gICAgICBcImltcG9ydFwiOiBcIi4vZGlzdC9pbnRlcm5hbC9pbmRleC5tanNcIixcbiAgICAgIFwibW9kdWxlXCI6IFwiLi9kaXN0L2ludGVybmFsL2luZGV4Lm1qc1wiLFxuICAgICAgXCJyZXF1aXJlXCI6IFwiLi9kaXN0L2ludGVybmFsL2luZGV4LmpzXCJcbiAgICB9XG4gIH0sXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBhaS1zZGsvcHJvdmlkZXJcIjogXCJ3b3Jrc3BhY2U6KlwiLFxuICAgIFwiQGFpLXNkay9wcm92aWRlci11dGlsc1wiOiBcIndvcmtzcGFjZToqXCJcbiAgfSxcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQGFpLXNkay90ZXN0LXNlcnZlclwiOiBcIndvcmtzcGFjZToqXCIsXG4gICAgXCJAdHlwZXMvbm9kZVwiOiBcIjIwLjE3LjI0XCIsXG4gICAgXCJAdmVyY2VsL2FpLXRzY29uZmlnXCI6IFwid29ya3NwYWNlOipcIixcbiAgICBcInRzdXBcIjogXCJeOFwiLFxuICAgIFwidHlwZXNjcmlwdFwiOiBcIjUuOC4zXCIsXG4gICAgXCJ6b2RcIjogXCIzLjI1Ljc2XCJcbiAgfSxcbiAgXCJwZWVyRGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcInpvZFwiOiBcIl4zLjI1Ljc2IHx8IF40LjEuOFwiXG4gIH0sXG4gIFwiZW5naW5lc1wiOiB7XG4gICAgXCJub2RlXCI6IFwiPj0xOFwiXG4gIH0sXG4gIFwicHVibGlzaENvbmZpZ1wiOiB7XG4gICAgXCJhY2Nlc3NcIjogXCJwdWJsaWNcIlxuICB9LFxuICBcImhvbWVwYWdlXCI6IFwiaHR0cHM6Ly9haS1zZGsuZGV2L2RvY3NcIixcbiAgXCJyZXBvc2l0b3J5XCI6IHtcbiAgICBcInR5cGVcIjogXCJnaXRcIixcbiAgICBcInVybFwiOiBcImdpdCtodHRwczovL2dpdGh1Yi5jb20vdmVyY2VsL2FpLmdpdFwiXG4gIH0sXG4gIFwiYnVnc1wiOiB7XG4gICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vdmVyY2VsL2FpL2lzc3Vlc1wiXG4gIH0sXG4gIFwia2V5d29yZHNcIjogW1xuICAgIFwiYWlcIlxuICBdXG59XG4iLCAiY29uc3QgX19pbmplY3RlZF9maWxlbmFtZV9fID0gXCIvVXNlcnMvYWRyaWFuL0NvZGUvYWkvcGFja2FnZXMvb3BlbmFpL3RzdXAuY29uZmlnLnRzXCI7Y29uc3QgX19pbmplY3RlZF9kaXJuYW1lX18gPSBcIi9Vc2Vycy9hZHJpYW4vQ29kZS9haS9wYWNrYWdlcy9vcGVuYWlcIjtjb25zdCBfX2luamVjdGVkX2ltcG9ydF9tZXRhX3VybF9fID0gXCJmaWxlOi8vL1VzZXJzL2Fkcmlhbi9Db2RlL2FpL3BhY2thZ2VzL29wZW5haS90c3VwLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3RzdXAnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoW1xuICB7XG4gICAgZW50cnk6IFsnc3JjL2luZGV4LnRzJ10sXG4gICAgZm9ybWF0OiBbJ2NqcycsICdlc20nXSxcbiAgICBkdHM6IHRydWUsXG4gICAgc291cmNlbWFwOiB0cnVlLFxuICAgIGRlZmluZToge1xuICAgICAgX19QQUNLQUdFX1ZFUlNJT05fXzogSlNPTi5zdHJpbmdpZnkoXG4gICAgICAgIChhd2FpdCBpbXBvcnQoJy4vcGFja2FnZS5qc29uJywgeyB3aXRoOiB7IHR5cGU6ICdqc29uJyB9IH0pKS5kZWZhdWx0XG4gICAgICAgICAgLnZlcnNpb24sXG4gICAgICApLFxuICAgIH0sXG4gIH0sXG4gIHtcbiAgICBlbnRyeTogWydzcmMvaW50ZXJuYWwvaW5kZXgudHMnXSxcbiAgICBvdXREaXI6ICdkaXN0L2ludGVybmFsJyxcbiAgICBmb3JtYXQ6IFsnY2pzJywgJ2VzbSddLFxuICAgIGR0czogdHJ1ZSxcbiAgICBzb3VyY2VtYXA6IHRydWUsXG4gICAgZGVmaW5lOiB7XG4gICAgICBfX1BBQ0tBR0VfVkVSU0lPTl9fOiBKU09OLnN0cmluZ2lmeShcbiAgICAgICAgKGF3YWl0IGltcG9ydCgnLi9wYWNrYWdlLmpzb24nLCB7IHdpdGg6IHsgdHlwZTogJ2pzb24nIH0gfSkpLmRlZmF1bHRcbiAgICAgICAgICAudmVyc2lvbixcbiAgICAgICksXG4gICAgfSxcbiAgfSxcbl0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFDRSxNQUFRO0FBQUEsTUFDUixTQUFXO0FBQUEsTUFDWCxTQUFXO0FBQUEsTUFDWCxhQUFlO0FBQUEsTUFDZixNQUFRO0FBQUEsTUFDUixRQUFVO0FBQUEsTUFDVixPQUFTO0FBQUEsTUFDVCxPQUFTO0FBQUEsUUFDUDtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLE1BQ0EsU0FBVztBQUFBLFFBQ1QsT0FBUztBQUFBLFFBQ1QsZUFBZTtBQUFBLFFBQ2YsT0FBUztBQUFBLFFBQ1QsTUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2Qsa0JBQWtCO0FBQUEsUUFDbEIsTUFBUTtBQUFBLFFBQ1IsZUFBZTtBQUFBLFFBQ2YsY0FBYztBQUFBLFFBQ2QsYUFBYTtBQUFBLFFBQ2IsYUFBYTtBQUFBLE1BQ2Y7QUFBQSxNQUNBLFNBQVc7QUFBQSxRQUNULGtCQUFrQjtBQUFBLFFBQ2xCLEtBQUs7QUFBQSxVQUNILE9BQVM7QUFBQSxVQUNULFFBQVU7QUFBQSxVQUNWLFNBQVc7QUFBQSxRQUNiO0FBQUEsUUFDQSxjQUFjO0FBQUEsVUFDWixPQUFTO0FBQUEsVUFDVCxRQUFVO0FBQUEsVUFDVixRQUFVO0FBQUEsVUFDVixTQUFXO0FBQUEsUUFDYjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLGNBQWdCO0FBQUEsUUFDZCxvQkFBb0I7QUFBQSxRQUNwQiwwQkFBMEI7QUFBQSxNQUM1QjtBQUFBLE1BQ0EsaUJBQW1CO0FBQUEsUUFDakIsdUJBQXVCO0FBQUEsUUFDdkIsZUFBZTtBQUFBLFFBQ2YsdUJBQXVCO0FBQUEsUUFDdkIsTUFBUTtBQUFBLFFBQ1IsWUFBYztBQUFBLFFBQ2QsS0FBTztBQUFBLE1BQ1Q7QUFBQSxNQUNBLGtCQUFvQjtBQUFBLFFBQ2xCLEtBQU87QUFBQSxNQUNUO0FBQUEsTUFDQSxTQUFXO0FBQUEsUUFDVCxNQUFRO0FBQUEsTUFDVjtBQUFBLE1BQ0EsZUFBaUI7QUFBQSxRQUNmLFFBQVU7QUFBQSxNQUNaO0FBQUEsTUFDQSxVQUFZO0FBQUEsTUFDWixZQUFjO0FBQUEsUUFDWixNQUFRO0FBQUEsUUFDUixLQUFPO0FBQUEsTUFDVDtBQUFBLE1BQ0EsTUFBUTtBQUFBLFFBQ04sS0FBTztBQUFBLE1BQ1Q7QUFBQSxNQUNBLFVBQVk7QUFBQSxRQUNWO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQTtBQUFBOzs7QUN4RTZQLFNBQVMsb0JBQW9CO0FBRTFSLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCO0FBQUEsSUFDRSxPQUFPLENBQUMsY0FBYztBQUFBLElBQ3RCLFFBQVEsQ0FBQyxPQUFPLEtBQUs7QUFBQSxJQUNyQixLQUFLO0FBQUEsSUFDTCxXQUFXO0FBQUEsSUFDWCxRQUFRO0FBQUEsTUFDTixxQkFBcUIsS0FBSztBQUFBLFNBQ3ZCLE1BQU0saUVBQXNELFFBQzFEO0FBQUEsTUFDTDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQTtBQUFBLElBQ0UsT0FBTyxDQUFDLHVCQUF1QjtBQUFBLElBQy9CLFFBQVE7QUFBQSxJQUNSLFFBQVEsQ0FBQyxPQUFPLEtBQUs7QUFBQSxJQUNyQixLQUFLO0FBQUEsSUFDTCxXQUFXO0FBQUEsSUFDWCxRQUFRO0FBQUEsTUFDTixxQkFBcUIsS0FBSztBQUFBLFNBQ3ZCLE1BQU0saUVBQXNELFFBQzFEO0FBQUEsTUFDTDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
