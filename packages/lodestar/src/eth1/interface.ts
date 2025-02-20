/* eslint-disable @typescript-eslint/interface-name-prefix */

/**
 * @module eth1
 */

import {EventEmitter} from "events";

import {BeaconState, Eth1Data, Number64, DepositData} from "@chainsafe/lodestar-types";
import {Block} from "ethers/providers";
import StrictEventEmitter from "strict-event-emitter-types";
import {IBeaconConfig} from "@chainsafe/lodestar-config";

export interface IEth1Events {
  block: (block: Block) => void;
  deposit: (index: Number64, depositData: DepositData) => void;
}

export type Eth1EventEmitter = StrictEventEmitter<EventEmitter, IEth1Events>;

/**
 * The IEth1Notifier service watches the Eth1.0 chain for relevant events
 */
export interface IEth1Notifier extends Eth1EventEmitter {
  /**
   * If there isn't Eth2Genesis events in past logs, it should fetch
   * all the deposit logs from block at which contract is deployed.
   * If there is Eth2Genesis event in logs it should just listen for new eth1 blocks.
   */
  start(): Promise<void>;
  stop(): Promise<void>;

  /**
   * Initialize the ETH1 block cache.
   * @param config 
   * @param state 
   * @param slot 
   */
  initBlockCache(config: IBeaconConfig, state: BeaconState): Promise<void>;
  /**
   * A checkpoint is finalized in ETH2.
   * @param config 
   * @param state 
   */
  pruneBlockCache(config: IBeaconConfig, state: BeaconState): void;

  /**
   * Find candidate blocks;
   * @param blockNumber 
   */
  findBlocks(config: IBeaconConfig, periodStart: Number64): Block[];

  /**
   * Process new block events sent from the Eth 1.0 chain
   */
  processBlockHeadUpdate(blockNumber: number|string): Promise<void>;

  /**
   * Process a Desposit log which has been received from the Eth 1.0 chain
   */
  processDepositLog(
    pubkey: string,
    withdrawalCredentials: string,
    amount: string,
    signature: string,
    merkleTreeIndex: string
  ): Promise<void>;

  /**
   * Obtains Deposit logs between given range of blocks
   * @param fromBlock either block hash or block number
   * @param toBlock optional, if not submitted it will assume latest
   */
  processPastDeposits(
    fromBlock: string | Number64, toBlock?: string | Number64
  ): Promise<void>;

  /**
   * Return the latest block
   */
  getHead(): Promise<Block>;

  /**
   * Returns block by block hash or number
   * @param blockHashOrBlockNumber
   */
  getBlock(blockHashOrBlockNumber: string | number): Promise<Block>;

  /**
   * Return the merkle root of the deposits
   */
  depositRoot(block?: string | number): Promise<Uint8Array>;

  /**
   * Retruns deposit count
   * @param block
   */
  depositCount(block?: string | number): Promise<Number64>;

  getEth1Vote(config: IBeaconConfig, state: BeaconState): Promise<Eth1Data>;

  getEth1Data(block: Block): Promise<Eth1Data>;
}

/**
 * Eth1 block cache interface for eth1 data vote.
 */
export interface IBlockCache<T> {
  init(blocks: T[], head: T): void;
  hasBlock(block: T): boolean;
  addBlock(block: T): void;
  prune(timestamp: number): void;
  findBlocksByTimestamp(fromTime?: number, toTime?: number): T[];
  requestNewBlock(head: T): number | undefined;
}

/**
 * Eth1 block interface.
 */
export interface IBlock {
  timestamp: Number64;
  number: number;
}

/**
 * Eth1 block range.
 */
export interface Eth1BlockRange {
  fromNumber: number;
  toNumber: number;
}