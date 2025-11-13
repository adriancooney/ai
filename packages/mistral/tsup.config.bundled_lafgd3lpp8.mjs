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
      name: "@ai-sdk/mistral",
      version: "3.0.0-beta.31",
      license: "Apache-2.0",
      sideEffects: false,
      main: "./dist/index.js",
      module: "./dist/index.mjs",
      types: "./dist/index.d.ts",
      files: [
        "dist/**/*",
        "CHANGELOG.md"
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
  }
]);
export {
  tsup_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFja2FnZS5qc29uIiwgInRzdXAuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJ7XG4gIFwibmFtZVwiOiBcIkBhaS1zZGsvbWlzdHJhbFwiLFxuICBcInZlcnNpb25cIjogXCIzLjAuMC1iZXRhLjMxXCIsXG4gIFwibGljZW5zZVwiOiBcIkFwYWNoZS0yLjBcIixcbiAgXCJzaWRlRWZmZWN0c1wiOiBmYWxzZSxcbiAgXCJtYWluXCI6IFwiLi9kaXN0L2luZGV4LmpzXCIsXG4gIFwibW9kdWxlXCI6IFwiLi9kaXN0L2luZGV4Lm1qc1wiLFxuICBcInR5cGVzXCI6IFwiLi9kaXN0L2luZGV4LmQudHNcIixcbiAgXCJmaWxlc1wiOiBbXG4gICAgXCJkaXN0LyoqLypcIixcbiAgICBcIkNIQU5HRUxPRy5tZFwiXG4gIF0sXG4gIFwic2NyaXB0c1wiOiB7XG4gICAgXCJidWlsZFwiOiBcInBucG0gY2xlYW4gJiYgdHN1cCAtLXRzY29uZmlnIHRzY29uZmlnLmJ1aWxkLmpzb25cIixcbiAgICBcImJ1aWxkOndhdGNoXCI6IFwicG5wbSBjbGVhbiAmJiB0c3VwIC0td2F0Y2hcIixcbiAgICBcImNsZWFuXCI6IFwicm0gLXJmIGRpc3QgKi50c2J1aWxkaW5mb1wiLFxuICAgIFwibGludFwiOiBcImVzbGludCBcXFwiLi8qKi8qLnRzKlxcXCJcIixcbiAgICBcInR5cGUtY2hlY2tcIjogXCJ0c2MgLS1idWlsZFwiLFxuICAgIFwicHJldHRpZXItY2hlY2tcIjogXCJwcmV0dGllciAtLWNoZWNrIFxcXCIuLyoqLyoudHMqXFxcIlwiLFxuICAgIFwidGVzdFwiOiBcInBucG0gdGVzdDpub2RlICYmIHBucG0gdGVzdDplZGdlXCIsXG4gICAgXCJ0ZXN0OnVwZGF0ZVwiOiBcInBucG0gdGVzdDpub2RlIC11XCIsXG4gICAgXCJ0ZXN0OndhdGNoXCI6IFwidml0ZXN0IC0tY29uZmlnIHZpdGVzdC5ub2RlLmNvbmZpZy5qc1wiLFxuICAgIFwidGVzdDplZGdlXCI6IFwidml0ZXN0IC0tY29uZmlnIHZpdGVzdC5lZGdlLmNvbmZpZy5qcyAtLXJ1blwiLFxuICAgIFwidGVzdDpub2RlXCI6IFwidml0ZXN0IC0tY29uZmlnIHZpdGVzdC5ub2RlLmNvbmZpZy5qcyAtLXJ1blwiXG4gIH0sXG4gIFwiZXhwb3J0c1wiOiB7XG4gICAgXCIuL3BhY2thZ2UuanNvblwiOiBcIi4vcGFja2FnZS5qc29uXCIsXG4gICAgXCIuXCI6IHtcbiAgICAgIFwidHlwZXNcIjogXCIuL2Rpc3QvaW5kZXguZC50c1wiLFxuICAgICAgXCJpbXBvcnRcIjogXCIuL2Rpc3QvaW5kZXgubWpzXCIsXG4gICAgICBcInJlcXVpcmVcIjogXCIuL2Rpc3QvaW5kZXguanNcIlxuICAgIH1cbiAgfSxcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQGFpLXNkay9wcm92aWRlclwiOiBcIndvcmtzcGFjZToqXCIsXG4gICAgXCJAYWktc2RrL3Byb3ZpZGVyLXV0aWxzXCI6IFwid29ya3NwYWNlOipcIlxuICB9LFxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAYWktc2RrL3Rlc3Qtc2VydmVyXCI6IFwid29ya3NwYWNlOipcIixcbiAgICBcIkB0eXBlcy9ub2RlXCI6IFwiMjAuMTcuMjRcIixcbiAgICBcIkB2ZXJjZWwvYWktdHNjb25maWdcIjogXCJ3b3Jrc3BhY2U6KlwiLFxuICAgIFwidHN1cFwiOiBcIl44XCIsXG4gICAgXCJ0eXBlc2NyaXB0XCI6IFwiNS44LjNcIixcbiAgICBcInpvZFwiOiBcIjMuMjUuNzZcIlxuICB9LFxuICBcInBlZXJEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiem9kXCI6IFwiXjMuMjUuNzYgfHwgXjQuMS44XCJcbiAgfSxcbiAgXCJlbmdpbmVzXCI6IHtcbiAgICBcIm5vZGVcIjogXCI+PTE4XCJcbiAgfSxcbiAgXCJwdWJsaXNoQ29uZmlnXCI6IHtcbiAgICBcImFjY2Vzc1wiOiBcInB1YmxpY1wiXG4gIH0sXG4gIFwiaG9tZXBhZ2VcIjogXCJodHRwczovL2FpLXNkay5kZXYvZG9jc1wiLFxuICBcInJlcG9zaXRvcnlcIjoge1xuICAgIFwidHlwZVwiOiBcImdpdFwiLFxuICAgIFwidXJsXCI6IFwiZ2l0K2h0dHBzOi8vZ2l0aHViLmNvbS92ZXJjZWwvYWkuZ2l0XCJcbiAgfSxcbiAgXCJidWdzXCI6IHtcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS92ZXJjZWwvYWkvaXNzdWVzXCJcbiAgfSxcbiAgXCJrZXl3b3Jkc1wiOiBbXG4gICAgXCJhaVwiXG4gIF1cbn1cbiIsICJjb25zdCBfX2luamVjdGVkX2ZpbGVuYW1lX18gPSBcIi9Vc2Vycy9hZHJpYW4vQ29kZS9haS9wYWNrYWdlcy9taXN0cmFsL3RzdXAuY29uZmlnLnRzXCI7Y29uc3QgX19pbmplY3RlZF9kaXJuYW1lX18gPSBcIi9Vc2Vycy9hZHJpYW4vQ29kZS9haS9wYWNrYWdlcy9taXN0cmFsXCI7Y29uc3QgX19pbmplY3RlZF9pbXBvcnRfbWV0YV91cmxfXyA9IFwiZmlsZTovLy9Vc2Vycy9hZHJpYW4vQ29kZS9haS9wYWNrYWdlcy9taXN0cmFsL3RzdXAuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndHN1cCc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyhbXG4gIHtcbiAgICBlbnRyeTogWydzcmMvaW5kZXgudHMnXSxcbiAgICBmb3JtYXQ6IFsnY2pzJywgJ2VzbSddLFxuICAgIGR0czogdHJ1ZSxcbiAgICBzb3VyY2VtYXA6IHRydWUsXG4gICAgZGVmaW5lOiB7XG4gICAgICBfX1BBQ0tBR0VfVkVSU0lPTl9fOiBKU09OLnN0cmluZ2lmeShcbiAgICAgICAgKGF3YWl0IGltcG9ydCgnLi9wYWNrYWdlLmpzb24nLCB7IHdpdGg6IHsgdHlwZTogJ2pzb24nIH0gfSkpLmRlZmF1bHRcbiAgICAgICAgICAudmVyc2lvbixcbiAgICAgICksXG4gICAgfSxcbiAgfSxcbl0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFDRSxNQUFRO0FBQUEsTUFDUixTQUFXO0FBQUEsTUFDWCxTQUFXO0FBQUEsTUFDWCxhQUFlO0FBQUEsTUFDZixNQUFRO0FBQUEsTUFDUixRQUFVO0FBQUEsTUFDVixPQUFTO0FBQUEsTUFDVCxPQUFTO0FBQUEsUUFDUDtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsTUFDQSxTQUFXO0FBQUEsUUFDVCxPQUFTO0FBQUEsUUFDVCxlQUFlO0FBQUEsUUFDZixPQUFTO0FBQUEsUUFDVCxNQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxrQkFBa0I7QUFBQSxRQUNsQixNQUFRO0FBQUEsUUFDUixlQUFlO0FBQUEsUUFDZixjQUFjO0FBQUEsUUFDZCxhQUFhO0FBQUEsUUFDYixhQUFhO0FBQUEsTUFDZjtBQUFBLE1BQ0EsU0FBVztBQUFBLFFBQ1Qsa0JBQWtCO0FBQUEsUUFDbEIsS0FBSztBQUFBLFVBQ0gsT0FBUztBQUFBLFVBQ1QsUUFBVTtBQUFBLFVBQ1YsU0FBVztBQUFBLFFBQ2I7QUFBQSxNQUNGO0FBQUEsTUFDQSxjQUFnQjtBQUFBLFFBQ2Qsb0JBQW9CO0FBQUEsUUFDcEIsMEJBQTBCO0FBQUEsTUFDNUI7QUFBQSxNQUNBLGlCQUFtQjtBQUFBLFFBQ2pCLHVCQUF1QjtBQUFBLFFBQ3ZCLGVBQWU7QUFBQSxRQUNmLHVCQUF1QjtBQUFBLFFBQ3ZCLE1BQVE7QUFBQSxRQUNSLFlBQWM7QUFBQSxRQUNkLEtBQU87QUFBQSxNQUNUO0FBQUEsTUFDQSxrQkFBb0I7QUFBQSxRQUNsQixLQUFPO0FBQUEsTUFDVDtBQUFBLE1BQ0EsU0FBVztBQUFBLFFBQ1QsTUFBUTtBQUFBLE1BQ1Y7QUFBQSxNQUNBLGVBQWlCO0FBQUEsUUFDZixRQUFVO0FBQUEsTUFDWjtBQUFBLE1BQ0EsVUFBWTtBQUFBLE1BQ1osWUFBYztBQUFBLFFBQ1osTUFBUTtBQUFBLFFBQ1IsS0FBTztBQUFBLE1BQ1Q7QUFBQSxNQUNBLE1BQVE7QUFBQSxRQUNOLEtBQU87QUFBQSxNQUNUO0FBQUEsTUFDQSxVQUFZO0FBQUEsUUFDVjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUE7QUFBQTs7O0FDakVnUSxTQUFTLG9CQUFvQjtBQUU3UixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQjtBQUFBLElBQ0UsT0FBTyxDQUFDLGNBQWM7QUFBQSxJQUN0QixRQUFRLENBQUMsT0FBTyxLQUFLO0FBQUEsSUFDckIsS0FBSztBQUFBLElBQ0wsV0FBVztBQUFBLElBQ1gsUUFBUTtBQUFBLE1BQ04scUJBQXFCLEtBQUs7QUFBQSxTQUN2QixNQUFNLGlFQUFzRCxRQUMxRDtBQUFBLE1BQ0w7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
