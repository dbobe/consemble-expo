import "@azure/core-asynciterator-polyfill";
import "@bacons/text-decoder/install";
import "react-native-get-random-values";
import { polyfillGlobal } from "react-native/Libraries/Utilities/PolyfillFunctions";
import { ReadableStream } from "readable-stream";

polyfillGlobal("ReadableStream", () => ReadableStream);
