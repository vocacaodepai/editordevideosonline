import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

export const { fontFamily: headlineFont } = loadPlayfair("normal", {
  weights: ["600", "700"],
  subsets: ["latin"],
});

export const { fontFamily: bodyFont } = loadInter("normal", {
  weights: ["400", "600"],
  subsets: ["latin"],
});
