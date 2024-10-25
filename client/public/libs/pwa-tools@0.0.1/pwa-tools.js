(function (context) {
  var PwaTools = {
    initManifest(manifestUrl) {
      fetch(manifestUrl)
        .then(function (response) {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Network response was not ok.");
          }
        })
        .then(function (data) {
          data.start_url = new URL(`/`, window.location.origin).href;
          var link = document.createElement("link");
          link.rel = "manifest";
          link.href =
            "data:application/json;charset=utf-8," +
            encodeURIComponent(JSON.stringify(data));
          document.head.appendChild(link);
        })
        .catch(function (error) {
          console.error("There was a problem with the fetch operation:", error);
        });
    },
    registerThemeColor(light = "#f5f5f5", dark = "#1c1c1e") {
      var lightMeta = document.createElement("meta");
      lightMeta.setAttribute("name", "theme-color");
      lightMeta.setAttribute("media", "(prefers-color-scheme: light)");
      lightMeta.setAttribute("content", light);
      document.head.appendChild(lightMeta);
      var darkMeta = document.createElement("meta");
      darkMeta.setAttribute("name", "theme-color");
      darkMeta.setAttribute("media", "(prefers-color-scheme: dark)");
      darkMeta.setAttribute("content", dark);
      document.head.appendChild(darkMeta);
      document.addEventListener(
        "custom-event:updateThemeColor",
        function (event) {
          const theme = event.detail;
          if (theme === "light") {
            lightMeta.setAttribute("content", light);
            darkMeta.setAttribute("content", light);
          } else if (theme === "dark") {
            lightMeta.setAttribute("content", dark);
            darkMeta.setAttribute("content", dark);
          } else {
            lightMeta.setAttribute("content", light);
            darkMeta.setAttribute("content", dark);
          }
        }
      );
    },
    triggerThemeUpdate(theme) {
      var event = new CustomEvent("custom-event:updateThemeColor", {
        detail: theme,
      });
      document.dispatchEvent(event);
    },
  };

  // Check if the environment is a browser
  if (typeof window !== "undefined") {
    context.PwaTools = PwaTools;
  }

  // CommonJS export
  if (typeof module !== "undefined" && module.exports) {
    module.exports = PwaTools;
  }

  // ES Module export
  if (typeof define === "function" && define.amd) {
    define([], function () {
      return PwaTools;
    });
  } else if (typeof exports === "object") {
    exports.PwaTools = PwaTools;
  }
})(typeof window !== "undefined" ? window : global);
