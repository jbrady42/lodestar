/**
 * @module sszTypes/generators
 */
import {IBeaconParams} from "@chainsafe/eth2.0-params";
import {parseType, ContainerType} from "@chainsafe/ssz-type-schema";

import * as primitive from "./primitive";
import * as misc from "./misc";
import * as operations from "./operations";
import * as block from "./block";
import * as state from "./state";
import * as validator from "./validator";
import * as wire from "./wire";

import {IBeaconSSZTypes, typeNames} from "../interface";

const allGenerators = {
  ...misc,
  ...operations,
  ...block,
  ...state,
  ...validator,
  ...wire,
};

export function createIBeaconSSZTypes(params: IBeaconParams): IBeaconSSZTypes {
  const types: IBeaconSSZTypes = {} as IBeaconSSZTypes;
  // primitive types (don't need generators)
  for (const type in primitive) {
    // @ts-ignore
    // eslint-disable-next-line import/namespace
    types[type] = parseType(primitive[type]);
  }
  // relies on list of typenames in dependency order
  typeNames.forEach((type) => {
    // @ts-ignore
    types[type] = parseType(allGenerators[type](types, params)) as ContainerType;
  });
  /* or if we can separate out types w/ dependencies into files
  for (const type in misc) {
    types[type] = misc[type](types, params);
  }
  for (const type in operations) {
    types[type] = operations[type](types, params);
  }
  for (const type in block) {
    types[type] = block[type](types, params);
  }
  for (const type in state) {
    types[type] = state[type](types, params);
  }
  for (const type in validator) {
    types[type] = validator[type](types, params);
  }
  for (const type in wire) {
    types[type] = wire[type](types, params);
  }
   */
  return types;
}
