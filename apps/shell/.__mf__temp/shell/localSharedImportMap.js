
// Windows temporarily needs this file, https://github.com/module-federation/vite/issues/68

    import {loadShare} from "@module-federation/runtime";
    const importMap = {
      
        "@lolas/core-sdk": async () => {
          let pkg = await import("__mf__virtual/shell__prebuild___mf_0_lolas_mf_1_core_mf_2_sdk__prebuild__.js");
            return pkg;
        }
      ,
        "pinia": async () => {
          let pkg = await import("__mf__virtual/shell__prebuild__pinia__prebuild__.js");
            return pkg;
        }
      ,
        "vue": async () => {
          let pkg = await import("__mf__virtual/shell__prebuild__vue__prebuild__.js");
            return pkg;
        }
      
    }
      const usedShared = {
      
          "@lolas/core-sdk": {
            name: "@lolas/core-sdk",
            version: "0.0.0",
            scope: ["default"],
            loaded: false,
            from: "shell",
            async get () {
              if (false) {
                throw new Error(`[Module Federation] Shared module '${"@lolas/core-sdk"}' must be provided by host`);
              }
              usedShared["@lolas/core-sdk"].loaded = true
              const {"@lolas/core-sdk": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = false && "@lolas/core-sdk" === "react"
                ? (res?.default ?? res)
                : {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: false,
              requiredVersion: "^0.0.0",
              
            }
          }
        ,
          "pinia": {
            name: "pinia",
            version: "2.3.1",
            scope: ["default"],
            loaded: false,
            from: "shell",
            async get () {
              if (false) {
                throw new Error(`[Module Federation] Shared module '${"pinia"}' must be provided by host`);
              }
              usedShared["pinia"].loaded = true
              const {"pinia": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = false && "pinia" === "react"
                ? (res?.default ?? res)
                : {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: false,
              requiredVersion: "^2.3.1",
              
            }
          }
        ,
          "vue": {
            name: "vue",
            version: "3.5.28",
            scope: ["default"],
            loaded: false,
            from: "shell",
            async get () {
              if (false) {
                throw new Error(`[Module Federation] Shared module '${"vue"}' must be provided by host`);
              }
              usedShared["vue"].loaded = true
              const {"vue": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = false && "vue" === "react"
                ? (res?.default ?? res)
                : {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: false,
              requiredVersion: "^3.5.28",
              
            }
          }
        
    }
      const usedRemotes = [
                {
                  entryGlobalName: "freeze_math",
                  name: "freeze_math",
                  type: "var",
                  entry: "freeze_math",
                  shareScope: "default",
                }
          ,
                {
                  entryGlobalName: "number_detective",
                  name: "number_detective",
                  type: "var",
                  entry: "number_detective",
                  shareScope: "default",
                }
          ,
                {
                  entryGlobalName: "letter_detective",
                  name: "letter_detective",
                  type: "var",
                  entry: "letter_detective",
                  shareScope: "default",
                }
          ,
                {
                  entryGlobalName: "word_detective",
                  name: "word_detective",
                  type: "var",
                  entry: "word_detective",
                  shareScope: "default",
                }
          ,
                {
                  entryGlobalName: "letter_flip_detective",
                  name: "letter_flip_detective",
                  type: "var",
                  entry: "letter_flip_detective",
                  shareScope: "default",
                }
          ,
                {
                  entryGlobalName: "spelling_detective",
                  name: "spelling_detective",
                  type: "var",
                  entry: "spelling_detective",
                  shareScope: "default",
                }
          ,
                {
                  entryGlobalName: "math_blast",
                  name: "math_blast",
                  type: "var",
                  entry: "math_blast",
                  shareScope: "default",
                }
          
      ]
      export {
        usedShared,
        usedRemotes
      }
      