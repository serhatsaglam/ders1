"use strict";

module.exports = function (grunt) {
  /*
    var sUser = grunt.option('user');
    var sPwd = grunt.option('pwd');
    */

  // load grunt plugins
  require("jit-grunt")(grunt, {
    configureProxies: "grunt-connect-proxy",
  });

  grunt.initConfig({
    settings: {
      connect: {
        host: "localhost",
        port: "8000",
      },
      proxy: {
        host: "10.248.1.20",
        port: "8000",
      },
    },

    connect: {
      options: {
        hostname: "<%= settings.connect.host %>",
        port: "<%= settings.connect.port %>",
        livereload: 35729,
        middleware: function (connect, options, defaultMiddleware) {
          var aMiddlewares = [];
          aMiddlewares.push(
            require("grunt-connect-proxy/lib/utils").proxyRequest
          );
          aMiddlewares.push(defaultMiddleware);
          return aMiddlewares;
        },
      },
      connectWebapp: {
        options: {
          base: ["webapp"],
          open: true,
        },
      },
      proxies: [
        {
          context: "/resources",
          host: "<%= settings.proxy.host %>",
          port: "<%= settings.proxy.port %>",
          https: false,
          rewrite: {
            "/resources": "/sap/public/bc/ui5_ui5/resources",
          },
        },
        {
          context: "/sap",
          host: "<%= settings.proxy.host %>",
          port: "<%= settings.proxy.port %>",
          https: false,
        },
      ],
    },

    watch: {
      options: {
        livereload: true,
      },
      watchWebapp: {
        files: ["webapp/**/*"],
      },
    },

    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: "webapp",
            src: "**",
            dest: "dist/",
          },
          {
            expand: true,
            src: ["neo-app.json", "package.json", "Gruntfile.js"],
            dest: "dist/",
          },
        ],
      },
    },
    clean: {
      dist: "dist/**",
    },
    openui5_preload: {
      component: {
        options: {
          //resources:'webapp',
          resources: {
            cwd: "webapp",
            prefix: "com/taha/orme",
          },
          dest: "dist",
        },
        components: "com/taha/orme",
      },
    },
    replace: {
      dist: {
        options: {
          patterns: [
            {
              match: /\/sapui5\/latest\/resources\/sap-ui-core.js/g,
              replacement: "../resources/sap-ui-core.js",
            },
            {
              match: /\/taha\/proxy/g,
              replacement: "",
            },
          ],
        },
        files: [
          {
            expand: true,
            flatten: true,
            src: ["dist/index.html"],
            dest: "dist/",
          },
          {
            expand: true,
            flatten: true,
            src: ["dist/dataService/*.js"],
            dest: "dist/dataService/",
          },
          //{expand: true, flatten: true, src: ['dist/dataService/KumasSevkDataService.js'], dest: 'dist/dataService/'}
        ],
      },
    },
    nwabap_ui5uploader: {
      options: {
        conn: {
          server:
            "http://<%= settings.proxy.host %>:<%= settings.proxy.port %>",
        },
        auth: {
          user: "danisman",
          pwd: "Kartonsan2021*",
        },
      },
      upload_build: {
        options: {
          ui5: {
            package: "Z_FIORI",
            bspcontainer: "zders",
            bspcontainer_text: "ders 1",
            transportno: "KFDK900086",
            calc_appindex: true,
          },
          resources: {
            cwd: "dist",
            src: "**/*.*",
          },
        },
      },
    },
  });

  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-openui5");
  grunt.loadNpmTasks("grunt-replace");
  grunt.loadNpmTasks("grunt-nwabap-ui5uploader");

  //grunt.registerTask('build',['clean','openui5_preload','copy']);
  grunt.registerTask("build", ["clean", "copy"]);

  grunt.registerTask("default", ["build", "nwabap_ui5uploader"]);
  //grunt.registerTask('default', ['build', 'replace']);
};
