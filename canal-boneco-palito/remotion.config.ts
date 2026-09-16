/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.overrideBundlerConfig(enableTailwind);

// Ambiente sandbox já traz um Chromium headless pré-instalado (usado pelo
// Playwright); reaproveitamos para evitar o download bloqueado pela rede.
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
// O proxy de rede do sandbox usa uma CA própria que o Chromium não confia
// por padrão; necessário para carregar as Google Fonts durante o render.
Config.setChromiumIgnoreCertificateErrors(true);
