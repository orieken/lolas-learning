
// Windows temporarily needs this file, https://github.com/module-federation/vite/issues/68

    import {loadShare} from "@module-federation/runtime";
    const importMap = {
      
        "@lolas/core-sdk": async () => {
          let pkg = await import("__mf__virtual/word_detective__prebuild___mf_0_lolas_mf_1_core_mf_2_sdk__prebuild__.js");
            return pkg;
        }
      
    }
      const usedShared = {
      
          "@lolas/core-sdk": {
            name: "@lolas/core-sdk",
            version: "0.0.0",
            scope: ["default"],
            loaded: false,
            from: "word_detective",
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
        
    }
      const usedRemotes = [
      ]
      export {
        usedShared,
        usedRemotes
      }
      