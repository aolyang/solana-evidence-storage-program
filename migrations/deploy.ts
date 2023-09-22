import * as anchor from "@coral-xyz/anchor";
import {Program} from "@coral-xyz/anchor";
import {EvidenceStorage} from "../target/types/evidence_storage";

describe("Evidences storage test", () => {
    let provider = anchor.AnchorProvider.env();
    // Configure the client to use the local cluster.
    anchor.setProvider(provider);

    const program = anchor.workspace.EvidenceStorage as Program<EvidenceStorage>;

    const authority = provider.wallet.publicKey;

    let [baseAccount] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("user-evidences")],
        program.programId
    );

    it("Is initialized!", async () => {
        // Add your test here.
        const tx = await program.methods.initialize().accounts({
            baseAccount,
            authority,
            systemProgram: anchor.web3.SystemProgram.programId,
        }).rpc();

        console.log("tx signature: ", tx);

        // Fetch the state struct from the network.
        const accountState = await program.account.baseAccount.fetch(baseAccount);
        console.log("account state: ", accountState);
    });

    it("get hello world!", async () => {

        // Add your test here.
        const tx = await program.methods.update("Davirain").accounts({
            baseAccount,
        }).rpc();

        console.log("tx signature: ", tx);


        // Fetch the state struct from the network.
        const accountState = await program.account.baseAccount.fetch(baseAccount);
        console.log("account state: ", accountState);
    });


    it("read account name", async () => {
        // Fetch the state struct from the network.
        const accountState = await program.account.baseAccount.fetch(baseAccount);
        console.log("account state: ", accountState);
    });
});