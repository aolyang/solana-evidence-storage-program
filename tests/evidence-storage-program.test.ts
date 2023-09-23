import chai from "chai"

import * as anchor from "@coral-xyz/anchor";
import {Program} from "@coral-xyz/anchor";
import {EvidenceStorage} from "../target/types/evidence_storage";

const expect = chai.expect;

describe("Test Evidence Storage Initialize", () => {
    // Configure the client to use the local cluster.
    anchor.setProvider(anchor.AnchorProvider.env());

    const program = anchor.workspace.EvidenceStorage as Program<EvidenceStorage>;

    const provider = anchor.AnchorProvider.env();
    const authority = provider.wallet.publicKey;

    let [baseAccount] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("user-evidences")],
        program.programId
    );

    it("Is initialized!", async () => {
        // Add your test here.
        await program.methods.initialize().accounts({
            baseAccount,
            authority,
            systemProgram: anchor.web3.SystemProgram.programId,
        }).rpc();
    });

    it("add a evidence hash", async () => {
        const evidenceHash = "first-evidence-hash"

        await program.methods.addEvidence(evidenceHash).accounts({
            baseAccount
        }).rpc()

        const newState = await program.account.baseAccount.fetch(baseAccount);

        expect(
            newState.evidences.some(item => {
                return item.hash === evidenceHash
            })
        ).equal(true)
    })

    it("evidence should be add only once", async () => {
        const hashes = [
            "first-evidence-hash",
            "second-evidence-hash",
            "first-evidence-hash"
        ]
        for (const hash of hashes) {
            await program.methods.addEvidence(hash).accounts({
                baseAccount
            }).rpc()
        }

        const newState = await program.account.baseAccount.fetch(baseAccount);

        const repeatCount = newState.evidences
            .filter(item => item.hash === hashes[0])
            .length

        const totalCount = newState.evidences.length

        expect(repeatCount).equal(1)
        expect(totalCount).equal(2)
    })
});
