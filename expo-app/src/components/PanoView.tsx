import { useMemo } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { assetUrl } from "@/content";
import type { Spot } from "@/data";

type PanoViewProps = {
  faces: [string, string, string, string, string, string];
  preview?: string;
  spots: Spot[];
  onSpot: (spot: Spot) => void;
};

const safeJson = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");

function buildHtml(faces: string[], spots: Spot[], preview?: string) {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.7/build/pannellum.css" />
    <script src="https://cdn.jsdelivr.net/npm/pannellum@2.5.7/build/pannellum.js"></script>
    <style>
      html, body, #panorama { width: 100%; height: 100%; margin: 0; overflow: hidden; background: #0b2318; }
      .pnlm-load-box p { color: #fff; }
      .rn-hotspot { display: flex; flex-direction: column; align-items: center; }
      .rn-hotspot .dot {
        width: 26px; height: 26px; border-radius: 50%; background: #d9a441;
        border: 2px solid #fff; color: #fff; font: 700 15px/22px sans-serif; text-align: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.35);
      }
      .rn-hotspot small {
        margin-top: 3px; max-width: 120px; padding: 2px 6px; border-radius: 6px;
        background: rgba(9,35,26,0.8); color: #fff; font: 700 10px sans-serif;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
    </style>
  </head>
  <body>
    <div id="panorama"></div>
    <script>
      var spots = ${safeJson(spots)};
      spots.forEach(function (spot) {
        spot.pitch = Math.max(-80, Math.min(80, (50 - spot.y) * 1.4));
        spot.yaw = (spot.x - 50) * 3.6;
        spot.cssClass = "rn-hotspot";
        spot.createTooltipFunc = function (div) {
          div.className = "rn-hotspot";
          var dot = document.createElement("span");
          dot.className = "dot";
          dot.textContent = spot.kind === "move" ? "→" : "+";
          var label = document.createElement("small");
          label.textContent = spot.label;
          div.appendChild(dot);
          div.appendChild(label);
        };
        spot.clickHandlerFunc = function () {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: "spot", id: spot.id }));
        };
      });
      window.pannellum.viewer("panorama", {
        type: "cubemap",
        cubeMap: ${safeJson(faces)},
        preview: ${safeJson(preview ?? faces[0])},
        autoLoad: true,
        showControls: true,
        showZoomCtrl: true,
        showFullscreenCtrl: false,
        mouseZoom: true,
        draggable: true,
        hfov: 100,
        minHfov: 45,
        maxHfov: 110,
        hotSpots: spots,
        escapeHTML: true,
        strings: {
          loadingLabel: "Loading 360° view...",
          genericWebGLError: "This device cannot display the 360° view."
        }
      });
    </script>
  </body>
</html>`;
}

export function PanoView({ faces, preview, spots, onSpot }: PanoViewProps) {
  const html = useMemo(
    () => buildHtml(faces.map(assetUrl), spots, preview ? assetUrl(preview) : undefined),
    [faces, preview, spots],
  );

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ html }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        onMessage={(event) => {
          try {
            const message = JSON.parse(event.nativeEvent.data) as { type?: string; id?: string };
            if (message.type !== "spot" || !message.id) return;
            const spot = spots.find((item) => item.id === message.id);
            if (spot) onSpot(spot);
          } catch {}
        }}
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator color="#fff" />
            <Text style={styles.loadingText}>Loading 360° view...</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b2318" },
  webview: { flex: 1, backgroundColor: "#0b2318" },
  loading: { ...StyleSheet.absoluteFill, alignItems: "center", justifyContent: "center", gap: 10 },
  loadingText: { color: "#fff", fontSize: 12 },
});
