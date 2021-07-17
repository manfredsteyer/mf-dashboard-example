const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");

const share = mf.share;
const DashboardPlugin = require("@module-federation/dashboard-plugin");

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, '../../tsconfig.json'),
  ['auth-lib']
);

module.exports = {
  output: {
    uniqueName: "shell",
    publicPath: "auto"
  },
  optimization: {
    runtimeChunk: false
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    }
  },
  plugins: [
    new DashboardPlugin({
      publishVersion:"1.0.0",
      dashboardURL: "http://localhost:3001/api/update",
      metadata: {
        baseUrl: "http://localhost:3002",
        source: {
          url: "https://github.com/module-federation/federation-dashboard/tree/master/dashboard-example/dsl",
        },
        remote: "http://localhost:3002/remoteEntry.js",
      },
    }),
    new ModuleFederationPlugin({
      name: "shell",
      // For hosts (please adjust)
      remotes: {
          "mfe1": "mfe1@http://localhost:3000/remoteEntry.js",
      },

      shared: share({
        "@angular/core": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/common": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/router": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/common/http": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/material/snack-bar": { singleton: true, strictVersion: true, requiredVersion:'auto' },

        // Uncomment for sharing lib of an Angular CLI or Nx workspace
        ...sharedMappings.getDescriptors()
      })

    }),


    // Uncomment for sharing lib of an Angular CLI or Nx workspace
    //sharedMappings.getPlugin(),
  ],
};
