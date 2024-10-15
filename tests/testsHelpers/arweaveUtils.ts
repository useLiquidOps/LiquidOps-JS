import * as B64js from "base64-js";

// BINARY DATA TYPES:

export type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  // | Float16Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;

export type BinaryDataType =
  | ArrayBuffer
  | ArrayBufferView
  | TypedArray
  | DataView
  | Buffer;

function binaryDataTypeToUint8Array(buffer: BinaryDataType): Uint8Array {
  if (
    buffer instanceof Buffer ||
    buffer instanceof DataView ||
    ArrayBuffer.isView(buffer)
  ) {
    return new Uint8Array(buffer.buffer);
  } else if (buffer instanceof ArrayBuffer) {
    return new Uint8Array(buffer);
  }

  throw new Error("Unknown buffer type.");
}

export function binaryDataTypeToString(buffer: BinaryDataType): string {
  return new TextDecoder().decode(buffer);
}

export function binaryDataTypeTob64Url(buffer: BinaryDataType): B64UrlString {
  return uint8ArrayTob64Url(binaryDataTypeToUint8Array(buffer));
}

export function binaryDataTypeOrStringTob64String(
  source: string | BinaryDataType,
): B64UrlString {
  return typeof source === "string"
    ? stringTob64Url(source)
    : binaryDataTypeTob64Url(source);
}

export function binaryDataTypeOrStringToBinaryDataType(
  source: string | BinaryDataType,
) {
  return typeof source === "string" ? stringToUint8Array(source) : source;
}

export function stringTob64Url(str: string) {
  return uint8ArrayTob64Url(stringToUint8Array(str));
}

export function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

export function stringOrUint8ArrayToUint8Array(
  str: string | Uint8Array,
): Uint8Array {
  return typeof str === "string" ? new TextEncoder().encode(str) : str;
}

// export function bufferToUint8Array(buffer: Buffer): Uint8Array {
//   return new Uint8Array(new Uint8Array(buffer.buffer));
//
//   // Note that simply doing:
//   // return new Uint8Array(buffer.buffer);
//   // The old Buffer and the new Uint8Array will share the same data/memory, so changes to one also affect the other.
// }

// BASE 64:

// Let's use branded types here to make sure we always know what we are working with:

export type B64String = string & { __brand: "B64String" };

export type B64UrlString = string & { __brand: "B64UrlString" };

export type VerifiedUTF16String = string & { __brand: "VerifiedUTF16String" };

export function uint8ArrayTob64(buffer: Uint8Array): B64String {
  // TODO: Probably no need to have this new Uint8Array(...) here:
  return B64js.fromByteArray(new Uint8Array(buffer)) as B64String;
}

export function uint8ArrayTob64Url(buffer: Uint8Array): B64UrlString {
  return b64UrlEncode(uint8ArrayTob64(buffer));
}

export function b64ToUint8Array(str: B64String | B64UrlString): Uint8Array {
  return B64js.toByteArray(b64UrlDecode(str));
}

export function b64UrlEncode(str: B64String | B64UrlString): B64UrlString {
  return str
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/\=/g, "") as B64UrlString;
}

export function b64UrlDecode(str: B64String | B64UrlString): B64String {
  const padding = str.length % 4 == 0 ? 0 : 4 - (str.length % 4);

  return str
    .replace(/\-/g, "+")
    .replace(/\_/g, "/")
    .concat("=".repeat(padding)) as B64String;
}

// HASH:

export async function hash(
  data: BinaryDataType,
  algorithm: string = "SHA-256",
): Promise<Uint8Array> {
  let digest = await crypto.subtle.digest(algorithm, data);
  return new Uint8Array(digest);
}

// ADDRESS:

export async function ownerToAddress(owner: any): Promise<B64UrlString> {
  return uint8ArrayTob64Url(await hash(b64ToUint8Array(owner)));
}
