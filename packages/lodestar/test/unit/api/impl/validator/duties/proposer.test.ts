import {config} from "@chainsafe/lodestar-config/lib/presets/minimal";
import sinon, {SinonStubbedInstance} from "sinon";
import {BlockRepository, StateRepository} from "../../../../../../src/db/api/beacon/repositories";
import {generateState} from "../../../../../utils/state";
import {generateValidators} from "../../../../../utils/validator";
import {expect} from "chai";
import {FAR_FUTURE_EPOCH} from "../../../../../../src/constants";
import {BeaconChain, IBeaconChain} from "../../../../../../src/chain";
import {IValidatorApi, ValidatorApi} from "../../../../../../src/api/impl/validator";


describe("get proposers api impl", function () {

  const sandbox = sinon.createSandbox();

  let dbStub: any, chainStub: SinonStubbedInstance<IBeaconChain>;
  
  let api: IValidatorApi;

  beforeEach(function () {
    dbStub = {
      state: sandbox.createStubInstance(StateRepository),
      block: sandbox.createStubInstance(BlockRepository),
    };
    chainStub = sandbox.createStubInstance(BeaconChain);
    // @ts-ignore
    api = new ValidatorApi({}, {db: dbStub, chain: chainStub, config});
  });

  afterEach(function () {
    sandbox.restore();
  });

  it("should get proposers", async function () {
    dbStub.block.get.resolves({message: {stateRoot: Buffer.alloc(32)}});
    chainStub.getHeadState.resolves(
      generateState(
        {
          slot: 0,
          validators: generateValidators(
            25,
            {balance: config.params.MAX_EFFECTIVE_BALANCE, activation: 0, exit: FAR_FUTURE_EPOCH}
          ),
          balances: Array.from({length: 25}, () => config.params.MAX_EFFECTIVE_BALANCE)
        }, config),

    );
    const result = await api.getProposerDuties(1);
    expect(result.size).to.be.equal(config.params.SLOTS_PER_EPOCH);
  });

  it("should get future proposers", async function () {
    chainStub.getHeadState.resolves(
      generateState(
        {
          slot: config.params.SLOTS_PER_EPOCH - 3,
          validators: generateValidators(
            25,
            {balance: config.params.MAX_EFFECTIVE_BALANCE, activation: 0, exit: FAR_FUTURE_EPOCH}
          ),
          balances: Array.from({length: 25}, () => config.params.MAX_EFFECTIVE_BALANCE)
        }, config),

    );
    const result = await api.getProposerDuties(2);
    expect(result.size).to.be.equal(config.params.SLOTS_PER_EPOCH);
  });
    
});
